# El Cartero Invisible

## Comandos para iniciar el servicio
-------------------------------
iniciar uvicorn backend:
  - uvicorn main:app --reload
iniciar test backend:
  - python -m pytest -v 
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

## Comprobación del carnet de usuario

Abre la página y pulsa **F12** para acceder a las herramientas del navegador.

### 1. Comprobar la cookie

Ejecuta en la consola:

```javascript
document.cookie
```

Debe aparecer una cookie llamada `usuari_id` con un valor parecido a `user_abc123`.

### 2. Comprobar localStorage

Ejecuta:

```javascript
localStorage.getItem("usuariId")
```

El identificador debe coincidir con el guardado en la cookie.

### 3. Comprobar la bienvenida

Recarga la página. El encabezado debe mostrar:

> Benvingut de nou, user_abc123!

El identificador debe mantenerse al recargar.

### 4. Comprobar el envío a la API

Con el backend en marcha:

1. Abre la pestaña **Red / Network**.
2. Rellena el formulario y envía una carta.
3. Selecciona la petición **POST** de creación de la carta.
4. Revisa **Payload / Carga útil**.

Los datos enviados deben incluir el campo:

```json
{
    "usuari_id": "user_abc123"
}
```

Este campo se envía junto con los demás datos de la carta. Para guardar la asociación, el backend debe aceptar y almacenar `usuari_id`.

### 5. Comprobar el borrado del carnet

1. Anota el identificador actual.
2. Pulsa **Esborrar carnet**.
3. La página se recargará.
4. Ejecuta de nuevo:

```javascript
localStorage.getItem("usuariId")
```

Debe aparecer un identificador distinto, porque al cargar la página se genera automáticamente un carnet nuevo.

Recarga otra vez para comprobar la bienvenida con el nuevo identificador.

## M06 — Pruebas manuales de gestión de errores

Abre el frontend desde su servidor local. Los avisos deben aparecer en
`#missatgeError`, sin ventanas `alert()`, y desaparecer después de 5 segundos.
Para las pruebas 404 y 422, mantén el backend en marcha y abre **F12 → Consola**.
Ejecuta cada bloque por separado y comprueba su mensaje antes de continuar.

### 1. Error de conexión

1. Detén el backend con **Ctrl + C** en la terminal donde ejecutas Uvicorn.
2. Recarga la página del frontend para que intente cargar las cartas.
3. Comprueba que aparece este aviso:

> No s'ha pogut connectar al servidor. Comprova que està en marxa.

Vuelve a iniciar el backend desde su carpeta antes de continuar:

```powershell
uvicorn main:app --reload
```

### 2. Error 404: carta inexistente

Utiliza un ID que no exista en tus cartas. El ejemplo usa `999999999`.
Ejecuta en la consola del navegador:

```javascript
{
    const api = await import("./script.js");

    try {
        await api.actualitzarCarta(999999999, {
            remitent: "Pau",
            destinatari: "Anna",
            contingut: "Prova",
            personatge: "Einstein"
        });
    } catch (error) {
        api.gestionarError(error, "Prova 404:");
    }
}
```

Resultado esperado: la petición devuelve **404** y aparece este aviso:

> La carta que busques no existeix.

### 3. Error 422: datos incompletos

Ejecuta en la consola del navegador:

```javascript
{
    const api = await import("./script.js");

    try {
        await api.enviarCarta({ remitent: "Pau" });
    } catch (error) {
        api.gestionarError(error, "Prova 422:");
    }
}
```

Resultado esperado: la petición devuelve **422**, no se crea ninguna carta
y aparece este aviso:

> Les dades enviades no són vàlides. Revisa els camps.

Esta prueba envía datos incompletos directamente a la API porque la validación
del formulario puede impedir el envío antes de que llegue al servidor.

### Comprobaciones comunes

- El mensaje aparece dentro de la página, en `#missatgeError`.
- El aviso desaparece después de **5 segundos**.
- No aparece ninguna ventana `alert()`.
- Es normal ver errores en la consola y en **Red / Network** durante estas pruebas:
  se provocan para comprobar que la interfaz muestra el mensaje correspondiente.
