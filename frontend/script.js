//////////////////////////
// VARIABLES GLOBALS    //
//////////////////////////
const nombre = "Erik";
const edad = 22;

let boto;
let boto1;

const cartesSimulades = [
    { id: 1, remitent: "Maria", contingut: "Hola, com estàs?" },
    { id: 2, remitent: "Joan", contingut: "T'escric des del passat." },
    { id: 3, remitent: "Xavi", contingut: "Xavi es un chivi" }
];

let contenidor;

//////////////////////////
// FUNCIONS             //
//////////////////////////
function inicialitzar() {
    boto = document.getElementById("btnSaluda");
    boto1 = document.getElementById("btnPresenta");
    boto.addEventListener("click", saluda);
    boto1.addEventListener("click", presentacion);

    const title = document.querySelector("#principalTitle");
    title.textContent = "📮 El Cartero Invisible – Setmana 2";
    title.setAttribute("data-role", "banner");

    const info = document.querySelector(".info");
    info.style.color = "#4e2c50";

    // Afegir cartes
    document.querySelector("#btnAfegir").addEventListener("click", () => {
        cartesSimulades.push({
            id: cartesSimulades.length + 1,
            remitent: "Carter " + (cartesSimulades.length + 1),
            contingut: "Aquesta carta s'acaba de crear dinàmicament!"
        });

        renderitzarCartes(cartesSimulades);
    });

    // SEMANA 4

    // Formulari per afegir una nova carta
    const formCarta = document.querySelector("#formCarta");

    formCarta.addEventListener("submit", (event) => {

        // Evita que la pàgina es recarregui
        event.preventDefault();

        // Agafem els valors del formulari
        const remitent = document.querySelector("#remitent").value.trim();
        const destinatari = document.querySelector("#destinatari").value.trim();
        const contingut = document.querySelector("#contingut").value.trim();
        const personatge = document.querySelector("#personatge").value.trim();

        // Validació dels camps obligatoris
        if (remitent === "" || destinatari === "" || contingut === "") {
            alert("Remitent, destinatari i contingut no poden estar buits!");
            return;
        }

        // Creem la nova carta
        const novaCarta = {
            id: cartesSimulades.length + 1,
            remitent: remitent,
            destinatari: destinatari,
            contingut: contingut,
            personatge: personatge
        };

        // Afegim la carta a l'array
        cartesSimulades.push(novaCarta);

        // Tornem a mostrar les cartes
        renderitzarCartes(cartesSimulades);

        // Buidem el formulari
        formCarta.reset();
    });

    // SEMANA 4 - Delegació d'esdeveniments
    const contenidorCartes = document.querySelector("#contenidorCartes");

    contenidorCartes.addEventListener("click", (event) => {
        if (event.target.classList.contains("btn-eliminar")) {

            const id = Number(event.target.dataset.id);

            const index = cartesSimulades.findIndex(carta => carta.id === id);

            if (index !== -1) {
                cartesSimulades.splice(index, 1);
                renderitzarCartes(cartesSimulades);
            }
        }
    });
}

function saluda() {
    alert("Hola, món!");
}

function presentacion() {
    alert(`Me llamo ${nombre}, Y tengo ${edad} años`);
}


// ------------ CARTES SIMULADES ------------

export function renderitzarCartes(cartes) {
    const contenidor = document.querySelector("#contenidorCartes");
    contenidor.innerHTML = ""; // 1. Buidem el taulell

    cartes.forEach(carta => {
        // 2. Fabriquem la carta
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

        divCarta.appendChild(titol);
        divCarta.appendChild(paragraf);
        divCarta.appendChild(idSpan);
        divCarta.appendChild(btnEliminar);

        contenidor.appendChild(divCarta);
    });
}

// Crida-la en carregar la pàgina
document.addEventListener("DOMContentLoaded", () => {
    renderitzarCartes(cartes);
});

async function carregarCartes() {
    try {
        const response = await fetch('http://127.0.0.1:8000/cartas');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const cartes = await response.json();
        renderitzarCartes(cartes);   // passa les cartes rebudes
    } catch (error) {
        console.error('Error carregant cartes:', error);
        alert("No s'han pogut carregar les cartes. Comprova que el servidor està en marxa.");
    }
}
//////////////////////////
// CODI                 //
//////////////////////////

// Executa-ho només si estem al navegador (evitant problemes a Node/Jest)
if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", inicialitzar);
}
