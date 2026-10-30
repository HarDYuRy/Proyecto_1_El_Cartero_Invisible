
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

//SEMANA 6 
// SEMANA 6 - Actualitzar una carta amb PUT
export async function actualitzarCarta(id, dades) {
    const response = await fetch(`http://127.0.0.1:8000/cartas/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dades)
    });

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    // SEMANA 6 - Refrescar les cartes després del PUT
    await carregarCartes();

    return await response.json();
}

export async function eliminarCarta(id) {
    const response = await fetch(`http://127.0.0.1:8000/cartes/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    await carregarCartes();
}

export function aplicarTemaGuardat() {
    const esFosc = localStorage.getItem("tema") === "fosc";

    document.body.classList.toggle("tema-fosc", esFosc);
    actualitzarTextTema(esFosc);
}

export function canviarTema() {
    const esFosc = document.body.classList.toggle("tema-fosc");

    localStorage.setItem("tema", esFosc ? "fosc" : "clar");
    actualitzarTextTema(esFosc);
}

function actualitzarTextTema(esFosc) {
    const btnTema = document.querySelector("#btnCanviarTema");

    btnTema.textContent = esFosc
        ? "☀️ Modo claro"
        : "🌙 Modo oscuro";
}

export function guardarUltimPersonatge(personatge) {
    localStorage.setItem("ultimPersonatge", personatge);
}

export function preomplirUltimPersonatge() {
    const ultim = localStorage.getItem("ultimPersonatge");

    if (ultim !== null) {
        document.querySelector("#personatge").value = ultim;
    }
}

export function guardarCartaEnProces(text) {
    sessionStorage.setItem("cartaEnProces", text);
}

export function recuperarCartaEnProces() {
    const text = sessionStorage.getItem("cartaEnProces");

    if (text !== null) {
        document.querySelector("#contingut").value = text;
    }
}

function inicialitzar() {
    boto = document.getElementById("btnSaluda");
    boto1 = document.getElementById("btnPresenta");


    boto.addEventListener("click", saluda);
    boto1.addEventListener("click", presentacion);

    //SEMANA 7
    // Recuperar el tema guardado al abrir la página.
    const btnTema = document.querySelector("#btnCanviarTema");
    const temaGuardat = localStorage.getItem("tema");

    aplicarTemaGuardat();

    document.querySelector("#btnCanviarTema")
        .addEventListener("click", canviarTema);

    // Recuperar el último personaje y el borrador.
    preomplirUltimPersonatge();
    recuperarCartaEnProces();

    // Guardar el contenido cada vez que cambia.
    document.querySelector("#contingut").addEventListener("input", (event) => {
        guardarCartaEnProces(event.target.value);
    });

    const title = document.querySelector("#principalTitle");
    title.textContent = "📮 El Cartero Invisible – Semana 2";
    title.setAttribute("data-role", "banner");

    const info = document.querySelector(".info");
    info.style.color = "#4e2c50";

    // Mostrar u ocultar la tabla de cartas.
    // Mostrar u ocultar la tabla de cartas
    const botonTabla = document.querySelector("#btnMostrarTaula");
    const tabla = document.querySelector("#taulaCartes");

    if (botonTabla && tabla) {
        botonTabla.addEventListener("click", () => {
            const visible = botonTabla.getAttribute("aria-expanded") !== "true";

            tabla.style.display = visible ? "block" : "none";
            botonTabla.setAttribute("aria-expanded", String(visible));
            botonTabla.textContent = visible ? "Ocultar tabla" : "Mostrar tabla";
        });
    }

    // BOTÓ ORIGINAL - Afegir una carta de prova
    document.querySelector("#btnAfegir").addEventListener("click", () => {
        const id = seguentIdProva++;

        cartesSimulades.push({
            id: id,
            remitent: "Cartero " + id,
            destinatari: "Destinatario de prueba",
            contingut: "¡Esta carta acaba de crearse dinámicamente!",
            personatge: "Astra",
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
            alert("Todos los campos obligatorios deben estar rellenados.");
            return;
        }

        const novaCarta = {
            remitent,
            destinatari,
            contingut,
            personatge
        };

        // SEMANA 5 - Guardar la carta real al servidor amb POST
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

            // SEMANA 5 - Actualitzar la llista de cartes
            await carregarCartes();

            // Guardar el último personaje utilizado.
            guardarUltimPersonatge(novaCarta.personatge);

            // Borrar el borrador de la carta enviada.
            sessionStorage.removeItem("cartaEnProces");

            // Limpiar el formulario.
            formCarta.reset();
            preomplirUltimPersonatge();

        } catch (error) {
            console.error("Error al guardar la carta:", error);
            alert("No se ha podido guardar la carta.");
        }
    });

    // SEMANA 4 - Delegació d'esdeveniments
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
            await eliminarCarta(id);

        } catch (error) {
            console.error("Error al eliminar la carta:", error);
            alert("No se ha podido eliminar la carta.");
        }
    });

    // SEMANA 6 - Guardar els canvis d'una carta
    const formEditarCarta = document.querySelector("#formEditarCarta");

    formEditarCarta.addEventListener("submit", async (event) => {
        event.preventDefault();

        const id = Number(formEditarCarta.dataset.id);
        const esProva = formEditarCarta.dataset.prova === "true";

        // SEMANA 6 - Recollir les dades del formulari
        const dades = {
            remitent: formEditarCarta.elements.namedItem("remitent").value.trim(),
            destinatari: formEditarCarta.elements.namedItem("destinatari").value.trim(),
            contingut: formEditarCarta.elements.namedItem("contingut").value.trim(),
            personatge: formEditarCarta.elements.namedItem("personatge").value.trim()
        };

        // SEMANA 6 - Validar els camps
        if (Object.values(dades).some(valor => valor === "")) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        // SEMANA 6 - Editar una carta de prova
        // SEMANA 6 - Editar cartes sense dependre del backend

        if (esProva) {
            // Actualitzar una carta de prova
            const carta = cartesSimulades.find(carta => carta.id === id);

            if (carta) {
                Object.assign(carta, dades);
            }

        } else {
            // Guardar els canvis al backend amb PUT
            try {
                await actualitzarCarta(id, dades);
            } catch (error) {
                console.error("Error al actualizar la carta:", error);
                alert("No se han podido guardar los cambios.");
                return;
            }
        }

        // SEMANA 6 - Refrescar les cartes en pantalla
        actualitzarLlista();

        // Tancar el formulari d'edició
        document.querySelector("#modalEditarCarta").close();
    });

    // SEMANA 6 - Cancel·lar l'edició
    document.querySelector("#btnCerrarEditar").addEventListener("click", () => {
        document.querySelector("#modalEditarCarta").close();
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
        btnEliminar.type = "button";
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "btn-eliminar";
        btnEliminar.dataset.id = carta.id;

        // SEMANA 5 - Distingir les cartes de prova
        btnEliminar.dataset.prova = carta.esProva === true ? "true" : "false";

        //SEMANA 6
        const btnEditar = document.createElement("button");
        btnEditar.type = "button";
        btnEditar.textContent = "Editar";
        btnEditar.className = "btn-editar";
        btnEditar.dataset.id = carta.id;

        btnEditar.addEventListener("click", () => {
            const modal = document.querySelector("#modalEditarCarta");
            const formulario = modal.querySelector("#formEditarCarta");
            formulario.elements.namedItem("remitent").value = carta.remitent;
            formulario.elements.namedItem("destinatari").value = carta.destinatari ?? "";
            formulario.elements.namedItem("contingut").value = carta.contingut;
            formulario.elements.namedItem("personatge").value = carta.personatge ?? "";
            formulario.dataset.id = carta.id;
            formulario.dataset.prova = carta.esProva === true ? "true" : "false";
            modal.showModal();
        });



        divCarta.appendChild(titol);
        divCarta.appendChild(paragraf);
        divCarta.appendChild(idSpan);
        divCarta.appendChild(btnEliminar);
        divCarta.appendChild(btnEditar);
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

            // SEMANA 6 - Editar la carta des de la taula.
            const btnEditarTabla = btnEditar.cloneNode(true);
            btnEditarTabla.addEventListener("click", () => {
                btnEditar.click();
            });
            acciones.appendChild(btnEditarTabla);
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
