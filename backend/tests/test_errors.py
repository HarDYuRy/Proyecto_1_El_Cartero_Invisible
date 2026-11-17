import json

import pytest
from httpx import ASGITransport, AsyncClient

import main


app = main.app


@pytest.fixture(autouse=True)
def cartes_temporals(tmp_path, monkeypatch):
    # Aïllar les proves de les cartes reals.
    fitxer = tmp_path / "cartas.json"
    fitxer.write_text("[]", encoding="utf-8")

    monkeypatch.setattr(main, "DATA_FILE", str(fitxer))
    monkeypatch.setattr(main, "cartes", [])


@pytest.mark.asyncio
async def test_get_carta_not_found():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/cartas/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Carta no trobada"


@pytest.mark.asyncio
async def test_post_carta_invalid():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.post(
            "/cartas",
            json={"remitent": "Pau"}
        )

    assert response.status_code == 422
    assert main.cartes == []


@pytest.mark.asyncio
async def test_post_contingut_buit():
    payload = {
        "remitent": "Pau",
        "destinatari": "Anna",
        "contingut": "   ",
        "personatge": "Einstein"
    }

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.post("/cartas", json=payload)

    assert response.status_code == 422
    assert response.json()["detail"] == "El contingut no pot estar buit"
    assert main.cartes == []

    with open(main.DATA_FILE, encoding="utf-8") as fitxer:
        assert json.load(fitxer) == []


@pytest.mark.asyncio
async def test_delete_inexistent():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.delete("/cartas/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Carta no trobada"