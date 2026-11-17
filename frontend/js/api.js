import { comprovarResposta } from "./utils.js";

export const API_URL = "http://127.0.0.1:8000";

export async function carregarCartes() {
    const response = await fetch(`${API_URL}/cartas`, { credentials: "include" });
    await comprovarResposta(response);
    return await response.json();
}

export async function enviarCarta(dades) {
    const response = await fetch(`${API_URL}/cartas`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dades)
    });

    await comprovarResposta(response);
    return await response.json();
}

export async function actualitzarCarta(id, dades) {
    const response = await fetch(`${API_URL}/cartas/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dades)
    });

    await comprovarResposta(response);
    const carta = await response.json();

    return carta;
}

export async function eliminarCarta(id) {
    const response = await fetch(`${API_URL}/cartas/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    await comprovarResposta(response);
    return response.status === 204 ? null : await response.json();
}
