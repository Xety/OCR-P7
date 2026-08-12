"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { apiRequest, ApiRequestError } from "@/lib/api/client";
import type { ProfileData } from "@/lib/api/types";
import {
    getPasswordInput,
    getProfileInput
} from "@/lib/account/validation";
import { joinFullName } from "@/lib/account/user-name";
import type {
    PasswordActionState,
    PasswordFieldErrors,
    ProfileActionState,
    ProfileFieldErrors,
} from "@/lib/account/types";
import { deleteSession, getSessionToken } from "@/lib/auth/session";
import { profileSchema, passwordUpdateSchema } from "@/lib/validation/schemas";

const unavailableMessage =
    "Le service est momentanément indisponible. Veuillez réessayer plus tard.";

async function requireSessionToken() {
    const token = await getSessionToken();

    if (!token) {
        redirect("/login");
    }

    return token;
}

async function redirectOnExpiredSession(
    error: ApiRequestError,
    allowedAuthenticationError?: string,
) {
    if (error.status === 401 && error.code !== allowedAuthenticationError) {
        await deleteSession();
        redirect("/login");
    }
}

function getProfileErrorState(error: unknown): ProfileActionState {
    if (!(error instanceof ApiRequestError)) {
        return { status: "error", message: unavailableMessage };
    }

    const errors = error.fieldErrors.reduce<ProfileFieldErrors>(
        (fieldErrors, fieldError) => {
            if (fieldError.field === "email") {
                fieldErrors.email = [fieldError.message];
            }

            if (fieldError.field === "name") {
                fieldErrors.firstName = [fieldError.message];
            }

            return fieldErrors;
        },
        {},
    );

    if (error.code === "EMAIL_ALREADY_EXISTS") {
        errors.email = [error.message];
    }

    return {
        status: "error",
        errors: Object.keys(errors).length > 0 ? errors : undefined,
        message: Object.keys(errors).length === 0 ? error.message : undefined,
    };
}

function getPasswordErrorState(error: unknown): PasswordActionState {
    if (!(error instanceof ApiRequestError)) {
        return { status: "error", message: unavailableMessage };
    }

    const errors = error.fieldErrors.reduce<PasswordFieldErrors>(
        (fieldErrors, fieldError) => {
            if (
                fieldError.field === "currentPassword" ||
                fieldError.field === "newPassword"
            ) {
                fieldErrors[fieldError.field] = [fieldError.message];
            }

            return fieldErrors;
        },
        {},
    );

    if (error.code === "INVALID_CURRENT_PASSWORD") {
        errors.currentPassword = [error.message];
    }

    return {
        status: "error",
        errors: Object.keys(errors).length > 0 ? errors : undefined,
        message: Object.keys(errors).length === 0 ? error.message : undefined,
    };
}

export async function updateProfileAction(
    _previousState: ProfileActionState,
    formData: FormData,
): Promise<ProfileActionState> {
    const result = profileSchema.safeParse(getProfileInput(formData));

    if (!result.success) {
        const { fieldErrors } = z.flattenError(result.error);

        return {
            status: "error",
            errors: {
                lastName: fieldErrors.lastName,
                firstName: fieldErrors.firstName,
                email: fieldErrors.email,
            },
        };
    }

    const token = await requireSessionToken();
    const fullName = joinFullName(result.data.firstName, result.data.lastName);

    try {
        const response = await apiRequest<ProfileData>("/auth/profile", {
            method: "PUT",
            token,
            body: JSON.stringify({
                email: result.data.email,
                ...(fullName ? { name: fullName } : {}),
            }),
        });

        refresh();

        return {
            status: "success",
            message: response.message || "Profil mis à jour avec succès.",
        };
    } catch (error) {
        if (error instanceof ApiRequestError) {
            await redirectOnExpiredSession(error);
        }

        return getProfileErrorState(error);
    }
}

export async function updatePasswordAction(
    _previousState: PasswordActionState,
    formData: FormData,
): Promise<PasswordActionState> {
    const result = passwordUpdateSchema.safeParse(getPasswordInput(formData));

    if (!result.success) {
        const { fieldErrors } = z.flattenError(result.error);

        return {
            status: "error",
            errors: {
                currentPassword: fieldErrors.currentPassword,
                newPassword: fieldErrors.newPassword,
            },
        };
    }

    const token = await requireSessionToken();

    try {
        const response = await apiRequest<Record<string, never>>(
            "/auth/password",
            {
                method: "PUT",
                token,
                body: JSON.stringify(result.data),
            },
        );

        return {
            status: "success",
            message: response.message || "Mot de passe mis à jour avec succès.",
        };
    } catch (error) {
        if (error instanceof ApiRequestError) {
            await redirectOnExpiredSession(error, "INVALID_CURRENT_PASSWORD");
        }

        return getPasswordErrorState(error);
    }
}
