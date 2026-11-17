import { jest } from '@jest/globals';
import { carregarCartes, enviarCarta } from '../js/api.js';

beforeEach(() => { global.fetch = jest.fn(); });

test('GET retorna les dades sense pintar el DOM', async () => {
    document.body.innerHTML = '<div id="contenidorCartes">Original</div>';
    const cartes = [{ id: 1, contingut: 'Hola' }];
    global.fetch.mockResolvedValue({ ok: true, json: async () => cartes });
    await expect(carregarCartes()).resolves.toEqual(cartes);
    expect(document.querySelector('#contenidorCartes').textContent).toBe('Original');
    expect(global.fetch).toHaveBeenCalledTimes(1);
});

test('GET propaga els errors de xarxa al consumidor', async () => {
    const error = new TypeError('Network error');
    global.fetch.mockRejectedValue(error);
    await expect(carregarCartes()).rejects.toBe(error);
});

test('POST retorna la carta creada i no fa un GET addicional', async () => {
    const dades = { remitent: 'Maria', contingut: 'Hola' };
    const carta = { ...dades, id: 2 };
    global.fetch.mockResolvedValue({ ok: true, json: async () => carta });
    await expect(enviarCarta(dades)).resolves.toEqual(carta);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/cartas', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dades)
    });
});
