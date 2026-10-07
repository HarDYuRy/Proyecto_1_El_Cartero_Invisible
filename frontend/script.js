//////////////////////////
// VARIABLES GLOBALS    //
//////////////////////////
const nombre = "Erik";
const edad = 22;

let boto
let boto1

const cartesSimulades = [
    { id: 1, remitent: "Maria", contingut: "Hola, com estàs?" },
    { id: 2, remitent: "Joan", contingut: "T'escric des del passat." },
    { id: 3, remitent: "Xavi", contingut: "Xavi es un chivi" }
];

let contenidor

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

    //Afegir cartes
    document.querySelector("#btnAfegir").addEventListener("click", () => {
        cartesSimulades.push({
            id: cartesSimulades.length + 1,
            remitent: "Carter " + (cartesSimulades.length + 1),
            contingut: "Aquesta carta s'acaba de crear dinàmicament!"
        });

        renderitzarCartes(cartesSimulades);
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
    contenidor.innerHTML = "";   // 1. Buidem el taulell

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

        // 3. Muntem l'estructura
        divCarta.appendChild(titol);
        divCarta.appendChild(paragraf);
        divCarta.appendChild(idSpan);

        // 4. Pengem la carta al taulell
        contenidor.appendChild(divCarta);
    });
}
// Crida-la en carregar la pàgina
document.addEventListener("DOMContentLoaded", () => {
    renderitzarCartes(cartesSimulades);
});

//////////////////////////
// CODI                 //
//////////////////////////
// Executa-ho només si estem al navegador (evitant problemes a Node/Jest)
if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", inicialitzar);
}



