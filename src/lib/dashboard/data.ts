import { redirect } from "next/navigation";
import { apiRequest, ApiRequestError } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";
import { prepareDashboardTasks } from "@/lib/dashboard/task-utils";
import type { DashboardTask } from "@/lib/dashboard/types";

type AssignedTasksData = {
    tasks: DashboardTask[];
};

export async function getAssignedTasks() {
    const token = await getSessionToken();

    if (!token) {
        redirect("/login");
    }

    try {
        const response = await apiRequest<AssignedTasksData>(
            "/dashboard/assigned-tasks",
            { token },
        );

        return prepareDashboardTasks(response.data?.tasks ?? []);
    } catch (error) {
        if (error instanceof ApiRequestError && error.status === 401) {
            redirect("/login");
        }

        throw error;
    }
}
