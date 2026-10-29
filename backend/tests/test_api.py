from datetime import datetime, timezone

from fastapi.testclient import TestClient

from app.main import app


def login(client: TestClient) -> dict:
    response = client.post(
        "/api/auth/login",
        json={
            "name": "Carlos",
            "email": "carlos@example.com",
            "password": "bairro123",
            "neighborhood": "Centro",
            "latitude": -25.4296,
            "longitude": -49.2719,
        },
    )
    assert response.status_code == 200
    return response.json()


def test_complete_mvp_flow(tmp_path, monkeypatch):
    monkeypatch.setenv("ALERTA_DATABASE_PATH", str(tmp_path / "test.db"))
    with TestClient(app) as client:
        auth = login(client)
        headers = {"Authorization": f"Bearer {auth['token']}"}

        created = client.post(
            "/api/incidents",
            headers=headers,
            json={
                "type": "Furto de celular",
                "location_reference": "Próximo à padaria",
                "neighborhood": "Centro",
                "latitude": -25.4300,
                "longitude": -49.2720,
                "occurred_at": datetime.now(timezone.utc).isoformat(),
            },
        )
        assert created.status_code == 201
        assert created.json()["distance_km"] < 0.5

        settings = client.put(
            "/api/alerts/settings",
            headers=headers,
            json={"radius_km": 1.0, "latitude": -25.4296, "longitude": -49.2719},
        )
        assert settings.status_code == 200
        assert settings.json()["radius_km"] == 1.0

        alerts = client.get("/api/alerts", headers=headers)
        assert alerts.status_code == 200
        assert any(item["id"] == created.json()["id"] for item in alerts.json())
        assert all(item["distance_km"] <= 1.0 for item in alerts.json())
        assert not any(item["distance_km"] > settings.json()["radius_km"] for item in alerts.json())


def test_protected_endpoint_requires_session(tmp_path, monkeypatch):
    monkeypatch.setenv("ALERTA_DATABASE_PATH", str(tmp_path / "test.db"))
    with TestClient(app) as client:
        response = client.get("/api/incidents")
    assert response.status_code == 401
