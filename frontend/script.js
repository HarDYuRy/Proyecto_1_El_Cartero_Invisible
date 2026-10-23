
//////////////////////////
// VARIABLES GLOBALS    //
//////////////////////////
const nombre = "Erik";
const edad = 22;

let boto;
let boto1;

// Cartes de prova
const cartesSimulades = [];

// SEMANA 5 - Cartes reals del servidor
let cartesServidor = [];

// SEMANA 5 - Identificador per a les cartes de prova
let seguentIdProva = 1;

//////////////////////////
// FUNCIONS             //
//////////////////////////

// SEMANA 5 - Mostrar les cartes reals i les de prova
function actualitzarLlista() {
    renderitzarCartes([
        ...cartesServidor,
        ...cartesSimulades
    ]);
}

// SEMANA 5 - Carregar les cartes reals del backend
export async function carregarCartes() {
    try {
        const response = await fetch("http://127.0.0.1:8000/cartes");

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        cartesServidor = await response.json();

        // SEMANA 5 - Mostrar totes les cartes
        actualitzarLlista();

    } catch (error) {
        console.error("Error al cargar las cartas:", error);
        alert("No s'han pogut carregar les cartes. Comprova que el servidor està en marxa.");
    }
}

function inicialitzar() {
    boto = document.getElementById("btnSaluda");
    boto1 = document.getElementById("btnPresenta");

    boto.addEventListener("click", saluda);
    boto1.addEventListener("click", presentacion);

    const title = document.querySelector("#principalTitle");
    title.textContent = "📮 El Cartero Invisible – Semana 2";
    title.setAttribute("data-role", "banner");

    const info = document.querySelector(".info");
    info.style.color = "#4e2c50";

    // Mostrar u ocultar la tabla de cartas.
    const botonTabla = document.querySelector("#btnMostrarTaula");
    const tabla = document.querySelector("#taulaCartes");
    botonTabla.addEventListener("click", () => {
        const visible = botonTabla.getAttribute("aria-expanded") !== "true";
        tabla.style.display = visible ? "block" : "none";
        botonTabla.setAttribute("aria-expanded", String(visible));
        botonTabla.textContent = visible ? "Ocultar tabla" : "Mostrar tabla";
    });

    // BOTÓ ORIGINAL - Afegir una carta de prova
    document.querySelector("#btnAfegir").addEventListener("click", () => {
        const id = seguentIdProva++;
        cartesSimulades.push({
            id: id,
            remitent: "Cartero " + id,
            destinatari: "Destinatario de prueba",
            contingut: "¡Esta carta acaba de crearse dinámicamente!",
            esProva: true
        });

        // SEMANA 5 - Mostrar les cartes sense perdre les reals
        actualitzarLlista();
    });

    // SEMANA 4 - Formulari per afegir una nova carta
    const formCarta = document.querySelector("#formCarta");

    formCarta.addEventListener("submit", async (event) => {
        event.preventDefault();

        const remitent = document.querySelector("#remitent").value.trim();
        const destinatari = document.querySelector("#destinatari").value.trim();
        const contingut = document.querySelector("#contingut").value.trim();
        const personatge = document.querySelector("#personatge").value.trim();

        // SEMANA 4 - Validació dels camps obligatoris
        if (remitent === "" || destinatari === "" || contingut === "") {
            alert("¡El remitente, el destinatario y el contenido no pueden estar vacíos!");
            return;
        }

        const novaCarta = {
            remitent: remitent,
            destinatari: destinatari,
            contingut: contingut,
            personatge: personatge
        };

        // SEMANA 5 - POST: Guardar la carta al servidor
        try {
            const response = await fetch("http://127.0.0.1:8000/cartas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novaCarta)
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            // SEMANA 5 - Refrescar la llista després del POST
            await carregarCartes();

            formCarta.reset();

        } catch (error) {
            console.error("Error al añadir la carta:", error);
            alert("No se ha podido añadir la carta.");
        }
    });

    // SEMANA 4 - Delegació d'esdeveniments
    const contenidorCartes = document.querySelector("#contenidorCartes");

    document.querySelector(".zona-cartes").addEventListener("click", async (event) => {
        if (!event.target.classList.contains("btn-eliminar")) {
            return;
        }

        const id = Number(event.target.dataset.id);
        const esProva = event.target.dataset.prova === "true";

        // SEMANA 5 - Eliminar una carta de prova
        if (esProva) {
            const index = cartesSimulades.findIndex(carta => carta.id === id);

            if (index !== -1) {
                cartesSimulades.splice(index, 1);
                actualitzarLlista();
            }

            return;
        }

        // SEMANA 5 - DELETE: Eliminar una carta real del servidor
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/cartes/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            // SEMANA 5 - Refrescar la llista després del DELETE
            await carregarCartes();

        } catch (error) {
            console.error("Error al eliminar la carta:", error);
            alert("No se ha podido eliminar la carta.");
        }
    });
}

function saluda() {
    alert("¡Hola, mundo!");
}

function presentacion() {
    alert(`Me llamo ${nombre}, Y tengo ${edad} años`);
}


// ------------ CARTES DEL SERVIDOR ------------

// SEMANA 5 - Renderitzar cartes reals i de prova
export function renderitzarCartes(cartes) {
    const contenidor = document.querySelector("#contenidorCartes");
    contenidor.innerHTML = "";
    const cuerpoTabla = document.querySelector("#cosTaulaCartes");
    if (cuerpoTabla) cuerpoTabla.replaceChildren();

    cartes.forEach(carta => {
        const divCarta = document.createElement("div");
        divCarta.className = "carta";

        const titol = document.createElement("h3");
        titol.textContent = `De: ${carta.remitent}`;

        const paragraf = document.createElement("p");
        paragraf.textContent = carta.contingut;

        const idSpan = document.createElement("span");
        idSpan.textContent = `#${carta.id}`;
        idSpan.setAttribute("data-id", carta.id);

        // SEMANA 4 - Botó eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "btn-eliminar";
        btnEliminar.dataset.id = carta.id;

        // SEMANA 5 - Distingir les cartes de prova
        btnEliminar.dataset.prova = carta.esProva === true ? "true" : "false";

        divCarta.appendChild(titol);
        divCarta.appendChild(paragraf);
        divCarta.appendChild(idSpan);
        divCarta.appendChild(btnEliminar);

        contenidor.appendChild(divCarta);

        if (cuerpoTabla) {
            const fila = document.createElement("tr");
            [carta.id, carta.remitent, carta.destinatari ?? "Sin destinatario", carta.contingut].forEach((valor, indice) => {
                const celda = document.createElement("td");
                celda.textContent = valor ?? "";
                if (indice === 3) {
                    celda.className = "contingut-cell";
                    celda.title = carta.contingut ?? "";
                }
                fila.appendChild(celda);
            });
            const acciones = document.createElement("td");
            acciones.appendChild(btnEliminar.cloneNode(true));
            fila.appendChild(acciones);
            cuerpoTabla.appendChild(fila);
        }
    });
}

// SEMANA 5 - Carregar les cartes en iniciar la pàgina
if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        inicialitzar();
        carregarCartes();
    });
}

