# El Cartero Invisible

## Comandos para iniciar el servicio
-------------------------------
iniciar uvicorn backend:
  - uvicorn main:app --reload
iniciar test backend:
  - cd 
iniciar test frontend:
  - npm test
-------------------------------
## Esquema frontend-backend
-------------------------------
El proyecto sigue una arquitectura **frontend-backend**.

```text
┌─────────────────────────┐
│         CLIENTE         │
│        Frontend         │
│                         │
│ HTML + CSS + JavaScript │
└────────────┬────────────┘
             │
             │ Petición HTTP
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
             │ Respuesta HTTP
             ▼
      ┌───────────────┐
      │  Status: 200  │
      │               │
      │   JSON:       │
      │ "Hola, món!"  │
      └───────────────┘
```
-------------------------------
### Funcionamiento
-------------------------------
El **cliente (frontend)** envía peticiones HTTP al **servidor (backend)**.

El backend está desarrollado con **Python y FastAPI**. Cuando recibe una petición, la procesa y devuelve una respuesta al cliente.

Por ejemplo, una petición:

`GET /`

devuelve:

```json
{
  "missatge": "Hola, món!"
}
```

Esta comunicación permite separar la interfaz de usuario (frontend) de la lógica del servidor (backend).
-------------------------------
### Diferencia entre GET y POST
-------------------------------
**GET** es un método HTTP que se utiliza para **obtener información del servidor**. 
Por ejemplo, `GET /cartes` sirve para obtener la lista de cartas.

**POST** se utiliza para **enviar información al servidor**, normalmente para crear un nuevo recurso.
Por ejemplo, `POST /cartas` sirve para añadir una nueva carta.

La diferencia principal es que **GET consulta datos**, mientras que **POST envía datos para crear o procesar información**.
-------------------------------
## Endpoints de la API

### GET /
-------------------------------
Devuelve un mensaje para comprobar que el servidor funciona correctamente.

**Parámetros:** No necesita parámetros.

**Ejemplo de respuesta:**

```json
{
  "missatge": "Hola, món!"
}
```
-------------------------------
### GET /cartes
-------------------------------
Devuelve una lista de cartas.

Las cartas se guardan en una lista global `cartes`.

**Parámetros:**

* `limit` (int): número máximo de cartas que se devolverán. Por defecto es `10`.
* `offset` (int): indica desde qué carta empezar. Por defecto es `0`.
* `personaje` (str): permite filtrar las cartas según el personaje.

**Ejemplo de petición:**

```text
GET /cartes?limit=2&offset=0
```

**Ejemplo de respuesta:**

```json
[
  {
    "remitent": "Maria",
    "destinatari": "Joan",
    "contingut": "Hola, com estàs?",
    "personatge": "Carter"
  }
]
```
-------------------------------

### POST /cartas
-------------------------------
Permite añadir una nueva carta a la lista `cartes`.

Para definir la estructura de las cartas se utiliza el modelo `Carta` de Pydantic.

La carta contiene los campos:

* `remitent` (str)
* `destinatari` (str)
* `contingut` (str)
* `personatge` (str)

**Ejemplo de petición:**

```text
POST /cartas
```

**Ejemplo de datos enviados:**

```json
{
  "remitent": "Maria",
  "destinatari": "Joan",
  "contingut": "Hola, com estàs?",
  "personatge": "Carter"
}
```

**Ejemplo de respuesta:**

```json
{
  "remitent": "Maria",
  "destinatari": "Joan",
  "contingut": "Hola, com estàs?",
  "personatge": "Carter"
}
```
-------------------------------
### GET /cartes/{id}
-------------------------------
Devuelve una carta concreta según su identificador.

**Parámetros:**

* `id` (int): identificador de la carta que se quiere consultar.

**Ejemplo de petición:**

```text
GET /cartes/1
```

**Ejemplo de respuesta:**

```json
{
  "id": 1,
  "remitent": "Maria",
  "contingut": "Hola, com estàs?"
}
```
Si no existe una carta con este `id`, se devuelve un error indicando que la carta no ha sido encontrada.
-------------------------------
## Frontend
-------------------------------
En el frontend se ha creado un array `cartesSimulades` que contiene tres cartas de prueba.

La función `renderitzarCartes(cartes)` se encarga de mostrar las cartas en el HTML utilizando `createElement`, `appendChild` y `textContent`.

Cada carta se crea como un `div` con la clase `carta` y contiene:

* Un `h3` con el remitente.
* Un `p` con el contenido.
* Un `span` con el ID de la carta y el atributo `data-id`.

Las cartas se muestran cuando se carga la página utilizando `DOMContentLoaded`.

También se ha añadido el botón:

```html
<button id="btnAfegir">Afegir carta de prova</button>
```

Al hacer clic en el botón se añade una nueva carta al array `cartesSimulades` y se vuelve a ejecutar `renderitzarCartes()` para actualizar la lista de cartas.
-------------------------------