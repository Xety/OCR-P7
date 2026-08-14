import "server-only";

import { redirect } from "next/navigation";
import { ApiRequestError } from "@/lib/api/client";
import { deleteSession, getSessionToken } from "@/lib/auth/session";

/**
 * Retourne le token de la session courante ou redirige vers la connexion.
 */
export async function requireSessionToken(): Promise<string> {
    const token = await getSessionToken();

    if (!token) {
        redirect("/login");
    }

    return token;
}

/**
 * Supprime une session refusée par l'API et redirige vers la connexion.
 * Certains codes 401 fonctionnels peuvent être explicitement conservés.
 */
export async function redirectOnExpiredSession(
    error: unknown,
    allowedErrorCodes: readonly string[] = [],
): Promise<void> {
    if (
        error instanceof ApiRequestError &&
        error.status === 401 &&
        !allowedErrorCodes.includes(error.code ?? "")
    ) {
        await deleteSession();
        redirect("/login");
    }
}
