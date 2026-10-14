
import json
import pytest
from httpx import ASGITransport, AsyncClient
import main

app = main.app
cartes = main.cartes


@pytest.fixture(autouse=True)
def netejar_cartes(tmp_path, monkeypatch):
    # Guardar las cartas originales
    cartes_originals = cartes.copy()

    # Archivo JSON temporal para no modificar el real
    ruta_test = tmp_path / "cartas.json"
    ruta_test.write_text("[]", encoding="utf-8")

    monkeypatch.setattr(main, "DATA_FILE", str(ruta_test))
    cartes.clear()

    yield

    # Restaurar las cartas originales
    cartes.clear()
    cartes.extend(cartes_originals)


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
        for remitent in ["Maria", "Joan", "Xavi"]:
            await ac.post("/cartas", json={
                "remitent": remitent,
                "destinatari": "Erik",
                "contingut": "Carta de prova",
                "personatge": "Carter"
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
        for remitent in ["Maria", "Joan", "Xavi"]:
            await ac.post("/cartas", json={
                "remitent": remitent,
                "destinatari": "Erik",
                "contingut": "Carta de prova",
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

        response = await ac.get("/cartes?personaje=Professor")

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["remitent"] == "Xavi"

    
@pytest.mark.asyncio
async def test_obtenir_carta():
    # Este endpoint usa datos simulados en tu main.py
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
        response = await ac.post("/cartas", json=nova_carta)

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
    }

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.post("/cartas", json=carta_invalida)

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_persistencia_post():
    with open(main.DATA_FILE, "r", encoding="utf-8") as f:
        dades_abans = json.load(f)

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        payload = {
            "remitent": "Test",
            "destinatari": "Test",
            "contingut": "Test",
            "personatge": "Test"
        }

        response = await ac.post("/cartas", json=payload)

    assert response.status_code == 200

    with open(main.DATA_FILE, "r", encoding="utf-8") as f:
        dades_despres = json.load(f)

    assert len(dades_despres) == len(dades_abans) + 1
    assert dades_despres[0] == payload


@pytest.mark.asyncio
async def test_delete_carta():
    # Preparar una carta con ID para probar DELETE
    carta = {
        "id": 1,
        "remitent": "Maria",
        "destinatari": "Erik",
        "contingut": "Carta de prova",
        "personatge": "Carter"
    }

    cartes.append(carta)
    main.guardar_cartes(cartes)

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.delete("/cartas/1")

    assert response.status_code == 200

    with open(main.DATA_FILE, "r", encoding="utf-8") as f:
        dades = json.load(f)

    assert not any(c.get("id") == 1 for c in dades)
