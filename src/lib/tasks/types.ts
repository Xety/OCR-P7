import type {
    ApiProjectTask,
    ProjectTaskPriority,
    ProjectTaskStatus,
} from "@/lib/projects/types";

export type CreateTaskInput = {
    title: string;
    description: string;
    dueDate: string;
    assigneeIds: string[];
    priority: ProjectTaskPriority;
};

export type UpdateTaskInput = CreateTaskInput & {
    status: ProjectTaskStatus;
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

export type TaskUpdateFieldErrors = TaskCreateFieldErrors & {
    status?: string[];
};

export type TaskUpdateState = {
    status?: "success" | "error";
    errors?: TaskUpdateFieldErrors;
    message?: string;
    task?: ApiProjectTask;
};

export type TaskDeleteState = {
    status?: "success" | "error";
    message?: string;
};
