import json
from pathlib import Path

import pytest
from httpx import ASGITransport, AsyncClient

import main

@pytest.fixture(autouse=True)
def cartes_temporals(tmp_path, monkeypatch):
    """Cada test te la seva llista i el seu fitxer, sense cartes reals."""
    fitxer = tmp_path / "cartas.json"
    fitxer.write_text("[]", encoding="utf-8")
    monkeypatch.setattr(main, "DATA_FILE", str(fitxer))
    monkeypatch.setattr(main, "cartes", [])


def llegir_fitxer():
    return json.loads(Path(main.DATA_FILE).read_text(encoding="utf-8"))


def dades_carta(contingut="Carta original"):
    return {
        "remitent": "Erik", "destinatari": "Maria",
        "contingut": contingut, "personatge": "Astra"
    }


@pytest.mark.asyncio
async def test_put_actualitza_i_persisteix_sense_canviar_id():
    async with AsyncClient(transport=ASGITransport(app=main.app), base_url="http://test") as client:
        creada = await client.post("/cartas", json=dades_carta())
        altra = await client.post("/cartas", json=dades_carta("No modificar"))
        assert creada.status_code == altra.status_code == 200
        carta_id = creada.json()["id"]
        noves_dades = {
            "remitent": "Joan", "destinatari": "Anna",
            "contingut": "Contingut nou amb accents: adeu, món!", "personatge": "Carter"
        }

        # Un ID enviat al cos no ha de substituir el de la URL.
        resposta = await client.put(f"/cartas/{carta_id}", json={**noves_dades, "id": 999})
        esperada = {**noves_dades, "id": carta_id}
        assert resposta.status_code == 200
        assert resposta.json() == esperada
        consulta = await client.get(f"/cartes/{carta_id}")
        assert consulta.json() == esperada
        assert llegir_fitxer() == [esperada, altra.json()]
        # Tornar a llegir del disc conserva el canvi.
        assert main.cargar_cartes() == [esperada, altra.json()]


@pytest.mark.asyncio
async def test_put_inexistent_retorna_404_sense_modificar_fitxer():
    async with AsyncClient(transport=ASGITransport(app=main.app), base_url="http://test") as client:
        creada = await client.post("/cartas", json=dades_carta())
        assert creada.status_code == 200
        resposta = await client.put("/cartas/999", json=dades_carta("Canvi"))
        assert resposta.status_code == 404
        assert resposta.json() == {"detail": "Carta no trobada"}
        assert llegir_fitxer() == [creada.json()]
        assert (await client.get("/cartes")).json() == [creada.json()]


@pytest.mark.asyncio
@pytest.mark.parametrize("camp,valor", [("personatge", None), ("contingut", {"invalid": True})])
async def test_put_invalid_retorna_422_i_conserva_carta(camp, valor):
    async with AsyncClient(transport=ASGITransport(app=main.app), base_url="http://test") as client:
        creada = await client.post("/cartas", json=dades_carta())
        assert creada.status_code == 200
        dades = dades_carta("Canvi rebutjat")
        if valor is None:
            del dades[camp]  # Falta un camp obligatori.
        else:
            dades[camp] = valor  # Tipus incorrecte.
        resposta = await client.put(f"/cartas/{creada.json()['id']}", json=dades)
        assert resposta.status_code == 422
        assert llegir_fitxer() == [creada.json()]
        assert (await client.get("/cartes")).json() == [creada.json()]


@pytest.mark.asyncio
async def test_delete_persisteix_i_conserva_les_altres_cartes():
    async with AsyncClient(transport=ASGITransport(app=main.app), base_url="http://test") as client:
        creada = await client.post("/cartas", json=dades_carta())
        altra = await client.post("/cartas", json=dades_carta("Conservar"))
        assert creada.status_code == altra.status_code == 200
        carta_id = creada.json()["id"]
        resposta = await client.delete(f"/cartes/{carta_id}")
        assert resposta.status_code == 200
        assert resposta.json() == {"missatge": "Carta eliminada"}
        assert (await client.get(f"/cartes/{carta_id}")).status_code == 404
        assert (await client.get("/cartes")).json() == [altra.json()]
        assert llegir_fitxer() == [altra.json()]
        assert main.cargar_cartes() == [altra.json()]


@pytest.mark.asyncio
async def test_delete_inexistent_retorna_404_sense_modificar_fitxer():
    async with AsyncClient(transport=ASGITransport(app=main.app), base_url="http://test") as client:
        creada = await client.post("/cartas", json=dades_carta())
        assert creada.status_code == 200
        resposta = await client.delete("/cartes/999")
        assert resposta.status_code == 404
        assert resposta.json() == {"detail": "Carta no trobada"}
        assert llegir_fitxer() == [creada.json()]
        assert (await client.get("/cartes")).json() == [creada.json()]
