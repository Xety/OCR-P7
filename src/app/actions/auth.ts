"use server";

import { redirect } from "next/navigation";
import * as z from "zod";
import { apiRequest, ApiRequestError } from "@/lib/api/client";
import {
    mapApiFieldErrors,
    SERVICE_UNAVAILABLE_MESSAGE,
} from "@/lib/api/errors";
import type { AuthData } from "@/lib/api/types";
import { createSession, deleteSession } from "@/lib/auth/session";
import type { AuthFormState, AuthFieldErrors } from "@/lib/auth/types";
import { getCredentialsInput } from "@/lib/auth/validation";
import { credentialsSchemas } from "@/lib/validation/schemas";

function getErrorState(error: unknown): AuthFormState {
    if (error instanceof ApiRequestError) {
        const errors: AuthFieldErrors = mapApiFieldErrors(error, {
            email: "email",
            password: "password",
        });

        return {
            errors: Object.keys(errors).length > 0 ? errors : undefined,
            message: error.message,
        };
    }

    return {
        message: SERVICE_UNAVAILABLE_MESSAGE,
    };
}

async function authenticate(
    mode: "login" | "signup",
    formData: FormData,
): Promise<AuthFormState> {
    const result = credentialsSchemas[mode].safeParse(
        getCredentialsInput(formData),
    );

    if (!result.success) {
        const { fieldErrors } = z.flattenError(result.error);

        return {
            errors: {
                email: fieldErrors.email,
                password: fieldErrors.password,
            },
        };
    }

    try {
        const response = await apiRequest<AuthData>(
            mode === "login" ? "/auth/login" : "/auth/register",
            {
                method: "POST",
                body: JSON.stringify(result.data),
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
