import "server-only";

import type { ApiFieldError, ApiResponse } from "@/lib/api/types";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";

export class ApiRequestError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly code?: string,
        public readonly fieldErrors: ApiFieldError[] = [],
    ) {
        super(message);
        this.name = "ApiRequestError";
    }
}

type ApiRequestOptions = RequestInit & {
    token?: string;
};

/**
 *  Effectue une requête API vers le backend avec les options spécifiées.
 *
 * @param path Le chemin de l'API (ex: "/auth/profile").
 * @param param1 Les options de la requête, y compris le token d'authentification et les en-têtes supplémentaires.
 *
 * @returns Une promise qui se résout en la réponse de l'API.
 */
export async function apiRequest<T>(
    path: `/${string}`,
    { token, headers, ...init }: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
    const requestHeaders = new Headers(headers);

    if (init.body && !requestHeaders.has("Content-Type")) {
        requestHeaders.set("Content-Type", "application/json");
    }

    if (token) {
        requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: requestHeaders,
        cache: "no-store",
    });

    let payload: ApiResponse<T> | null = null;

    try {
        payload = (await response.json()) as ApiResponse<T>;
    } catch {
        // Une réponse non JSON est traitée comme une erreur générique ci-dessous.
    }

    if (!response.ok || !payload?.success) {
        throw new ApiRequestError(
            payload?.message ?? "Une erreur est survenue lors de la requête.",
            response.status,
            payload?.error,
            payload?.data?.errors ?? [],
        );
    }

    return payload;
}
