import * as z from "zod";

const resourceIdSchema = z
    .string()
    .trim()
    .min(1, "L’identifiant est requis.")
    .max(100, "L’identifiant est invalide.")
    .regex(/^[A-Za-z0-9_-]+$/, "L’identifiant est invalide.");

export const commentCreateSchema = z.object({
    projectId: resourceIdSchema,
    taskId: resourceIdSchema,
    content: z
        .string()
        .trim()
        .min(1, "Le commentaire ne peut pas être vide.")
        .max(2000, "Le commentaire ne peut pas dépasser 2 000 caractères."),
});
