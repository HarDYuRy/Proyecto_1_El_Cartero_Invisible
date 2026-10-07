import { jest } from "@jest/globals";


document.body.innerHTML = `
    <button id="btnSaluda"></button>
    <button id="btnPresenta"></button>
    <button id="btnAfegir">Afegir carta de prova</button>
    <h1 id="principalTitle"></h1>
    <div id="contenidorCartes"></div>
    <p class="info"></p>
`;

window.alert = jest.fn();
await import("../script.js");

document.dispatchEvent(new Event("DOMContentLoaded"));

test("renderitza 3 cartes", () => {
    const cartes = document.querySelectorAll(".carta");

    expect(cartes.length).toBe(3);
});

test("mostra correctament els remitents", () => {
    const remitents = document.querySelectorAll(".carta h3");

    expect(remitents[0].textContent).toBe("Maria");
    expect(remitents[1].textContent).toBe("Joan");
    expect(remitents[2].textContent).toBe("Xavi");
});

test("mostra correctament el contingut de la primera carta", () => {
    const continguts = document.querySelectorAll(".carta p");

    expect(continguts[0].textContent).toBe("Hola, com estàs?");
});


// TESTS NUEVOS

test("cada carta té un span amb el seu ID", () => {
    const ids = document.querySelectorAll(".carta span");

    expect(ids.length).toBe(3);

    expect(ids[0].textContent).toBe("ID: 1");
    expect(ids[1].textContent).toBe("ID: 2");
    expect(ids[2].textContent).toBe("ID: 3");
});


test("cada carta té l'atribut data-id", () => {
    const ids = document.querySelectorAll(".carta span");

    expect(ids[0].getAttribute("data-id")).toBe("1");
    expect(ids[1].getAttribute("data-id")).toBe("2");
    expect(ids[2].getAttribute("data-id")).toBe("3");
});


test("el botó afegeix una nova carta", () => {
    const botoAfegir = document.querySelector("#btnAfegir");

    const cartesAbans = document.querySelectorAll(".carta").length;

    botoAfegir.click();

    const cartesDespres = document.querySelectorAll(".carta").length;

    expect(cartesDespres).toBe(cartesAbans + 1);
});


test("la nova carta té el contingut correcte", () => {
    const botoAfegir = document.querySelector("#btnAfegir");

    botoAfegir.click();

    const cartes = document.querySelectorAll(".carta");
    const ultimaCarta = cartes[cartes.length - 1];

    const contingut = ultimaCarta.querySelector("p");

    expect(contingut.textContent).toBe(
        "Aquesta carta s'acaba de crear dinàmicament!"
    );
});


test("la nova carta té remitent i data-id", () => {
    const botoAfegir = document.querySelector("#btnAfegir");

    botoAfegir.click();

    const cartes = document.querySelectorAll(".carta");
    const ultimaCarta = cartes[cartes.length - 1];

    const remitent = ultimaCarta.querySelector("h3");
    const id = ultimaCarta.querySelector("span");

    expect(remitent.textContent).toContain("Carter");
    expect(id.hasAttribute("data-id")).toBe(true);
});