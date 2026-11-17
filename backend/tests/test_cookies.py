import pytest
from httpx import ASGITransport, AsyncClient

import main


app = main.app


@pytest.fixture(autouse=True)
def netejar_cartes(tmp_path, monkeypatch):
    # Cada test utiliza una lista vacía y un archivo temporal.
    ruta_test = tmp_path / "cartas.json"
    ruta_test.write_text("[]", encoding="utf-8")

    monkeypatch.setattr(main, "DATA_FILE", str(ruta_test))
    monkeypatch.setattr(main, "cartes", [])


@pytest.mark.asyncio
async def test_set_cookie_login():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.post("/login")

        assert response.status_code == 200
        assert "set-cookie" in response.headers

        usuari_id = response.json()["usuari_id"]
        assert usuari_id.startswith("user_")
        assert ac.cookies.get("usuari_id") == usuari_id

        # El cliente envía automáticamente la cookie recibida.
        perfil = await ac.get("/perfil")
        assert perfil.status_code == 200
        assert perfil.json()["usuari_id"] == usuari_id


@pytest.mark.asyncio
async def test_get_cookie_perfil():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        ac.cookies.set("usuari_id", "user_test")
        response = await ac.get("/perfil")

        assert response.status_code == 200
        assert response.json()["usuari_id"] == "user_test"
        assert response.json()["cartes"] == []


@pytest.mark.asyncio
async def test_perfil_sense_cookie():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/perfil")

        assert response.status_code == 401


@pytest.mark.asyncio
async def test_post_associa_la_carta_a_l_usuari():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        ac.cookies.set("usuari_id", "user_test")

        payload = {
            "remitent": "Pau",
            "destinatari": "Anna",
            "contingut": "Hola",
            "personatge": "Einstein"
        }

        response = await ac.post("/cartas", json=payload)

        assert response.status_code == 201
        assert response.json()["usuari_id"] == "user_test"

        perfil = await ac.get("/perfil")

        assert perfil.status_code == 200
        assert [
            carta["id"] for carta in perfil.json()["cartes"]
        ] == [response.json()["id"]]