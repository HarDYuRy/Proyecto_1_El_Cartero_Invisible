import { jest } from '@jest/globals';
import { actualitzarCarta, eliminarCarta } from '../js/api.js';

const dades = {
    remitent: 'Nou', destinatari: 'Nou',
    contingut: 'Contingut actualitzat', personatge: 'Astra'
};

beforeEach(() => {
    // Un mock nou evita conservar respostes pendents del test anterior.
    global.fetch = jest.fn();
    global.alert = jest.fn();
    document.getElementById('contenidorCartes').innerHTML = '';
});

test('actualitzarCarta envia PUT amb les dades correctes sense refrescar la llista', async () => {
    const carta = { ...dades, id: 1 };
    global.fetch
        .mockResolvedValueOnce({ ok: true, status: 200, json: async () => carta })
;

    await expect(actualitzarCarta(1, dades)).resolves.toEqual(carta);

    expect(global.fetch).toHaveBeenNthCalledWith(1,
        'http://127.0.0.1:8000/cartas/1', {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dades)
        });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(document.querySelectorAll('.carta')).toHaveLength(0);
    expect(global.alert).not.toHaveBeenCalled();
});

test('eliminarCarta envia DELETE, accepta 204 sense JSON sense refrescar la llista', async () => {
    document.getElementById('contenidorCartes').innerHTML = '<div class="carta">Antiga</div>';
    global.fetch
        // Sense json(): una resposta 204 no te cos.
        .mockResolvedValueOnce({ ok: true, status: 204 });

    await expect(eliminarCarta(5)).resolves.toBeNull();

    expect(global.fetch).toHaveBeenNthCalledWith(1,
        'http://127.0.0.1:8000/cartas/5', { method: 'DELETE', credentials: 'include' });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(document.querySelectorAll('.carta')).toHaveLength(1);
    expect(global.alert).not.toHaveBeenCalled();
});

test('actualitzarCarta llanca error 404 i no refresca la llista', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(actualitzarCarta(999, dades)).rejects.toMatchObject({ status: 404, message: 'La carta que busques no existeix.' });
    expect(global.fetch).toHaveBeenCalledTimes(1);
});

test('eliminarCarta llanca error 404 i no refresca la llista', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(eliminarCarta(999)).rejects.toMatchObject({ status: 404, message: 'La carta que busques no existeix.' });
    expect(global.fetch).toHaveBeenCalledTimes(1);
});
