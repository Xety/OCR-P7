import type { AuthFormState } from "@/lib/auth/types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

type Credentials = {
    email: string;
    password: string;
};

export function readCredentials(formData: FormData): Credentials {
    const email = formData.get("email");
    const password = formData.get("password");

    return {
        email: typeof email === "string" ? email.trim() : "",
        password: typeof password === "string" ? password : "",
    };
}

export function validateCredentials(
    credentials: Credentials,
    mode: "login" | "signup",
): AuthFormState["errors"] {
    const errors: NonNullable<AuthFormState["errors"]> = {};

    if (!credentials.email) {
        errors.email = ["L’adresse email est requise."];
    } else if (!emailPattern.test(credentials.email)) {
        errors.email = ["Saisissez une adresse email valide."];
    }

    if (!credentials.password) {
        errors.password = ["Le mot de passe est requis."];
    } else if (mode === "signup" && !passwordPattern.test(credentials.password)) {
        errors.password = [
            "Utilisez au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial parmi @$!%*?&.",
        ];
    }

    return Object.keys(errors).length > 0 ? errors : undefined;
}
