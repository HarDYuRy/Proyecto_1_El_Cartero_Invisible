import { refrescarLlista } from "../js/app.js";
import { gestionarError } from "../js/dom.js";
import { jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { carregarCartes, actualitzarCarta } from "../js/api.js";

const respostaError = (status, detail) => ({
    ok: false,
    status,
    json: async () => ({ detail })
});

beforeEach(() => {
    jest.useFakeTimers();

    document.body.innerHTML = `
        <div id="missatgeError" aria-live="polite"></div>
        <div id="contenidorCartes"></div>
        <table><tbody id="cosTaulaCartes"></tbody></table>
    `;

    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(global, "alert").mockImplementation(() => {});
    global.fetch = jest.fn();
});

afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
});

test.each([
    [404, "Carta no trobada", "La carta que busques no existeix."],
    [
        422,
        "El contingut no pot estar buit",
        "Les dades enviades no són vàlides. Revisa els camps."
    ],
    [
        500,
        "Error intern",
        "Hi ha hagut un error al servidor. Torna a provar més tard."
    ]
])("mostra el missatge corresponent al codi %i", async (status, detail, missatge) => {
    global.fetch.mockResolvedValue(respostaError(status, detail));

    await refrescarLlista().catch(error => gestionarError(error, "Error carregant cartes:"));

    const avis = document.querySelector("#missatgeError");

    expect(avis).toHaveTextContent(missatge);
    expect(avis).toHaveClass("visible");
    expect(global.alert).not.toHaveBeenCalled();
});

test("mostra un error de connexió si el servidor no respon", async () => {
    global.fetch.mockRejectedValue(new TypeError("Failed to fetch"));

    await refrescarLlista().catch(error => gestionarError(error, "Error carregant cartes:"));

    const avis = document.querySelector("#missatgeError");

    expect(avis).toHaveTextContent(
        "No s'ha pogut connectar al servidor. Comprova que està en marxa."
    );
    expect(avis).toHaveClass("visible");
    expect(global.alert).not.toHaveBeenCalled();
});

test("actualitzarCarta llança el missatge traduït del 404 i conserva el codi", async () => {
    global.fetch.mockResolvedValue(
        respostaError(404, "Carta no trobada")
    );

    await expect(actualitzarCarta(999, {})).rejects.toMatchObject({
        status: 404,
        message: "La carta que busques no existeix."
    });

    // Si falla el PUT, no ha de carregar la llista de nou.
    expect(global.fetch).toHaveBeenCalledTimes(1);
});