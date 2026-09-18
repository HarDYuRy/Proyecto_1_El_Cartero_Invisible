from fastapi import FastAPI


app = FastAPI()

@app.get("/")
def root():
    return {"missatge": "Hola, món!"}

@app.get("/cartes")
def root():
    return [];