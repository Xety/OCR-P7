"use server";

import { refresh } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import * as z from "zod";
import { updatePassword, updateProfile } from "@/lib/account/service";
import {
    passwordUpdateSchema,
    profileSchema,
} from "@/lib/account/validation";
import type {
    PasswordActionState,
    PasswordFieldErrors,
    ProfileActionState,
    ProfileFieldErrors,
} from "@/lib/account/types";
import { ApiRequestError } from "@/lib/api/client";
import {
    mapApiFieldErrors,
    SERVICE_UNAVAILABLE_MESSAGE,
} from "@/lib/api/errors";
import { redirectOnExpiredSession } from "@/lib/auth/session-guard";
import { joinFullName } from "@/lib/user";

function getProfileErrorState(error: unknown): ProfileActionState {
    if (!(error instanceof ApiRequestError)) {
        return { status: "error", message: SERVICE_UNAVAILABLE_MESSAGE };
    }

    const errors: ProfileFieldErrors = mapApiFieldErrors(error, {
        email: "email",
        name: "firstName",
    });

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
        return { status: "error", message: SERVICE_UNAVAILABLE_MESSAGE };
    }

    const errors: PasswordFieldErrors = mapApiFieldErrors(error, {
        currentPassword: "currentPassword",
        newPassword: "newPassword",
    });

    if (error.code === "INVALID_CURRENT_PASSWORD") {
        errors.currentPassword = [error.message];
    }

    return {
        status: "error",
        errors: Object.keys(errors).length > 0 ? errors : undefined,
        message: Object.keys(errors).length === 0 ? error.message : undefined,
    };
}

/**
 * Met à jour le profil de l’utilisateur courant.
 *
 * @param _previousState
 * @param formData
 *
 * @returns L’état de l’action de mise à jour du profil.
 */
export async function updateProfileAction(
    _previousState: ProfileActionState,
    formData: FormData,
): Promise<ProfileActionState> {
    const result = profileSchema.safeParse({
        lastName: formData.get("lastName"),
        firstName: formData.get("firstName"),
        email: formData.get("email")
    });

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

    const fullName = joinFullName(result.data.firstName, result.data.lastName);

    try {
        const response = await updateProfile({
            email: result.data.email,
            ...(fullName ? { name: fullName } : {}),
        });

        refresh();

        return {
            status: "success",
            message: response.message || "Profil mis à jour avec succès.",
        };
    } catch (error) {
        unstable_rethrow(error);
        await redirectOnExpiredSession(error);

        return getProfileErrorState(error);
    }
}

/**
 * Met à jour le mot de passe de l’utilisateur courant.
 *
 * @param _previousState
 * @param formData
 *
 * @returns L’état de l’action de mise à jour du mot de passe.
 */
export async function updatePasswordAction(
    _previousState: PasswordActionState,
    formData: FormData,
): Promise<PasswordActionState> {
    const result = passwordUpdateSchema.safeParse({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword")
    });

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

    try {
        const response = await updatePassword(result.data);

        return {
            status: "success",
            message: response.message || "Mot de passe mis à jour avec succès.",
        };
    } catch (error) {
        unstable_rethrow(error);
        await redirectOnExpiredSession(error, ["INVALID_CURRENT_PASSWORD"]);

        return getPasswordErrorState(error);
    }
}
