from fastapi import FastAPI, HTTPException
app = FastAPI()

@app.get("/")
def root():
    return {"missatge": "Hola, món!"}

@app.get("/cartes")
def llistar_cartes(limit: int =10,offset:int =0, personaje: str|None=None):
    cartes=[
        {"id": 1, "remitent": "Maria", "contingut": "Hola, com estàs?"},
        {"id": 2, "remitent": "Joan", "contingut": "T'escric des del passat."},
        {"id": 3, "remitent": "Xavi", "contingut": "Xavi es un chivi"}
    ]

    if personaje:
            cartes=[carta for carta in cartes if carta["remitent"]==personaje]
    return cartes[offset:offset+limit]

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