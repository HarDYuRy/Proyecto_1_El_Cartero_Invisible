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

test("el títol principal es modifica correctament", () => {
    const title = document.getElementById("principalTitle");

    expect(title.textContent).toBe(
        "📮 El Cartero Invisible – Setmana 2"
    );

    expect(title.getAttribute("data-role")).toBe("banner");
});