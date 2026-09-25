import { jest } from "@jest/globals";

document.body.innerHTML = `
    <button id="btnSaluda"></button>
    <button id="btnPresenta"></button>
    <h1 id="principalTitle"></h1>
    <div id="contenidorCartes"></div>
    <p class="info"></p>
`;

window.alert = jest.fn();

await import("../script.js");

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