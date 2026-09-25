const nombre = "Erik";
const edad = 22;
const boto = document.getElementById("btnSaluda");
const boto1= document.getElementById("btnPresenta");
function saluda() {
    alert("Hola, món!");
}
function presentacion(){
    alert(`Me llamo ${nombre}, Y tengo ${edad} años`)
}
boto.addEventListener("click", saluda);
boto1.addEventListener("click", presentacion);

const title = document.querySelector("#principalTitle");
title.textContent="📮 El Cartero Invisible – Setmana 2";
title.setAttribute("data-role","banner");

const contenidor = document.querySelector("#contenidorCartes");
contenidor.innerHTML = "<p>Cartes pendents: 0</p>";

const info = document.querySelector(".info");
info.style.color = "#4e2c50";


function renderitzarCartes(cartes) {

    contenidor.innerHTML = "";

    cartes.forEach(carta => {
        const targeta = document.createElement("div");
        targeta.classList.add("carta");
        const remitent = document.createElement("h3");
        const contingut = document.createElement("p");

        remitent.textContent = carta.remitent;
        contingut.textContent = carta.contingut;

        targeta.appendChild(remitent);
        targeta.appendChild(contingut);

        contenidor.appendChild(targeta);
    });
}
//------------Esto es temporal------------
const cartes = [
    { id: 1, remitent: "Maria", contingut: "Hola, com estàs?" },
    { id: 2, remitent: "Joan", contingut: "T'escric des del passat." },
    { id: 3, remitent: "Xavi", contingut: "Xavi es un chivi" }
];

renderitzarCartes(cartes);
//-----------------------------------------
