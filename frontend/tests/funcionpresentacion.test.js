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

test("el botó presenta mostra el nom i l'edat", () => {
    const boto = document.getElementById("btnPresenta");

    boto.click();

    expect(window.alert).toHaveBeenCalledWith(
        "Me llamo Erik, Y tengo 22 años"
    );
});