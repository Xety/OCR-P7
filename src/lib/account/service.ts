import "server-only";

import { apiRequest } from "@/lib/api/client";
import type { ProfileData } from "@/lib/api/types";
import { requireSessionToken } from "@/lib/auth/session-guard";

export type UpdateProfileInput = {
    email: string;
    name?: string;
};

export type UpdatePasswordInput = {
    currentPassword: string;
    newPassword: string;
};

/**
 * Met à jour le profil de l'utilisateur de la session courante.
 */
export async function updateProfile(input: UpdateProfileInput) {
    const token = await requireSessionToken();

    return apiRequest<ProfileData>("/auth/profile", {
        method: "PUT",
        token,
        body: JSON.stringify(input),
    });
}

/**
 * Met à jour le mot de passe de l'utilisateur de la session courante.
 */
export async function updatePassword(input: UpdatePasswordInput) {
    const token = await requireSessionToken();

    return apiRequest<Record<string, never>>("/auth/password", {
        method: "PUT",
        token,
        body: JSON.stringify(input),
    });
}
