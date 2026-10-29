from __future__ import annotations

import hashlib
import hmac
import math
import os
import re
import secrets
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, FastAPI, Header, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from .database import connect, init_db


INCIDENT_TYPES = (
    "Furto de celular",
    "Roubo de celular",
    "Furto de veículo",
    "Roubo de veículo",
    "Furto em residência",
    "Atividade suspeita",
    "Outro",
)


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def iso(value: datetime) -> str:
    return value.astimezone(timezone.utc).isoformat()


def hash_password(password: str, salt: bytes | None = None) -> str:
    actual_salt = salt or os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), actual_salt, 210_000)
    return f"{actual_salt.hex()}:{digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    salt_hex, digest_hex = stored.split(":", 1)
    candidate = hash_password(password, bytes.fromhex(salt_hex)).split(":", 1)[1]
    return hmac.compare_digest(candidate, digest_hex)


def distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6371.0088
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
    return radius * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


class LoginInput(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: str = Field(min_length=5, max_length=160)
    password: str = Field(min_length=6, max_length=128)
    neighborhood: str = Field(min_length=2, max_length=80)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)

    @field_validator("email")
    @classmethod
    def valid_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", normalized):
            raise ValueError("Informe um e-mail válido")
        return normalized


class UserOutput(BaseModel):
    id: str
    name: str
    email: str
    neighborhood: str
    latitude: float
    longitude: float
    alert_radius_km: float


class AuthOutput(BaseModel):
    token: str
    user: UserOutput
    account_created: bool


class IncidentInput(BaseModel):
    type: str
    location_reference: str = Field(min_length=3, max_length=120)
    neighborhood: str = Field(min_length=2, max_length=80)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    occurred_at: datetime

    @field_validator("type")
    @classmethod
    def known_type(cls, value: str) -> str:
        if value not in INCIDENT_TYPES:
            raise ValueError("Tipo de ocorrência inválido")
        return value


class IncidentOutput(IncidentInput):
    id: str
    created_at: datetime
    distance_km: float | None = None


class AlertSettingsInput(BaseModel):
    radius_km: float = Field(ge=0.5, le=10)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)


class AlertSettingsOutput(AlertSettingsInput):
    neighborhood: str


def user_from_row(row) -> UserOutput:
    return UserOutput(
        id=row["id"],
        name=row["name"],
        email=row["email"],
        neighborhood=row["neighborhood"],
        latitude=row["home_latitude"],
        longitude=row["home_longitude"],
        alert_radius_km=row["alert_radius_km"],
    )


def incident_from_row(row, origin: tuple[float, float] | None = None) -> IncidentOutput:
    distance = None
    if origin:
        distance = round(distance_km(origin[0], origin[1], row["latitude"], row["longitude"]), 2)
    return IncidentOutput(
        id=row["id"],
        type=row["type"],
        location_reference=row["location_reference"],
        neighborhood=row["neighborhood"],
        latitude=row["latitude"],
        longitude=row["longitude"],
        occurred_at=row["occurred_at"],
        created_at=row["created_at"],
        distance_km=distance,
    )


def current_user(authorization: Annotated[str | None, Header()] = None) -> UserOutput:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sessão necessária")
    token = authorization.removeprefix("Bearer ").strip()
    with connect() as db:
        row = db.execute(
            """SELECT users.* FROM sessions
               JOIN users ON users.id = sessions.user_id
               WHERE sessions.token = ?""",
            (token,),
        ).fetchone()
    if not row:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sessão inválida")
    return user_from_row(row)


def seed_demo_data() -> None:
    with connect() as db:
        count = db.execute("SELECT COUNT(*) AS count FROM incidents").fetchone()["count"]
        if count:
            return
        demo_id = "demo-user"
        db.execute(
            """INSERT OR IGNORE INTO users
               (id, name, email, password_hash, neighborhood, home_latitude, home_longitude, alert_radius_km, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (demo_id, "Comunidade", "demo@alerta.local", hash_password(secrets.token_urlsafe(12)), "Centro", -25.4296, -49.2719, 2.0, iso(utc_now())),
        )
        examples = (
            ("Furto de celular", "Próximo à Praça Osório", "Centro", -25.4311, -49.2766, 1),
            ("Atividade suspeita", "Rua XV, próximo ao calçadão", "Centro", -25.4292, -49.2701, 3),
            ("Furto de veículo", "Estacionamento próximo ao Passeio Público", "Centro", -25.4224, -49.2682, 7),
            ("Roubo de celular", "Próximo à Praça Rui Barbosa", "Centro", -25.4357, -49.2738, 22),
        )
        now = utc_now()
        for incident_type, reference, neighborhood, lat, lng, hours in examples:
            occurred = now - timedelta(hours=hours)
            db.execute(
                """INSERT INTO incidents
                   (id, type, location_reference, neighborhood, latitude, longitude, occurred_at, created_at, created_by)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (str(uuid.uuid4()), incident_type, reference, neighborhood, lat, lng, iso(occurred), iso(occurred), demo_id),
            )


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    seed_demo_data()
    yield


app = FastAPI(
    title="Alerta do Bairro API",
    version="1.0.0",
    description="API do MVP comunitário de ocorrências e alertas por proximidade.",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv("ALERTA_CORS_ORIGINS", "http://localhost:5173").split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/auth/login", response_model=AuthOutput)
def login(payload: LoginInput):
    with connect() as db:
        existing = db.execute("SELECT * FROM users WHERE email = ?", (payload.email,)).fetchone()
        created = existing is None
        if existing and not verify_password(payload.password, existing["password_hash"]):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="E-mail ou senha incorretos")
        if not existing:
            user_id = str(uuid.uuid4())
            db.execute(
                """INSERT INTO users
                   (id, name, email, password_hash, neighborhood, home_latitude, home_longitude, alert_radius_km, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, 2.0, ?)""",
                (user_id, payload.name.strip(), payload.email, hash_password(payload.password), payload.neighborhood.strip(), payload.latitude, payload.longitude, iso(utc_now())),
            )
            existing = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        token = secrets.token_urlsafe(32)
        db.execute("INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)", (token, existing["id"], iso(utc_now())))
    return AuthOutput(token=token, user=user_from_row(existing), account_created=created)


@app.get("/api/auth/me", response_model=UserOutput)
def me(user: Annotated[UserOutput, Depends(current_user)]):
    return user


@app.get("/api/incidents", response_model=list[IncidentOutput])
def list_incidents(
    user: Annotated[UserOutput, Depends(current_user)],
    latitude: Annotated[float | None, Query(ge=-90, le=90)] = None,
    longitude: Annotated[float | None, Query(ge=-180, le=180)] = None,
    radius_km: Annotated[float | None, Query(ge=0.5, le=50)] = None,
):
    origin = (latitude, longitude) if latitude is not None and longitude is not None else (user.latitude, user.longitude)
    cutoff = iso(utc_now() - timedelta(days=7))
    with connect() as db:
        rows = db.execute("SELECT * FROM incidents WHERE occurred_at >= ? ORDER BY occurred_at DESC", (cutoff,)).fetchall()
    incidents = [incident_from_row(row, origin) for row in rows]
    if radius_km is not None:
        incidents = [item for item in incidents if item.distance_km is not None and item.distance_km <= radius_km]
    return incidents


@app.post("/api/incidents", response_model=IncidentOutput, status_code=status.HTTP_201_CREATED)
def create_incident(payload: IncidentInput, user: Annotated[UserOutput, Depends(current_user)]):
    if payload.occurred_at > utc_now() + timedelta(minutes=5):
        raise HTTPException(status_code=422, detail="O horário não pode estar no futuro")
    incident_id = str(uuid.uuid4())
    created_at = utc_now()
    with connect() as db:
        db.execute(
            """INSERT INTO incidents
               (id, type, location_reference, neighborhood, latitude, longitude, occurred_at, created_at, created_by)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (incident_id, payload.type, payload.location_reference.strip(), payload.neighborhood.strip(), payload.latitude, payload.longitude, iso(payload.occurred_at), iso(created_at), user.id),
        )
        row = db.execute("SELECT * FROM incidents WHERE id = ?", (incident_id,)).fetchone()
    return incident_from_row(row, (user.latitude, user.longitude))


@app.get("/api/alerts/settings", response_model=AlertSettingsOutput)
def get_alert_settings(user: Annotated[UserOutput, Depends(current_user)]):
    return AlertSettingsOutput(radius_km=user.alert_radius_km, latitude=user.latitude, longitude=user.longitude, neighborhood=user.neighborhood)


@app.put("/api/alerts/settings", response_model=AlertSettingsOutput)
def update_alert_settings(payload: AlertSettingsInput, user: Annotated[UserOutput, Depends(current_user)]):
    with connect() as db:
        db.execute(
            "UPDATE users SET alert_radius_km = ?, home_latitude = ?, home_longitude = ? WHERE id = ?",
            (payload.radius_km, payload.latitude, payload.longitude, user.id),
        )
    return AlertSettingsOutput(radius_km=payload.radius_km, latitude=payload.latitude, longitude=payload.longitude, neighborhood=user.neighborhood)


@app.get("/api/alerts", response_model=list[IncidentOutput])
def list_alerts(user: Annotated[UserOutput, Depends(current_user)]):
    cutoff = iso(utc_now() - timedelta(days=7))
    origin = (user.latitude, user.longitude)
    with connect() as db:
        rows = db.execute("SELECT * FROM incidents WHERE occurred_at >= ? ORDER BY occurred_at DESC", (cutoff,)).fetchall()
    incidents = [incident_from_row(row, origin) for row in rows]
    return [item for item in incidents if item.distance_km is not None and item.distance_km <= user.alert_radius_km]
