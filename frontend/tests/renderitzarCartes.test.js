import { renderitzarCartes } from '../script.js';


test('renderitza les cartes correctament', () => {
    const cartes = [
        { id: 1, remitent: 'Maria', contingut: 'Hola!' },
        { id: 2, remitent: 'Joan', contingut: 'Com estàs?' }
    ];
    document.body.innerHTML = `<div id="contenidorCartes"></div>`;

    renderitzarCartes(cartes);

    const cartesElements = document.querySelectorAll('.carta');
    expect(cartesElements.length).toBe(2);
    expect(cartesElements[0].querySelector('h3').textContent).toBe('De: Maria');
    expect(cartesElements[0].querySelector('p').textContent).toBe('Hola!');
});

import userEvent from '@testing-library/user-event';

test("delegació d'events: elimina carta en clicar el botó", async () => {
    document.body.innerHTML = `
        <div id="contenidorCartes">
            <div class="carta" data-id="1">
                <button class="btn-eliminar">Eliminar</button>
            </div>
        </div>
    `;

    // Simula la teva funció de delegació
    const contenidor = document.getElementById('contenidorCartes');

    contenidor.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-eliminar')) {
            const carta = e.target.closest('.carta');
            carta.remove();
        }
    });

    const user = userEvent.setup();
    const btn = document.querySelector('.btn-eliminar');

    await user.click(btn);

    expect(document.querySelectorAll('.carta').length).toBe(0);
});

// TESTS NUEVOS

// test("cada carta té un span amb el seu ID", () => {
//     const ids = document.querySelectorAll(".carta span");

//     expect(ids.length).toBe(3);

//     expect(ids[0].textContent).toBe("ID: 1");
//     expect(ids[1].textContent).toBe("ID: 2");
//     expect(ids[2].textContent).toBe("ID: 3");
// });


// test("cada carta té l'atribut data-id", () => {
//     const ids = document.querySelectorAll(".carta span");

//     expect(ids[0].getAttribute("data-id")).toBe("1");
//     expect(ids[1].getAttribute("data-id")).toBe("2");
//     expect(ids[2].getAttribute("data-id")).toBe("3");
// });


// test("el botó afegeix una nova carta", () => {
//     const botoAfegir = document.querySelector("#btnAfegir");

//     const cartesAbans = document.querySelectorAll(".carta").length;
    
//     botoAfegir.click();

//     const cartesDespres = document.querySelectorAll(".carta").length;

//     expect(cartesDespres).toBe(cartesAbans + 1);
// });


// test("la nova carta té el contingut correcte", () => {
//     const botoAfegir = document.querySelector("#btnAfegir");

//     botoAfegir.click();

//     const cartes = document.querySelectorAll(".carta");
//     const ultimaCarta = cartes[cartes.length - 1];

//     const contingut = ultimaCarta.querySelector("p");

//     expect(contingut.textContent).toBe(
//         "Aquesta carta s'acaba de crear dinàmicament!"
//     );
// });


// test("la nova carta té remitent i data-id", () => {
//     const botoAfegir = document.querySelector("#btnAfegir");

//     botoAfegir.click();

//     const cartes = document.querySelectorAll(".carta");
//     const ultimaCarta = cartes[cartes.length - 1];

//     const remitent = ultimaCarta.querySelector("h3");
//     const id = ultimaCarta.querySelector("span");

//     expect(remitent.textContent).toContain("Carter");
//     expect(id.hasAttribute("data-id")).toBe(true);
// });


