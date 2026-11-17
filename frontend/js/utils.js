export function getCookie(nom) {
    const prefix = encodeURIComponent(nom) + "=";
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
        const text = cookie.trim();

        if (text.startsWith(prefix)) {
            return decodeURIComponent(text.substring(prefix.length));
        }
    }

    return null;
}

export function setCookie(nom, valor, dies) {
    const data = new Date();
    data.setTime(data.getTime() + dies * 24 * 60 * 60 * 1000);

    document.cookie =
        encodeURIComponent(nom) + "=" + encodeURIComponent(valor) +
        "; expires=" + data.toUTCString() +
        "; path=/";
}

export function esborrarCookie(nom) {
    setCookie(nom, "", -1);
}

export function generarIdUsuari() {
    return "user_" + Math.random().toString(36).substring(2, 10);
}

export function missatgePerCodi(status, detail) {
    if (status === 404) {
        return "La carta que busques no existeix.";
    }

    if (status === 422) {
        return "Les dades enviades no són vàlides. Revisa els camps.";
    }

    if (status >= 500) {
        return "Hi ha hagut un error al servidor. Torna a provar més tard.";
    }

    return typeof detail === "string" && detail.trim()
        ? detail
        : `Error HTTP: ${status}`;
}

export async function comprovarResposta(response) {
    if (response.ok) {
        return response;
    }

    let detail = null;

    try {
        const dades = await response.json();
        detail = dades?.detail;
    } catch {
        // La resposta pot no contenir JSON.
    }

    const error = new Error(missatgePerCodi(response.status, detail));
    error.status = response.status;
    throw error;
}
