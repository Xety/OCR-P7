import * as z from "zod";
import {
    emailSchema,
    requiredPasswordSchema,
    strongPasswordSchema,
} from "@/lib/auth/validation";
import { joinFullName } from "@/lib/user";

const validationMessages = {
    minLengthFullName: "Le nom complet doit contenir au moins 2 caractères.",
    newPasswordMustBeDifferent:
        "Le nouveau mot de passe doit être différent de l’ancien mot de passe.",
} as const;

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
