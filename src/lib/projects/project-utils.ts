import type {
    ApiProjectSummary,
    ApiProjectTask,
    ApiProjectTaskSummary,
    ProjectCardData,
    ProjectDetailsData,
    ProjectTaskPriority,
    ProjectTaskStatus,
} from "@/lib/projects/types";

export const projectTaskStatusLabels: Record<ProjectTaskStatus, string> = {
    TODO: "À faire",
    IN_PROGRESS: "En cours",
    DONE: "Terminée",
    CANCELLED: "Annulée",
};

const priorityOrder: Record<ProjectTaskPriority, number> = {
    URGENT: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
};

/**
 * Prépare les données de carte de projet à partir des données du projet et des tâches.
 * @param project Les données du projet.
 * @param tasks Les tâches du projet.
 *
 * @returns Les données de carte de projet préparées.
 */
export function prepareProjectCard(
    project: ApiProjectSummary,
    tasks: ApiProjectTaskSummary[],
): ProjectCardData {
    const team = [project.owner];
    const userIds = new Set([project.owner.id]);

    for (const member of project.members) {
        if (!userIds.has(member.user.id)) {
            team.push(member.user);
            userIds.add(member.user.id);
        }
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === "DONE").length;

    return {
        id: project.id,
        name: project.name,
        description: project.description,
        owner: project.owner,
        team,
        completedTasks,
        totalTasks,
        progress:
            totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
    };
}

export function prepareProjectDetails(
    project: ApiProjectSummary,
    tasks: ApiProjectTask[],
): ProjectDetailsData {
    const team: ProjectDetailsData["team"] = [
        { user: project.owner, role: "ADMIN" },
    ];
    const userIds = new Set([project.owner.id]);

    for (const member of project.members) {
        if (!userIds.has(member.user.id)) {
            team.push({ user: member.user, role: member.role });
            userIds.add(member.user.id);
        }
    }

    return {
        id: project.id,
        name: project.name,
        description: project.description,
        owner: project.owner,
        members: project.members,
        team,
        userRole: project.userRole,
        tasks: [...tasks].sort(compareProjectTasks),
    };
}

export function filterProjectTasks(
    tasks: ApiProjectTask[],
    query: string,
    status: ProjectTaskStatus | "ALL",
) {
    const normalizedQuery = normalizeSearchText(query);

    return tasks.filter((task) => {
        const matchesStatus = status === "ALL" || task.status === status;
        const matchesQuery =
            !normalizedQuery ||
            [task.title, task.description ?? ""].some((value) =>
                normalizeSearchText(value).includes(normalizedQuery),
            );

        return matchesStatus && matchesQuery;
    });
}

export function formatProjectDate(date: string | null) {
    if (!date) {
        return "Sans échéance";
    }

    return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    })
        .format(new Date(date))
        .replace(".", "");
}

export function formatProjectCommentDate(date: string) {
    const parsedDate = new Date(date);
    const dateLabel = new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        timeZone: "Europe/Paris",
    }).format(parsedDate);
    const timeLabel = new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Europe/Paris",
    }).format(parsedDate);

    return `${dateLabel}, ${timeLabel}`;
}

/**
 * Compare deux tâches de projet en fonction de leur priorité et de leur date d'échéance.
 * Les tâches sont triées par priorité (URGENT > HIGH > MEDIUM > LOW) et, en cas d'égalité de priorité, par date d'échéance (les tâches sans date d'échéance sont considérées comme ayant une date d'échéance infinie).
 * @param firstTask
 * @param secondTask
 *
 * @returns Un nombre négatif si firstTask doit être triée avant secondTask, un nombre positif si secondTask doit être triée avant firstTask, ou 0 si elles sont considérées comme égales.
 */
function compareProjectTasks(firstTask: ApiProjectTask, secondTask: ApiProjectTask) {
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
}

function normalizeSearchText(value: string) {
    return value
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLocaleLowerCase("fr-FR")
        .trim();
}
