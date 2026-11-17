import { refrescarLlista } from "../js/app.js";
import { gestionarError } from "../js/dom.js";
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { carregarCartes } from '../js/api.js';

beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn();
    global.alert = jest.fn();
    document.getElementById('contenidorCartes').innerHTML = '';
    const avis = document.getElementById('missatgeError');
    avis.textContent = '';
    avis.classList.remove('visible');
});

afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
});

test('carregarCartes carrega les cartes amb cookies i actualitza el DOM', async () => {
    const mockCartes = [
        { id: 1, remitent: 'Maria', contingut: 'Hola' },
        { id: 2, remitent: 'Joan', contingut: 'Adéu' }
    ];
    global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockCartes
    });

    await refrescarLlista().catch(error => gestionarError(error, "Error carregant cartes:"));

    expect(global.fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/cartas', { credentials: 'include' }
    );
    expect(document.querySelectorAll('.carta')).toHaveLength(2);
    expect(document.querySelector('#missatgeError')).not.toHaveClass('visible');
    expect(global.alert).not.toHaveBeenCalled();
});

test("carregarCartes mostra un avis de xarxa i l'amaga al cap de 5 segons", async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockRejectedValue(new TypeError('Network error'));

    await refrescarLlista().catch(error => gestionarError(error, "Error carregant cartes:"));

    const avis = document.querySelector('#missatgeError');
    expect(avis).toHaveTextContent(
        "No s'ha pogut connectar al servidor. Comprova que està en marxa."
    );
    expect(avis).toHaveClass('visible');
    expect(global.alert).not.toHaveBeenCalled();

    jest.advanceTimersByTime(4999);
    expect(avis).toHaveClass('visible');
    jest.advanceTimersByTime(1);
    expect(avis).not.toHaveClass('visible');
    expect(avis).toBeEmptyDOMElement();
});
