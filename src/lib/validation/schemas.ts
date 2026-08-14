import * as z from "zod";
import { joinFullName } from "@/lib/user";

export const validationMessages = {
    requiredEmail: "L’adresse email est requise.",
    invalidEmail: "Saisissez une adresse email valide.",
    requiredPassword: "Le mot de passe est requis.",
    invalidPassword:
        "Utilisez au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial parmi @$!%*?&.",
    minLengthFullName: "Le nom complet doit contenir au moins 2 caractères.",
    newPasswordMustBeDifferent: "Le nouveau mot de passe doit être différent de l’ancien mot de passe.",
} as const;

// Login & Signup schemas
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

// Profile schema with optional first and last name
const optionalNamePartSchema = z.preprocess(
    (value) =>
        value === null
            ? ""
            : typeof value === "string"
                ? value.trim()
                : value,
    z.string({ error: "Le nom doit être du texte." }),
);

export const profileSchema = z
    .object({
        lastName: optionalNamePartSchema,
        firstName: optionalNamePartSchema,
        email: emailSchema,
    })
    .superRefine(({ firstName, lastName }, context) => {
        const fullName = joinFullName(firstName, lastName);

        if (fullName.length === 1) {
            context.addIssue({
                code: "custom",
                path: [firstName ? "firstName" : "lastName"],
                message: validationMessages.minLengthFullName,
            });
        }
    });

export const passwordUpdateSchema = z
    .object({
        currentPassword: requiredPasswordSchema,
        newPassword: strongPasswordSchema,
    })
    .refine(({ currentPassword, newPassword }) => currentPassword !== newPassword, {
        path: ["newPassword"],
        message: validationMessages.newPasswordMustBeDifferent,
    });
