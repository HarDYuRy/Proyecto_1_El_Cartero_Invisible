from fastapi import FastAPI, HTTPException;
from pydantic import BaseModel;
#SEMANA 4
import json
import os
DATA_FILE = "cartas.json"

app = FastAPI()


class Carta(BaseModel):
    remitent: str
    destinatari: str
    contingut: str
    personatge: str



@app.post("/cartas")
def crear_carta(carta: Carta):
    cartes.append(carta.model_dump())
    guardar_cartes(cartes)
    return carta


@app.get("/")
def root():
    return {"missatge": "Hola, món!"}

@app.get("/cartes")
def llistar_cartes(limit: int =10,offset:int =0, personaje: str|None=None):
    resultat=cartes

    if personaje:
            resultat=[carta for carta in resultat if carta["personatge"]==personaje]
    return resultat[offset:offset+limit]

@app.get("/cartes/{id}")
def obtenir_carta(id:int):
    #Datos simulados, más a delante se cambiaran
    cartes=[
        {"id": 1, "remitent": "Maria", "contingut": "Hola, com estàs?"},
        {"id": 2, "remitent": "Joan", "contingut": "T'escric des del passat."},
        {"id": 3, "remitent": "Xavi", "contingut": "Xavi es un chivi"}
    ]
    for c in cartes:
        if c["id"] == id:
            return c
    raise HTTPException(status_code=404, detail="Carta no encontrada")

#SEMANA 4
@app.delete("/cartas/{id}")
def eliminar_carta(id: int):
    global cartes
    for c in cartes:
        if c["id"] == id:
            cartes.remove(c)
            guardar_cartes(cartes)
            return {"missatge": "Carta eliminada"}
    return {"error": "Carta no trobada"}, 404

#SEMANA 4
def cargar_cartes():
    """Llegeix les cartes del fitxer. Si no existeix, torna una llista buida."""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def guardar_cartes(cartes):
    """Escriu les cartes al fitxer."""
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(cartes, f, indent=2, ensure_ascii=False)
cartes = cargar_cartes()



