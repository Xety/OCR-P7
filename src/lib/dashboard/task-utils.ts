import type {
    DashboardTask,
    TaskPriority,
    TaskStatus,
} from "@/lib/dashboard/types";

export const visibleTaskStatuses = ["TODO", "IN_PROGRESS", "DONE"] as const;
export type VisibleTaskStatus = (typeof visibleTaskStatuses)[number];

export const statusLabels: Record<VisibleTaskStatus, string> = {
    TODO: "À faire",
    IN_PROGRESS: "En cours",
    DONE: "Terminée",
};

const priorityOrder: Record<TaskPriority, number> = {
    URGENT: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
};

export function prepareDashboardTasks(tasks: DashboardTask[]) {
  return tasks
    .filter(
      (task): task is DashboardTask & { status: VisibleTaskStatus } =>
        visibleTaskStatuses.includes(task.status as VisibleTaskStatus),
    )
    .map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      projectId: task.projectId,
      project: {
        id: task.project.id,
        name: task.project.name,
      },
      comments: task.comments.map((comment) => ({ id: comment.id })),
    }))
    .sort((firstTask, secondTask) => {
            const priorityDifference =
                priorityOrder[firstTask.priority] - priorityOrder[secondTask.priority];

            if (priorityDifference !== 0) {
                return priorityDifference;
            }

            const firstDueDate = firstTask.dueDate
                ? new Date(firstTask.dueDate).getTime()
                : Number.POSITIVE_INFINITY;
            const secondDueDate = secondTask.dueDate
                ? new Date(secondTask.dueDate).getTime()
                : Number.POSITIVE_INFINITY;

            return firstDueDate - secondDueDate;
        });
}

export function formatDueDate(dueDate: string | null) {
    if (!dueDate) {
        return "Sans échéance";
    }

    return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
    })
        .format(new Date(dueDate))
        .replace(".", "");
}

export function filterDashboardTasks(tasks: DashboardTask[], query: string) {
    const normalizedQuery = normalizeSearchText(query);

    if (!normalizedQuery) {
        return tasks;
    }

    return tasks.filter((task) =>
        [task.title, task.description ?? "", task.project.name].some((value) =>
            normalizeSearchText(value).includes(normalizedQuery),
        ),
    );
}

function normalizeSearchText(value: string) {
    return value
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLocaleLowerCase("fr-FR")
        .trim();
}

export function isVisibleTaskStatus(
    status: TaskStatus,
): status is VisibleTaskStatus {
    return visibleTaskStatuses.includes(status as VisibleTaskStatus);
}
