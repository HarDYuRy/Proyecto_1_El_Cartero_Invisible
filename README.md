## Esquema frontend-backend

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