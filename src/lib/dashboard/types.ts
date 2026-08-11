export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type DashboardTask = {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;
    projectId: string;
    project: {
        id: string;
        name: string;
    };
    comments: Array<{
        id: string;
    }>;
};
