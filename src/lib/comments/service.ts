import "server-only";

import { apiRequest } from "@/lib/api/client";
import { requireSessionToken } from "@/lib/auth/session-guard";
import type { ApiTaskComment } from "@/lib/projects/types";

type CommentData = {
    comment: ApiTaskComment;
};

/**
 * Ajoute un commentaire à une tâche avec la session authentifiée courante.
 * L’API vérifie que l’utilisateur est propriétaire ou contributeur du projet.
 */
export async function createTaskComment(
    projectId: string,
    taskId: string,
    content: string,
) {
    const token = await requireSessionToken();

    return apiRequest<CommentData>(
        `/projects/${encodeURIComponent(projectId)}/tasks/${encodeURIComponent(taskId)}/comments`,
        {
            method: "POST",
            token,
            body: JSON.stringify({ content }),
        },
    );
}
