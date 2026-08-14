import "server-only";

import { apiRequest } from "@/lib/api/client";
import {
    redirectOnExpiredSession,
    requireSessionToken,
} from "@/lib/auth/session-guard";
import { prepareDashboardTasks } from "@/lib/dashboard/task-utils";
import type { DashboardTask } from "@/lib/dashboard/types";

type AssignedTasksData = {
    tasks: DashboardTask[];
};

export async function getAssignedTasks() {
    const token = await requireSessionToken();

    try {
        const response = await apiRequest<AssignedTasksData>(
            "/dashboard/assigned-tasks",
            { token },
        );

        return prepareDashboardTasks(response.data?.tasks ?? []);
    } catch (error) {
        await redirectOnExpiredSession(error);

        throw error;
    }
}
