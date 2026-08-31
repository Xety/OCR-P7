import "server-only";

import { apiRequest } from "@/lib/api/client";
import { requireSessionToken } from "@/lib/auth/session-guard";
import type { ApiProjectTask } from "@/lib/projects/types";
import type { CreateTaskInput, UpdateTaskInput } from "@/lib/tasks/types";

type TaskCreateData = {
    task: ApiProjectTask;
};

/** Crée une tâche en utilisant l’API existante du projet. */
export async function createProjectTask(
    projectId: string,
    input: CreateTaskInput,
) {
    const token = await requireSessionToken();
    const response = await apiRequest<TaskCreateData>(
        `/projects/${encodeURIComponent(projectId)}/tasks`,
        {
            method: "POST",
            token,
            body: JSON.stringify({
                title: input.title,
                description: input.description,
                dueDate: input.dueDate,
                assigneeIds: input.assigneeIds,
                priority: input.priority,
            }),
        },
    );
    const task = response.data?.task;

    if (!task) {
        throw new Error("La réponse du serveur ne contient pas la tâche créée.");
    }

    return { response, task };
}

/** Met à jour une tâche en utilisant l’API existante du projet. */
export async function updateProjectTask(
    projectId: string,
    taskId: string,
    input: UpdateTaskInput,
) {
    const token = await requireSessionToken();
    const response = await apiRequest<TaskCreateData>(
        `/projects/${encodeURIComponent(projectId)}/tasks/${encodeURIComponent(taskId)}`,
        {
            method: "PUT",
            token,
            body: JSON.stringify({
                title: input.title,
                description: input.description,
                dueDate: input.dueDate,
                assigneeIds: input.assigneeIds,
                priority: input.priority,
                status: input.status,
            }),
        },
    );
    const task = response.data?.task;

    if (!task) {
        throw new Error("La réponse du serveur ne contient pas la tâche mise à jour.");
    }

    return { response, task };
}

/** Supprime définitivement une tâche du projet. */
export async function deleteProjectTask(projectId: string, taskId: string) {
    const token = await requireSessionToken();

    return apiRequest<Record<string, never>>(
        `/projects/${encodeURIComponent(projectId)}/tasks/${encodeURIComponent(taskId)}`,
        { method: "DELETE", token },
    );
}
