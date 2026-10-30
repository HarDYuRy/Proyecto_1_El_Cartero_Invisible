
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# SEMANA 4
import json
import os
from dotenv import load_dotenv
# SEMANA 5 - CORS
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

DATA_FILE = "cartas.json"

app = FastAPI()

# SEMANA 5 - Configuració CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class Carta(BaseModel):
    remitent: str
    destinatari: str
    contingut: str
    personatge: str


# SEMANA 5 - Crear una carta amb un ID únic
@app.post("/cartas")
def crear_carta(carta: Carta):
    nova_carta = carta.model_dump()

    nova_carta["id"] = max(
        (c["id"] for c in cartes),
        default=0
    ) + 1

    cartes.append(nova_carta)
    guardar_cartes(cartes)

    return nova_carta


@app.get("/")
def root():
    return {"missatge": "Hola, món!"}


@app.get("/cartes")
def llistar_cartes(limit: int = 10, offset: int = 0, personaje: str | None = None):
    resultat = cartes

    if personaje:
        resultat = [
            carta for carta in resultat
            if carta["personatge"] == personaje
        ]

    return resultat[offset:offset + limit]


@app.get("/cartes/{id}")
def obtenir_carta(id: int):
    # SEMANA 5 - Buscar la carta real per ID
    for c in cartes:
        if c["id"] == id:
            return c

    raise HTTPException(status_code=404, detail="Carta no encontrada")


# SEMANA 4
# SEMANA 5 - Eliminar una carta real del servidor
@app.delete("/cartes/{id}")
def eliminar_carta(id: int):
    global cartes

    for c in cartes:
        if c["id"] == id:
            cartes.remove(c)
            guardar_cartes(cartes)
            return {"missatge": "Carta eliminada"}

    raise HTTPException(status_code=404, detail="Carta no trobada")

@app.put("/cartas/{id}")
def actualitzar_carta(id: int, carta: Carta):
    for i, c in enumerate(cartes):
        if c["id"] == id:
            # Actualitza totes les dades excepte l'ID
            cartes[i] = {
                "id": id,
                "remitent": carta.remitent,
                "destinatari": carta.destinatari,
                "contingut": carta.contingut,
                "personatge": carta.personatge
            }
            guardar_cartes(cartes)          # ⭐ persisteix al fitxer
            return cartes[i]
    raise HTTPException(status_code=404, detail="Carta no trobada")
# SEMANA 7
@app.get("/config")
def config():
    return {
        "debug": DEBUG,
        "ia_configurada": GEMINI_API_KEY is not None and GEMINI_API_KEY != ""
    }

# SEMANA 4
def cargar_cartes():
    """Llegeix les cartes del fitxer. Si no existeix, torna una llista buida."""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            cartes_guardades = json.load(f)

            # SEMANA 5 - Afegir ID a les cartes antigues
            ids_existents = {
                c["id"] for c in cartes_guardades
                if isinstance(c.get("id"), int)
            }

            seguent_id = max(ids_existents, default=0) + 1

            for c in cartes_guardades:
                if "id" not in c:
                    c["id"] = seguent_id
                    seguent_id += 1

            return cartes_guardades

    return []


# SEMANA 4
def guardar_cartes(cartes):
    """Escriu les cartes al fitxer."""
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(cartes, f, indent=2, ensure_ascii=False)


cartes = cargar_cartes()

# SEMANA 5 - Guardar els ID assignats a les cartes antigues
guardar_cartes(cartes)
