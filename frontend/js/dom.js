import { getCookie, setCookie, esborrarCookie, generarIdUsuari } from "./utils.js";

const nombre = "Erik";
const edad = 22;
let temporitzadorError;

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

export function actualitzarTextTema(esFosc) {
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

        btnEditar.dataset.prova = String(carta.esProva === true);


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
            acciones.appendChild(btnEditarTabla);
            fila.appendChild(acciones);
            cuerpoTabla.appendChild(fila);
        }
    });

}

export function mostrarBenvinguda(usuariId) {
    document.querySelector("#benvinguda").textContent =
        `Benvingut de nou, ${usuariId}!`;
}

export function inicialitzarUsuari() {
    const existent = getCookie("usuari_id");

    if (existent) {
        mostrarBenvinguda(existent);
        return existent;
    }

    const nou = generarIdUsuari();
    setCookie("usuari_id", nou, 30);
    localStorage.setItem("usuariId", nou);
    return nou;
}

export function esborrarCarnet() {
    esborrarCookie("usuari_id");
    localStorage.removeItem("usuariId");
    location.reload();
}

export function mostrarError(missatge) {
    const contenidor = document.querySelector("#missatgeError");

    clearTimeout(temporitzadorError);
    contenidor.textContent = missatge;
    contenidor.classList.add("visible");

    temporitzadorError = setTimeout(() => {
        contenidor.classList.remove("visible");
        contenidor.textContent = "";
    }, 5000);
}

export function gestionarError(error, contexte) {
    console.error(contexte, error);

    mostrarError(
        error.status
            ? error.message
            : "No s'ha pogut connectar al servidor. Comprova que està en marxa."
    );
}

export function saluda() {
    document.querySelector(".info").textContent = "¡Hola, mundo!";
}

export function presentacion() {
    document.querySelector(".info").textContent =
        `Me llamo ${nombre}, y tengo ${edad} años`;
}

export function esborrarCartaEnProces() {
    sessionStorage.removeItem("cartaEnProces");
}

export function obrirEdicio(carta) {
    const modal = document.querySelector("#modalEditarCarta");
    const formulari = modal.querySelector("#formEditarCarta");
    for (const camp of ["remitent", "destinatari", "contingut", "personatge"]) {
        formulari.elements.namedItem(camp).value = carta[camp] ?? "";
    }
    formulari.dataset.id = carta.id;
    formulari.dataset.prova = String(carta.esProva === true);
    modal.showModal();
}

export function tancarEdicio() {
    document.querySelector("#modalEditarCarta").close();
}

export function prepararPagina() {
    const title = document.querySelector("#principalTitle");
    title.textContent = "📮 El Cartero Invisible – Semana 2";
    title.setAttribute("data-role", "banner");
    document.querySelector(".info").style.color = "#4e2c50";
}

export function alternarTaula() {
    const boto = document.querySelector("#btnMostrarTaula");
    const taula = document.querySelector("#taulaCartes");
    const visible = boto.getAttribute("aria-expanded") !== "true";
    taula.style.display = visible ? "block" : "none";
    boto.setAttribute("aria-expanded", String(visible));
    boto.textContent = visible ? "Ocultar tabla" : "Mostrar tabla";
}
