import type { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { requireUser } from "@/lib/auth/user";
import { getAssignedTasks } from "@/lib/dashboard/data";
import type { DashboardTask } from "@/lib/dashboard/types";

export const metadata: Metadata = {
    title: "Tableau de bord",
};

export default async function DashboardPage() {
    const user = await requireUser();
    let tasks: DashboardTask[] = [];
    let hasLoadingError = false;

    try {
        tasks = await getAssignedTasks();
    } catch {
        hasLoadingError = true;
    }

    return (
        <DashboardContent
            userName={user.name}
            userId={user.id}
            tasks={tasks}
            hasLoadingError={hasLoadingError}
        />
    );
}
