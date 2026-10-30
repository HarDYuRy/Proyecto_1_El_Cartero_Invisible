import pytest
from httpx import ASGITransport, AsyncClient

import main


@pytest.mark.asyncio
async def test_config_no_exposa_la_clau(monkeypatch):
    # Clau ficticia: no depenem del .env ni contactem amb Gemini.
    monkeypatch.setattr(main, "GEMINI_API_KEY", "clau_secreta_de_prova")
    monkeypatch.setattr(main, "DEBUG", False)

    async with AsyncClient(
        transport=ASGITransport(app=main.app), base_url="http://test"
    ) as ac:
        response = await ac.get("/config")

    assert response.status_code == 200
    assert response.json() == {"debug": False, "ia_configurada": True}
    assert "clau_secreta_de_prova" not in response.text


@pytest.mark.asyncio
@pytest.mark.parametrize("clau", [None, ""])
async def test_config_sense_clau(monkeypatch, clau):
    monkeypatch.setattr(main, "GEMINI_API_KEY", clau)
    monkeypatch.setattr(main, "DEBUG", False)

    async with AsyncClient(
        transport=ASGITransport(app=main.app), base_url="http://test"
    ) as ac:
        response = await ac.get("/config")

    assert response.status_code == 200
    assert response.json() == {"debug": False, "ia_configurada": False}