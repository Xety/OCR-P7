import type {
    ApiProjectSummary,
    ApiProjectTask,
    ProjectCardData,
} from "@/lib/projects/types";

/**
 * Prépare les données de carte de projet à partir des données du projet et des tâches.
 * @param project Les données du projet.
 * @param tasks Les tâches du projet.
 *
 * @returns Les données de carte de projet préparées.
 */
export function prepareProjectCard(
    project: ApiProjectSummary,
    tasks: ApiProjectTask[],
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
