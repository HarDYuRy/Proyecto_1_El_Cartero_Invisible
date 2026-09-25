## Esquema frontend-backend

iniciar uvicorn backend:
  - uvicorn main:app --reload
iniciar test backend:
  - python -m pytest
iniciar test frontend:
  - npm test

El proyecto sigue una arquitectura **frontend-backend**.

```text
┌─────────────────────────┐
│         CLIENT          │
│        Frontend         │
│                         │
│ HTML + CSS + JavaScript │
└────────────┬────────────┘
             │
             │ Petició HTTP
             │ GET /
             ▼
┌─────────────────────────┐
│        SERVIDOR         │
│        Backend          │
│                         │
│     Python + FastAPI    │
│        main.py          │
└────────────┬────────────┘
             │
             │ Resposta HTTP
             ▼
      ┌───────────────┐
      │  Status: 200  │
      │               │
      │   JSON:       │
      │ "Hola, món!"  │
      └───────────────┘
```

### Funcionamiento

El **client (frontend)** envia peticions HTTP al **servidor (backend)**.

El backend està desenvolupat amb **Python i FastAPI**. Quan rep una petició, la processa i retorna una resposta al client.

Per exemple, una petició:

`GET /`

retorna:

```json
{
  "missatge": "Hola, món!"
}
```

Aquesta comunicació permet separar la interfície d'usuari (frontend) de la lògica del servidor (backend).

### Diferència entre GET i POST

**GET** és un mètode HTTP que s'utilitza per **obtenir informació del servidor**. 
Per exemple, `GET /cartes` serveix per obtenir la llista de cartes.

**POST** s'utilitza per **enviar informació al servidor**, normalment per crear un nou recurs.
Per exemple, `POST /cartes` podria servir per afegir una nova carta.

La diferència principal és que **GET consulta dades**, mentre que **POST envia dades per crear o processar informació**.

## Endpoints de l'API

### GET /

Retorna un missatge per comprovar que el servidor funciona correctament.

**Paràmetres:** No necessita paràmetres.

**Exemple de resposta:**

```json
{
  "missatge": "Hola, món!"
}
```

---

### GET /cartes

Retorna una llista de cartes.

**Paràmetres:**

* `limit` (int): nombre màxim de cartes que es retornaran. Per defecte és `10`.
* `offset` (int): indica des de quina carta començar. Per defecte és `0`.

**Exemple de petició:**

```text
GET /cartes?limit=2&offset=0
```

**Exemple de resposta:**

```json
[
  {
    "id": 1,
    "remitent": "Maria",
    "contingut": "Hola, com estàs?"
  },
  {
    "id": 2,
    "remitent": "Joan",
    "contingut": "T'escric des del passat."
  }
]
```

---

### GET /cartes/{id}

Retorna una carta concreta segons el seu identificador.

**Paràmetres:**

* `id` (int): identificador de la carta que es vol consultar.

**Exemple de petició:**

```text
GET /cartes/1
```

**Exemple de resposta:**

```json
{
  "id": 1,
  "remitent": "Maria",
  "contingut": "Hola, com estàs?"
}
```

Si no existeix una carta amb aquest `id`, es retorna un error indicant que la carta no ha estat trobada.
