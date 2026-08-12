import { cache } from "react";
import { redirect } from "next/navigation";
import { apiRequest } from "@/lib/api/client";
import type { ApiUser, ProfileData } from "@/lib/api/types";
import { getSessionToken } from "@/lib/auth/session";

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

export async function requireUser() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return user;
}
