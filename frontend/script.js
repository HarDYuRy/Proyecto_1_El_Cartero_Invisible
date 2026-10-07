const nombre = "Erik";
const edad = 22;

const boto = document.getElementById("btnSaluda");
const boto1 = document.getElementById("btnPresenta");

function saluda() {
    alert("Hola, món!");
}

function presentacion() {
    alert(`Me llamo ${nombre}, Y tengo ${edad} años`);
}

boto.addEventListener("click", saluda);
boto1.addEventListener("click", presentacion);

const title = document.querySelector("#principalTitle");
title.textContent = "📮 El Cartero Invisible – Setmana 2";
title.setAttribute("data-role", "banner");

const contenidor = document.querySelector("#contenidorCartes");
contenidor.innerHTML = "<p>Cartes pendents: 0</p>";

const info = document.querySelector(".info");
info.style.color = "#4e2c50";


// ------------ CARTES SIMULADES ------------

const cartesSimulades = [
    { id: 1, remitent: "Maria", contingut: "Hola, com estàs?" },
    { id: 2, remitent: "Joan", contingut: "T'escric des del passat." },
    { id: 3, remitent: "Xavi", contingut: "Xavi es un chivi" }
];

function renderitzarCartes(cartes) {

    contenidor.innerHTML = "";

    cartes.forEach(carta => {

        const targeta = document.createElement("div");
        targeta.classList.add("carta");

        const remitent = document.createElement("h3");
        remitent.textContent = carta.remitent;

        const contingut = document.createElement("p");
        contingut.textContent = carta.contingut;

        // ID de la carta
        const id = document.createElement("span");
        id.textContent = `ID: ${carta.id}`;
        id.setAttribute("data-id", carta.id);

        targeta.appendChild(remitent);
        targeta.appendChild(contingut);
        targeta.appendChild(id);

        contenidor.appendChild(targeta);
    });
}
// Esperamos a que cargue el HTML
document.addEventListener("DOMContentLoaded", () => {

    renderitzarCartes(cartesSimulades);

    document.querySelector("#btnAfegir").addEventListener("click", () => {

        cartesSimulades.push({
            id: cartesSimulades.length + 1,
            remitent: "Carter " + (cartesSimulades.length + 1),
            contingut: "Aquesta carta s'acaba de crear dinàmicament!"
        });

        renderitzarCartes(cartesSimulades);
    });

});