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
import { createTaskComment } from "@/lib/comments/service";
import type {
    CommentCreateFieldErrors,
    CommentCreateState,
} from "@/lib/comments/types";
import { commentCreateSchema } from "@/lib/comments/validation";

function getCommentErrorState(error: unknown): CommentCreateState {
    if (!(error instanceof ApiRequestError)) {
        return { status: "error", message: SERVICE_UNAVAILABLE_MESSAGE };
    }

    const errors: CommentCreateFieldErrors = mapApiFieldErrors(error, {
        content: "content",
    });

    if (Object.keys(errors).length > 0) {
        return { status: "error", errors };
    }

    if (error.status === 403) {
        return {
            status: "error",
            message: "Vous n’avez pas l’autorisation de commenter cette tâche.",
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

/**
 * Valide puis ajoute un commentaire à une tâche du projet courant.
 */
export async function createTaskCommentAction(
    formData: FormData,
): Promise<CommentCreateState> {
    const result = commentCreateSchema.safeParse({
        projectId: formData.get("projectId"),
        taskId: formData.get("taskId"),
        content: formData.get("content"),
    });

    if (!result.success) {
        const { fieldErrors } = z.flattenError(result.error);

        return {
            status: "error",
            errors: { content: fieldErrors.content },
            message:
                fieldErrors.projectId || fieldErrors.taskId
                    ? "La tâche ciblée est invalide. Rechargez la page puis réessayez."
                    : undefined,
        };
    }

    try {
        const response = await createTaskComment(
            result.data.projectId,
            result.data.taskId,
            result.data.content,
        );

        revalidatePath(`/projects/${result.data.projectId}`);

        return {
            status: "success",
            message: response.message || "Commentaire ajouté avec succès.",
        };
    } catch (error) {
        unstable_rethrow(error);
        await redirectOnExpiredSession(error);

        return getCommentErrorState(error);
    }
}
