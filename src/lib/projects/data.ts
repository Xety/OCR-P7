import "server-only";

import { apiRequest } from "@/lib/api/client";
import { requireSessionToken } from "@/lib/auth/session-guard";
import { prepareProjectCard } from "@/lib/projects/project-utils";
import type {
    ApiProjectDetail,
    ApiProjectSummary,
    ProjectCardData,
} from "@/lib/projects/types";

type ProjectsData = {
    projects: ApiProjectSummary[];
};

type ProjectDetailData = {
    project: ApiProjectDetail;
};

/**
 * Récupère la liste des projets de l'utilisateur connecté.
 *
 * @returns Une promise qui se résout avec un tableau de données de carte de projet.
 */
export async function getProjects(): Promise<ProjectCardData[]> {
    const token = await requireSessionToken();
    const response = await apiRequest<ProjectsData>("/projects", { token });
    const projects = response.data?.projects;

    if (!projects) {
        throw new Error("La réponse du serveur ne contient pas les projets attendus.");
    }

    // Prépare les données de carte de projet pour chaque projet, en récupérant les détails si nécessaire.
    return Promise.all(
        projects.map(async (project) => {
            if (project._count.tasks === 0) {
                return prepareProjectCard(project, []);
            }

            const detailResponse = await apiRequest<ProjectDetailData>(
                `/projects/${project.id}`,
                { token },
            );
            const detail = detailResponse.data?.project;

            if (!detail) {
                throw new Error(
                    `La réponse du serveur ne contient pas le projet ${project.id}.`,
                );
            }

            return prepareProjectCard(project, detail.tasks ?? []);
        }),
    );
}
