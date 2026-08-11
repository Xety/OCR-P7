"use server";

import { redirect } from "next/navigation";
import { apiRequest, ApiRequestError } from "@/lib/api/client";
import type { AuthData } from "@/lib/api/types";
import { createSession, deleteSession } from "@/lib/auth/session";
import type { AuthFormState, AuthFieldErrors } from "@/lib/auth/types";
import {
    readCredentials,
    validateCredentials,
} from "@/lib/auth/validation";

function getErrorState(error: unknown): AuthFormState {
    if (error instanceof ApiRequestError) {
        const errors = error.fieldErrors.reduce<AuthFieldErrors>(
            (fieldErrors, fieldError) => {
                if (fieldError.field === "email" || fieldError.field === "password") {
                    fieldErrors[fieldError.field] = [fieldError.message];
                }

                return fieldErrors;
            },
            {},
        );

        return {
            errors: Object.keys(errors).length > 0 ? errors : undefined,
            message: error.message,
        };
    }

    return {
        message:
            "Le service est momentanément indisponible. Veuillez réessayer plus tard.",
    };
}

async function authenticate(
    mode: "login" | "signup",
    formData: FormData,
): Promise<AuthFormState> {
    const credentials = readCredentials(formData);
    const errors = validateCredentials(credentials, mode);

    if (errors) {
        return { errors };
    }

    try {
        const response = await apiRequest<AuthData>(
            mode === "login" ? "/auth/login" : "/auth/register",
            {
                method: "POST",
                body: JSON.stringify(credentials),
            },
        );

        if (!response.data?.token) {
            return { message: "La réponse du serveur est incomplète." };
        }

        await createSession(response.data.token);
    } catch (error) {
        return getErrorState(error);
    }

    redirect("/dashboard");
}

export async function loginAction(
    _previousState: AuthFormState,
    formData: FormData,
) {
    return authenticate("login", formData);
}

export async function signupAction(
    _previousState: AuthFormState,
    formData: FormData,
) {
  return authenticate("signup", formData);
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
