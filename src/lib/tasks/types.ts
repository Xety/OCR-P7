import type {
    ApiProjectTask,
    ProjectTaskPriority,
} from "@/lib/projects/types";

export type CreateTaskInput = {
    title: string;
    description: string;
    dueDate: string;
    assigneeIds: string[];
    priority: ProjectTaskPriority;
};

export type TaskCreateFieldErrors = {
    title?: string[];
    description?: string[];
    dueDate?: string[];
    assigneeIds?: string[];
    priority?: string[];
};

export type TaskCreateState = {
    status?: "success" | "error";
    errors?: TaskCreateFieldErrors;
    message?: string;
    task?: ApiProjectTask;
};
