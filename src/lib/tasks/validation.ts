import * as z from "zod";

const taskDueDateSchema = z
    .string()
    .trim()
    .min(1, "La date d’échéance est requise.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La date d’échéance est invalide.")
    .refine((value) => {
        const [year, month, day] = value.split("-").map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));

        return (
            date.getUTCFullYear() === year &&
            date.getUTCMonth() === month - 1 &&
            date.getUTCDate() === day
        );
    }, "La date d’échéance est invalide.");

const taskFormSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2, "Le titre doit contenir au moins 2 caractères.")
        .max(200, "Le titre ne peut pas dépasser 200 caractères."),
    description: z
        .string()
        .trim()
        .min(1, "La description est requise.")
        .max(1000, "La description ne peut pas dépasser 1 000 caractères."),
    dueDate: taskDueDateSchema,
    assigneeIds: z.array(z.string().trim().min(1)),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"], {
        error: "La priorité sélectionnée est invalide.",
    }),
});

const projectIdSchema = z
    .string()
    .trim()
    .min(1, "L’identifiant du projet est requis.");

export const taskCreateSchema = taskFormSchema.extend({
    projectId: projectIdSchema,
});

export const taskUpdateSchema = taskFormSchema.extend({
    projectId: projectIdSchema,
    taskId: z.string().trim().min(1, "L’identifiant de la tâche est requis."),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELLED"], {
        error: "Le statut sélectionné est invalide.",
    }),
});

export const taskDeleteSchema = z.object({
    projectId: projectIdSchema,
    taskId: z.string().trim().min(1, "L’identifiant de la tâche est requis."),
});
