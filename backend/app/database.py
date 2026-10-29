import os
import sqlite3
from pathlib import Path


def database_path() -> Path:
    configured = os.getenv("ALERTA_DATABASE_PATH")
    if configured:
        return Path(configured)
    return Path(__file__).resolve().parents[1] / "data" / "alerta.db"


def connect() -> sqlite3.Connection:
    path = database_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(path)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_db() -> None:
    with connect() as db:
        db.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                neighborhood TEXT NOT NULL,
                home_latitude REAL NOT NULL,
                home_longitude REAL NOT NULL,
                alert_radius_km REAL NOT NULL DEFAULT 2.0,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS incidents (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                location_reference TEXT NOT NULL,
                neighborhood TEXT NOT NULL,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                occurred_at TEXT NOT NULL,
                created_at TEXT NOT NULL,
                created_by TEXT NOT NULL REFERENCES users(id)
            );

            CREATE INDEX IF NOT EXISTS idx_incidents_created_at
            ON incidents(created_at DESC);
            """
        )
