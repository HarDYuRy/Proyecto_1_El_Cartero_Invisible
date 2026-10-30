import { jest } from '@jest/globals';
import { actualitzarCarta, eliminarCarta } from '../script.js';

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

test('actualitzarCarta envia PUT amb les dades correctes i refresca la llista', async () => {
    const carta = { ...dades, id: 1 };
    global.fetch
        .mockResolvedValueOnce({ ok: true, status: 200, json: async () => carta })
        // carregarCartes fa una segona petició: GET retorna una llista.
        .mockResolvedValueOnce({ ok: true, json: async () => [carta] });

    await expect(actualitzarCarta(1, dades)).resolves.toEqual(carta);

    expect(global.fetch).toHaveBeenNthCalledWith(1,
        'http://127.0.0.1:8000/cartas/1', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dades)
        });
    expect(global.fetch).toHaveBeenNthCalledWith(2, 'http://127.0.0.1:8000/cartes');
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(document.querySelector('.carta p').textContent).toBe(dades.contingut);
    expect(global.alert).not.toHaveBeenCalled();
});

test('eliminarCarta envia DELETE, accepta 204 sense JSON i refresca la llista', async () => {
    document.getElementById('contenidorCartes').innerHTML = '<div class="carta">Antiga</div>';
    global.fetch
        // Sense json(): una resposta 204 no te cos.
        .mockResolvedValueOnce({ ok: true, status: 204 })
        .mockResolvedValueOnce({ ok: true, json: async () => [] });

    await eliminarCarta(5);

    expect(global.fetch).toHaveBeenNthCalledWith(1,
        'http://127.0.0.1:8000/cartes/5', { method: 'DELETE' });
    expect(global.fetch).toHaveBeenNthCalledWith(2, 'http://127.0.0.1:8000/cartes');
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(document.querySelectorAll('.carta')).toHaveLength(0);
    expect(global.alert).not.toHaveBeenCalled();
});

test('actualitzarCarta llanca error 404 i no refresca la llista', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(actualitzarCarta(999, dades)).rejects.toThrow('Error HTTP: 404');
    expect(global.fetch).toHaveBeenCalledTimes(1);
});

test('eliminarCarta llanca error 404 i no refresca la llista', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(eliminarCarta(999)).rejects.toThrow('Error HTTP: 404');
    expect(global.fetch).toHaveBeenCalledTimes(1);
});
