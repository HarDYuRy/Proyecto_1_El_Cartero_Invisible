import { carregarCartes, enviarCarta, actualitzarCarta, eliminarCarta } from "./api.js";
import { getCookie } from "./utils.js";
import {
    aplicarTemaGuardat, canviarTema, guardarUltimPersonatge, preomplirUltimPersonatge,
    guardarCartaEnProces, recuperarCartaEnProces, renderitzarCartes, inicialitzarUsuari,
    esborrarCarnet, mostrarError, gestionarError, saluda, presentacion,
    esborrarCartaEnProces, obrirEdicio, tancarEdicio, prepararPagina, alternarTaula
} from "./dom.js";

const cartesSimulades = [];
let cartesServidor = [];
let seguentIdProva = 1;

function actualitzarLlista() {
    renderitzarCartes([
        ...cartesServidor,
        ...cartesSimulades
    ]);
}

export async function refrescarLlista() {
    cartesServidor = await carregarCartes();
    actualitzarLlista();
}

export function inicialitzar() {
    inicialitzarUsuari();

    document.querySelector("#btnEsborrarCarnet")
        .addEventListener("click", esborrarCarnet);

    const boto = document.getElementById("btnSaluda");
    const boto1 = document.getElementById("btnPresenta");


    boto.addEventListener("click", saluda);
    boto1.addEventListener("click", presentacion);

    //SEMANA 7
    // Recuperar el tema guardado al abrir la página.

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

    prepararPagina();
    document.querySelector("#btnMostrarTaula")?.addEventListener("click", alternarTaula);

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

        // Validar els camps obligatoris
        if (remitent === "" || destinatari === "" || contingut === "") {
            mostrarError("Omple tots els camps obligatoris.");
            return;
        }

        const novaCarta = {
            remitent,
            destinatari,
            contingut,
            personatge,
            usuari_id: getCookie("usuari_id")
        };

        try {
            // Enviar la carta i comprovar la resposta HTTP
            await enviarCarta(novaCarta);

            // Actualitzar les cartes que es mostren
            await refrescarLlista();

            // Guardar l'últim personatge utilitzat
            guardarUltimPersonatge(novaCarta.personatge);

            // Esborrar el borrador després d'enviar la carta
            esborrarCartaEnProces();

            // Netejar el formulari i recuperar l'últim personatge
            formCarta.reset();
            preomplirUltimPersonatge();
        } catch (error) {
            gestionarError(error, "Error enviant la carta:");
        }
    });

    // SEMANA 4 - Delegació d'esdeveniments
    document.querySelector(".zona-cartes").addEventListener("click", async (event) => {
        const botoEditar = event.target.closest(".btn-editar");
        if (botoEditar) {
            const cartes = botoEditar.dataset.prova === "true" ? cartesSimulades : cartesServidor;
            const carta = cartes.find(carta => carta.id === Number(botoEditar.dataset.id));
            if (carta) obrirEdicio(carta);
            return;
        }

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
            await refrescarLlista();
        } catch (error) {
            gestionarError(error, "Error eliminant la carta:");
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
            mostrarError("Omple tots els camps obligatoris.");
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
                await refrescarLlista();
            } catch (error) {
                gestionarError(error, "Error actualitzant la carta:");
                return;
            }
        }

        // SEMANA 6 - Refrescar les cartes en pantalla
        actualitzarLlista();

        // Tancar el formulari d'edició
        tancarEdicio();
    });

    // SEMANA 6 - Cancel·lar l'edició
    document.querySelector("#btnCerrarEditar").addEventListener("click", () => {
        tancarEdicio();
    });

}

if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        inicialitzar();
        refrescarLlista().catch(error => gestionarError(error, "Error carregant cartes:"));
    });
}
