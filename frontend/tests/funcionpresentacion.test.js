import { jest } from "@jest/globals";
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';

test("el botó presenta mostra el nom i l'edat", () => {

    document.body.innerHTML = `
    <button id="btnSaluda"></button>
    <button id="btnPresenta"></button>
    <h1 id="principalTitle"></h1>
    <div id="contenidorCartes"></div>
    <p class="info"></p>
`;
window.alert = jest.fn();
window.informacio = jest.fn(() => alert(`Me llamo Erik, Y tengo 22 años`));
    const boto = document.getElementById("btnPresenta");
    boto.addEventListener("click", window.informacio);

    fireEvent.click(boto);


    expect(window.informacio).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
        "Me llamo Erik, Y tengo 22 años"
    );
});