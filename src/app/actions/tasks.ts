"use server";

import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import * as z from "zod";
import { ApiRequestError } from "@/lib/api/client";
import {
    mapApiFieldErrors,
    SERVICE_UNAVAILABLE_MESSAGE,
} from "@/lib/api/errors";
import { redirectOnExpiredSession } from "@/lib/auth/session-guard";
import {
    createProjectTask,
    deleteProjectTask,
    updateProjectTask,
} from "@/lib/tasks/service";
import type {
    TaskCreateFieldErrors,
    TaskCreateState,
    TaskDeleteState,
    TaskUpdateFieldErrors,
    TaskUpdateState,
} from "@/lib/tasks/types";
import {
    taskCreateSchema,
    taskDeleteSchema,
    taskUpdateSchema,
} from "@/lib/tasks/validation";

function getTaskCreateErrorState(error: unknown): TaskCreateState {
    if (!(error instanceof ApiRequestError)) {
        return { status: "error", message: SERVICE_UNAVAILABLE_MESSAGE };
    }

    const errors: TaskCreateFieldErrors = mapApiFieldErrors(error, {
        title: "title",
        description: "description",
        dueDate: "dueDate",
        assigneeIds: "assigneeIds",
        priority: "priority",
    });

    if (error.status === 400 && error.code === "INVALID_ASSIGNEES") {
        errors.assigneeIds = [
            "Un ou plusieurs utilisateurs sélectionnés ne font plus partie du projet.",
        ];
    }

    if (Object.keys(errors).length > 0) {
        return { status: "error", errors };
    }

    if (error.status === 403) {
        return {
            status: "error",
            message: "Vous n’avez pas l’autorisation de créer une tâche dans ce projet.",
        };
    }

    if (error.status === 404) {
        return {
            status: "error",
            message: "Ce projet n’existe plus ou n’est plus accessible.",
        };
    }

    return { status: "error", message: error.message };
}

/** Valide puis crée une tâche dans le projet courant. */
export async function createProjectTaskAction(
    _previousState: TaskCreateState,
    formData: FormData,
): Promise<TaskCreateState> {
    const result = taskCreateSchema.safeParse({
        projectId: formData.get("projectId"),
        title: formData.get("title"),
        description: formData.get("description"),
        dueDate: formData.get("dueDate"),
        assigneeIds: formData.getAll("assigneeIds"),
        priority: formData.get("priority"),
    });

    if (!result.success) {
        const { fieldErrors } = z.flattenError(result.error);

        return {
            status: "error",
            errors: {
                title: fieldErrors.title,
                description: fieldErrors.description,
                dueDate: fieldErrors.dueDate,
                assigneeIds: fieldErrors.assigneeIds,
                priority: fieldErrors.priority,
            },
            message: fieldErrors.projectId
                ? "Le projet ciblé est invalide. Rechargez la page puis réessayez."
                : undefined,
        };
    }

    try {
        const { response, task } = await createProjectTask(
            result.data.projectId,
            {
                title: result.data.title,
                description: result.data.description,
                dueDate: result.data.dueDate,
                assigneeIds: result.data.assigneeIds,
                priority: result.data.priority,
            },
        );

        revalidatePath(`/projects/${result.data.projectId}`);
        revalidatePath("/projects");
        revalidatePath("/dashboard");

        return {
            status: "success",
            message: response.message || "Tâche créée avec succès.",
            task,
        };
    } catch (error) {
        unstable_rethrow(error);
        await redirectOnExpiredSession(error);

        return getTaskCreateErrorState(error);
    }
}

function getTaskUpdateErrorState(error: unknown): TaskUpdateState {
    if (!(error instanceof ApiRequestError)) {
        return { status: "error", message: SERVICE_UNAVAILABLE_MESSAGE };
    }

    const errors: TaskUpdateFieldErrors = mapApiFieldErrors(error, {
        title: "title",
        description: "description",
        dueDate: "dueDate",
        assigneeIds: "assigneeIds",
        priority: "priority",
        status: "status",
    });

    if (error.status === 400 && error.code === "INVALID_ASSIGNEES") {
        errors.assigneeIds = [
            "Un ou plusieurs utilisateurs sélectionnés ne font plus partie du projet.",
        ];
    }

    if (Object.keys(errors).length > 0) {
        return { status: "error", errors };
    }

    if (error.status === 403) {
        return {
            status: "error",
            message: "Vous n’avez pas l’autorisation de modifier cette tâche.",
        };
    }

    if (error.status === 404) {
        return {
            status: "error",
            message: "Cette tâche n’existe plus ou n’est plus accessible.",
        };
    }

    return { status: "error", message: error.message };
}

/** Valide puis met à jour une tâche du projet courant. */
export async function updateProjectTaskAction(
    _previousState: TaskUpdateState,
    formData: FormData,
): Promise<TaskUpdateState> {
    const result = taskUpdateSchema.safeParse({
        projectId: formData.get("projectId"),
        taskId: formData.get("taskId"),
        title: formData.get("title"),
        description: formData.get("description"),
        dueDate: formData.get("dueDate"),
        assigneeIds: formData.getAll("assigneeIds"),
        priority: formData.get("priority"),
        status: formData.get("status"),
    });

    if (!result.success) {
        const { fieldErrors } = z.flattenError(result.error);

        return {
            status: "error",
            errors: {
                title: fieldErrors.title,
                description: fieldErrors.description,
                dueDate: fieldErrors.dueDate,
                assigneeIds: fieldErrors.assigneeIds,
                priority: fieldErrors.priority,
                status: fieldErrors.status,
            },
            message:
                fieldErrors.projectId || fieldErrors.taskId
                    ? "La tâche ciblée est invalide. Rechargez la page puis réessayez."
                    : undefined,
        };
    }

    try {
        const { response, task } = await updateProjectTask(
            result.data.projectId,
            result.data.taskId,
            {
                title: result.data.title,
                description: result.data.description,
                dueDate: result.data.dueDate,
                assigneeIds: result.data.assigneeIds,
                priority: result.data.priority,
                status: result.data.status,
            },
        );

        revalidatePath(`/projects/${result.data.projectId}`);
        revalidatePath("/projects");
        revalidatePath("/dashboard");

        return {
            status: "success",
            message: response.message || "Tâche mise à jour avec succès.",
            task,
        };
    } catch (error) {
        unstable_rethrow(error);
        await redirectOnExpiredSession(error);

        return getTaskUpdateErrorState(error);
    }
}

function revalidateTaskPages(projectId: string) {
    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/projects");
    revalidatePath("/dashboard");
}

/** Valide puis supprime définitivement une tâche du projet courant. */
export async function deleteProjectTaskAction(
    _previousState: TaskDeleteState,
    formData: FormData,
): Promise<TaskDeleteState> {
    const result = taskDeleteSchema.safeParse({
        projectId: formData.get("projectId"),
        taskId: formData.get("taskId"),
    });

    if (!result.success) {
        return {
            status: "error",
            message: "La tâche ciblée est invalide. Rechargez la page puis réessayez.",
        };
    }

    try {
        const response = await deleteProjectTask(
            result.data.projectId,
            result.data.taskId,
        );

        revalidateTaskPages(result.data.projectId);

        return {
            status: "success",
            message: response.message || "Tâche supprimée avec succès.",
        };
    } catch (error) {
        unstable_rethrow(error);
        await redirectOnExpiredSession(error);

        if (error instanceof ApiRequestError && error.status === 404) {
            revalidateTaskPages(result.data.projectId);

            return {
                status: "success",
                message: "Cette tâche n’existe plus.",
            };
        }

        if (error instanceof ApiRequestError && error.status === 403) {
            return {
                status: "error",
                message: "Vous n’avez pas l’autorisation de supprimer cette tâche.",
            };
        }

        return {
            status: "error",
            message:
                error instanceof ApiRequestError
                    ? error.message
                    : SERVICE_UNAVAILABLE_MESSAGE,
        };
    }
}
