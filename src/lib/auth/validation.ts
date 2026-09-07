import * as z from "zod";

const validationMessages = {
    requiredEmail: "L’adresse email est requise.",
    invalidEmail: "Saisissez une adresse email valide.",
    requiredPassword: "Le mot de passe est requis.",
    invalidPassword:
        "Utilisez au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial parmi @$!%*?&.",
} as const;

const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const emailSchema = z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z
        .string({ error: validationMessages.requiredEmail })
        .min(1, { error: validationMessages.requiredEmail })
        .pipe(z.email({ error: validationMessages.invalidEmail })),
);

export const requiredPasswordSchema = z
    .string({ error: validationMessages.requiredPassword })
    .min(1, { error: validationMessages.requiredPassword });

export const strongPasswordSchema = requiredPasswordSchema.pipe(
    z
        .string()
        .regex(passwordPattern, { error: validationMessages.invalidPassword }),
);

export const credentialsSchemas = {
    login: z.object({
        email: emailSchema,
        password: requiredPasswordSchema,
    }),
    signup: z.object({
        email: emailSchema,
        password: strongPasswordSchema,
    }),
} as const;