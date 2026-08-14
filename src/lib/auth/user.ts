import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { apiRequest } from "@/lib/api/client";
import type { ApiUser, ProfileData } from "@/lib/api/types";
import { getSessionToken } from "@/lib/auth/session";

/**
 * Récupère l'utilisateur authentifié actuel.
 *
 * @returns Une promise qui se résout en l'utilisateur actuel, ou en null s'il n'est pas authentifié.
 */
export const getCurrentUser = cache(async (): Promise<ApiUser | null> => {
    const token = await getSessionToken();

    if (!token) {
        return null;
    }

    try {
        const response = await apiRequest<ProfileData>("/auth/profile", { token });
        return response.data?.user ?? null;
    } catch {
        return null;
    }
});

/**
 * S'assure qu'un utilisateur est authentifié et récupère l'utilisateur actuel.
 * Si l'utilisateur n'est pas authentifié, il est redirigé vers la page de connexion.
 *
 * @returns Une promise qui se résout en l'utilisateur authentifié actuel.
 */
export async function requireUser() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return user;
}
