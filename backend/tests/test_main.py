import pytest
from httpx import ASGITransport, AsyncClient
from main import app


@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/")

    assert response.status_code == 200
    assert response.json() == {"missatge": "Hola, món!"}


@pytest.mark.asyncio
async def test_llistar_cartes():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/cartes")

    assert response.status_code == 200
    assert len(response.json()) == 3


@pytest.mark.asyncio
async def test_limit_cartes():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/cartes?limit=2")

    assert response.status_code == 200
    assert len(response.json()) == 2


@pytest.mark.asyncio
async def test_offset_cartes():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/cartes?offset=1")

    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0]["id"] == 2


@pytest.mark.asyncio
async def test_filtrar_personaje():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/cartes?personaje=Xavi")

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["remitent"] == "Xavi"


@pytest.mark.asyncio
async def test_obtenir_carta():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/cartes/2")

    assert response.status_code == 200
    assert response.json() == {
        "id": 2,
        "remitent": "Joan",
        "contingut": "T'escric des del passat."
    }


@pytest.mark.asyncio
async def test_carta_no_existeix():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/cartes/99")

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Carta no encontrada"
    }