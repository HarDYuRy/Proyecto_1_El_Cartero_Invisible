import json

import pytest
from httpx import ASGITransport, AsyncClient

import main


app = main.app


@pytest.fixture(autouse=True)
def netejar_cartes(tmp_path, monkeypatch):
    # Fitxer temporal i llista buida per a cada test.
    ruta_test = tmp_path / "cartas.json"
    ruta_test.write_text("[]", encoding="utf-8")

    monkeypatch.setattr(main, "DATA_FILE", str(ruta_test))
    monkeypatch.setattr(main, "cartes", [])


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
            creada = await ac.post("/cartas", json={
                "remitent": remitent,
                "destinatari": "Erik",
                "contingut": "Carta de prova",
                "personatge": "Carter"
            })
            assert creada.status_code == 200

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
            creada = await ac.post("/cartas", json={
                "remitent": f"Persona {i}",
                "destinatari": "Erik",
                "contingut": "Carta de prova",
                "personatge": "Carter"
            })
            assert creada.status_code == 200

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
            creada = await ac.post("/cartas", json={
                "remitent": remitent,
                "destinatari": "Erik",
                "contingut": "Carta de prova",
                "personatge": "Carter"
            })
            assert creada.status_code == 200

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
        creada = await ac.post("/cartas", json={
            "remitent": "Maria",
            "destinatari": "Erik",
            "contingut": "Carta 1",
            "personatge": "Carter"
        })
        assert creada.status_code == 200

        creada = await ac.post("/cartas", json={
            "remitent": "Xavi",
            "destinatari": "Erik",
            "contingut": "Carta 2",
            "personatge": "Professor"
        })
        assert creada.status_code == 200

        response = await ac.get("/cartes?personaje=Professor")

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["remitent"] == "Xavi"


@pytest.mark.asyncio
async def test_obtenir_carta():
    nova_carta = {
        "remitent": "Joan",
        "destinatari": "Erik",
        "contingut": "T'escric des del passat.",
        "personatge": "Carter"
    }

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        creada = await ac.post("/cartas", json=nova_carta)
        assert creada.status_code == 200

        carta_creada = creada.json()
        response = await ac.get(f"/cartes/{carta_creada['id']}")

    assert response.status_code == 200
    assert response.json() == carta_creada


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
    assert response.json() == {**nova_carta, "id": 1}


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
        creada = await ac.post("/cartas", json=nova_carta)
        assert creada.status_code == 200
        assert creada.json() == {**nova_carta, "id": 1}

        response = await ac.get("/cartes")

    assert response.status_code == 200
    assert response.json() == [creada.json()]


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

    payload = {
        "remitent": "Test",
        "destinatari": "Test",
        "contingut": "Test",
        "personatge": "Test"
    }

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.post("/cartas", json=payload)

    assert response.status_code == 200
    assert response.json() == {**payload, "id": 1}

    with open(main.DATA_FILE, "r", encoding="utf-8") as f:
        dades_despres = json.load(f)

    assert len(dades_despres) == len(dades_abans) + 1
    assert dades_despres == dades_abans + [response.json()]


@pytest.mark.asyncio
async def test_delete_carta():
    nova_carta = {
        "remitent": "Maria",
        "destinatari": "Erik",
        "contingut": "Carta de prova",
        "personatge": "Carter"
    }

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        creada = await ac.post("/cartas", json=nova_carta)
        assert creada.status_code == 200

        carta_id = creada.json()["id"]

        response = await ac.delete(f"/cartes/{carta_id}")
        consulta = await ac.get(f"/cartes/{carta_id}")

    assert response.status_code == 200
    assert response.json() == {"missatge": "Carta eliminada"}
    assert consulta.status_code == 404

    with open(main.DATA_FILE, "r", encoding="utf-8") as f:
        dades = json.load(f)

    assert not any(c.get("id") == carta_id for c in dades)


@pytest.mark.asyncio
async def test_cors_headers():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get(
            "/cartes",
            headers={"Origin": "http://127.0.0.1:5500"}
        )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == (
        "http://127.0.0.1:5500"
    )


@pytest.mark.asyncio
async def test_get_cartes():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/cartes")

    assert response.status_code == 200
    assert response.json() == []