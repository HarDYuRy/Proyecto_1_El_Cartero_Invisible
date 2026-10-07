from fastapi import FastAPI, HTTPException;
from pydantic import BaseModel;
app = FastAPI()


class Carta(BaseModel):
    remitent: str
    destinatari: str
    contingut: str
    personatge: str
cartes=[]

@app.post("/cartas")
def crear_carta(carta:Carta):
    cartes.append(carta)
    return carta


@app.get("/")
def root():
    return {"missatge": "Hola, món!"}

@app.get("/cartes")
def llistar_cartes(limit: int =10,offset:int =0, personaje: str|None=None):
    resultat=cartes

    if personaje:
            resultat=[carta for carta in resultat if carta.personatge==personaje]
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



