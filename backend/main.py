from fastapi import FastAPI, HTTPException, Request, Response
from pydantic import BaseModel, Field

# SEMANA 4
import json
import os
from dotenv import load_dotenv
# SEMANA 5 - CORS
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4


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
    remitent: str = Field(min_length=1)
    destinatari: str = Field(min_length=1)
    contingut: str = Field(min_length=1)
    personatge: str = Field(min_length=1)
    usuari_id: str | None = None


# SEMANA 5 - Crear una carta amb un ID únic
@app.post("/cartas", status_code=201)
def crear_carta(carta: Carta, request: Request):
    if not carta.contingut.strip():
        raise HTTPException(
            status_code=422,
            detail="El contingut no pot estar buit"
        )

    nova_carta = carta.model_dump()

    # Agafar l'identificador de la cookie
    nova_carta["usuari_id"] = request.cookies.get("usuari_id")

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


@app.get("/cartas")
def llistar_cartes(limit: int = 10, offset: int = 0, personaje: str | None = None):
    resultat = cartes

    if personaje:
        resultat = [
            carta for carta in resultat
            if carta["personatge"] == personaje
        ]

    return resultat[offset:offset + limit]


@app.get("/cartas/{id}")
def obtenir_carta(id: int):
    for carta in cartes:
        if carta["id"] == id:
            return carta

    raise HTTPException(
        status_code=404,
        detail="Carta no trobada"
    )


# SEMANA 4
# SEMANA 5 - Eliminar una carta real del servidor
@app.delete("/cartas/{id}", status_code=204)
def eliminar_carta(id: int):
    for carta in cartes:
        if carta["id"] == id:
            cartes.remove(carta)
            guardar_cartes(cartes)
            return Response(status_code=204)

    raise HTTPException(
        status_code=404,
        detail="Carta no trobada"
    )

@app.put("/cartas/{id}")
def actualitzar_carta(id: int, carta: Carta):
    for i, c in enumerate(cartes):
        if c["id"] == id:
            if not carta.contingut.strip():
                raise HTTPException(
                    status_code=422,
                    detail="El contingut no pot estar buit"
                )
            # Actualitza totes les dades excepte l'ID
            cartes[i] = {
                "id": id,
                "remitent": carta.remitent,
                "destinatari": carta.destinatari,
                "contingut": carta.contingut,
                "personatge": carta.personatge,
                "usuari_id": c.get("usuari_id")
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

# SEMANA 8
@app.get("/perfil")
def obtenir_perfil(request: Request, response: Response):
    usuari_id = request.cookies.get("usuari_id")

    if not usuari_id:
        raise HTTPException(
            status_code=401,
            detail="No hi ha cap usuari identificat"
        )

    # Llegir el comptador i incrementar-lo.
    try:
        visites = max(0, int(request.cookies.get("visites", "0")))
    except ValueError:
        visites = 0

    visites += 1

    # Guardar el nou valor durant 30 dies.
    response.set_cookie(
        key="visites",
        value=str(visites),
        max_age=30 * 24 * 60 * 60,
        path="/",
        samesite="lax"
    )

    cartes_usuari = [
        carta for carta in cartes
        if carta.get("usuari_id") == usuari_id
    ]

    return {
        "usuari_id": usuari_id,
        "visites": visites,
        "cartes": cartes_usuari
    }

@app.post("/login")
def login(request: Request, response: Response):
    # Conservar el carnet existent o generar-ne un de nou
    usuari_id = (
        request.cookies.get("usuari_id")
        or "user_" + uuid4().hex[:8]
    )

    response.set_cookie(
        key="usuari_id",
        value=usuari_id,
        max_age=30 * 24 * 60 * 60,
        path="/",
        samesite="lax",
        httponly=False
    )

    return {
        "missatge": "Sessió iniciada",
        "usuari_id": usuari_id
    }


@app.delete("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="usuari_id",
        path="/"
    )

    return {"missatge": "Sessió tancada"}

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
