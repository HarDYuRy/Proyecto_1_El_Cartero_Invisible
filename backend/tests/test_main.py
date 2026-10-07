import pytest
from httpx import ASGITransport, AsyncClient
from main import app, cartes

@pytest.fixture(autouse=True)
def netejar_cartes():
    cartes.clear()

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
        await ac.post("/cartas", json={
            "remitent": "Maria",
            "destinatari": "Erik",
            "contingut": "Carta 1",
            "personatge": "Carter"
        })
        await ac.post("/cartas", json={
            "remitent": "Joan",
            "destinatari": "Erik",
            "contingut": "Carta 2",
            "personatge": "Carter"
        })
        await ac.post("/cartas", json={
            "remitent": "Xavi",
            "destinatari": "Erik",
            "contingut": "Carta 3",
            "personatge": "Professor"
        })
        response = await ac.get("/cartes")
    assert response.status_code == 200
    assert len(response.json()) == 3

@pytest.mark.asyncio
async def test_limit_cartes():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:

        for i in range(3):
            await ac.post("/cartas", json={
                "remitent": f"Persona {i}",
                "destinatari": "Erik",
                "contingut": "Carta de prova",
                "personatge": "Carter"
            })
        response = await ac.get("/cartes?limit=2")
    assert response.status_code == 200
    assert len(response.json()) == 2

@pytest.mark.asyncio
async def test_offset_cartes():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        await ac.post("/cartas", json={
            "remitent": "Maria",
            "destinatari": "Erik",
            "contingut": "Carta 1",
            "personatge": "Carter"
        })
        await ac.post("/cartas", json={
            "remitent": "Joan",
            "destinatari": "Erik",
            "contingut": "Carta 2",
            "personatge": "Carter"
        })
        await ac.post("/cartas", json={
            "remitent": "Xavi",
            "destinatari": "Erik",
            "contingut": "Carta 3",
            "personatge": "Carter"
        })
        response = await ac.get("/cartes?offset=1")
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0]["remitent"] == "Joan"

@pytest.mark.asyncio
async def test_filtrar_personaje():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        await ac.post("/cartas", json={
            "remitent": "Maria",
            "destinatari": "Erik",
            "contingut": "Carta 1",
            "personatge": "Carter"
        })
        await ac.post("/cartas", json={
            "remitent": "Xavi",
            "destinatari": "Erik",
            "contingut": "Carta 2",
            "personatge": "Professor"
        })
        response = await ac.get(
            "/cartes?personaje=Professor"
        )
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

@pytest.mark.asyncio
async def test_crear_carta():
    nova_carta = {
        "remitent": "Erik",
        "destinatari": "Joan",
        "contingut": "Hola!",
        "personatge": "Carter"
    }
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.post(
            "/cartas",
            json=nova_carta
        )
    assert response.status_code == 200
    assert response.json() == nova_carta

@pytest.mark.asyncio
async def test_carta_es_guarda():
    nova_carta = {
        "remitent": "Maria",
        "destinatari": "Erik",
        "contingut": "Hola!",
        "personatge": "Carter"
    }
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        await ac.post("/cartas", json=nova_carta)
        response = await ac.get("/cartes")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0] == nova_carta

@pytest.mark.asyncio
async def test_carta_invalida():
    carta_invalida = {
        "remitent": "Maria",
        "destinatari": "Erik",
        "contingut": "Hola!"
        # Falta personatge
    }
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.post(
            "/cartas",
            json=carta_invalida
        )
    assert response.status_code == 422