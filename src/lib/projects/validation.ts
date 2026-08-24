import * as z from "zod";

export const projectContributorSchema = z.object({
    id: z.string().trim().min(1),
    email: z.email("L’adresse email du contributeur est invalide."),
    name: z.string().nullable(),
});

export const projectUpdateSchema = z.object({
    projectId: z.string().trim().min(1, "L’identifiant du projet est requis."),
    name: z
        .string()
        .trim()
        .min(2, "Le titre doit contenir au moins 2 caractères.")
        .max(100, "Le titre ne peut pas dépasser 100 caractères."),
    description: z
        .string()
        .trim()
        .min(1, "La description est requise.")
        .max(500, "La description ne peut pas dépasser 500 caractères."),
    contributors: z.array(projectContributorSchema),
});

export const userSearchSchema = z
    .string()
    .trim()
    .min(2, "Saisissez au moins 2 caractères.")
    .max(100, "La recherche est trop longue.");
