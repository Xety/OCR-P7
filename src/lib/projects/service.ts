import "server-only";

import { apiRequest, ApiRequestError } from "@/lib/api/client";
import type { ApiUser } from "@/lib/api/types";
import { requireSessionToken } from "@/lib/auth/session-guard";
import { requireUser } from "@/lib/auth/user";
import type {
    ApiProjectDetail,
    ProjectContributorInput,
} from "@/lib/projects/types";

type ProjectDetailData = {
    project: ApiProjectDetail;
};

type UsersData = {
    users: ApiUser[];
};

type ProjectCreateData = {
    project: {
        id: string;
    };
};

export type CreateProjectInput = {
    name: string;
    description: string;
    contributors: ProjectContributorInput[];
};

export type UpdateProjectInput = {
    name: string;
    description: string;
    contributors: ProjectContributorInput[];
};

export class PartialProjectUpdateError extends Error {
    constructor() {
        super(
            "Le projet a été mis à jour, mais certains changements de contributeurs n’ont pas pu être appliqués. Rechargez la page avant de réessayer.",
        );
        this.name = "PartialProjectUpdateError";
    }
}

/**
 * Crée un projet dont l’utilisateur authentifié devient propriétaire.
 */
export async function createProject(input: CreateProjectInput) {
    const [token, currentUser] = await Promise.all([
        requireSessionToken(),
        requireUser(),
    ]);
    const contributorEmails = [
        ...new Set(
            input.contributors
                .map((contributor) => contributor.email.trim().toLowerCase())
                .filter((email) => email !== currentUser.email.toLowerCase()),
        ),
    ];
    const response = await apiRequest<ProjectCreateData>("/projects", {
        method: "POST",
        token,
        body: JSON.stringify({
            name: input.name,
            description: input.description,
            contributors: contributorEmails,
        }),
    });
    const projectId = response.data?.project?.id;

    if (!projectId) {
        throw new Error("La réponse du serveur ne contient pas le projet créé.");
    }

    return { response, projectId };
}

/**
 * Met à jour un projet avec les données du formulaire.
 *
 * @param projectId L’identifiant du projet à mettre à jour.
 * @param input Les données de mise à jour du projet.
 *
 * @returns La réponse de l’API contenant les données du projet mises à jour.
 *
 */
export async function updateProjectWithContributors(
    projectId: string,
    input: UpdateProjectInput,
) {
    const token = await requireSessionToken();
    const encodedProjectId = encodeURIComponent(projectId);
    const currentResponse = await apiRequest<ProjectDetailData>(
        `/projects/${encodedProjectId}`,
        { token },
    );
    const currentProject = currentResponse.data?.project;

    if (!currentProject) {
        throw new Error("La réponse du serveur ne contient pas le projet attendu.");
    }

    const updateResponse = await apiRequest<ProjectDetailData>(
        `/projects/${encodedProjectId}`,
        {
            method: "PUT",
            token,
            body: JSON.stringify({
                name: input.name,
                description: input.description,
            }),
        },
    );

    const desiredContributors = new Map<string, ProjectContributorInput>();

    for (const contributor of input.contributors) {
        if (contributor.id !== currentProject.ownerId) {
            desiredContributors.set(contributor.id, contributor);
        }
    }

    // Create a map of current contributors for easy lookup
    const currentContributors = new Map(
        currentProject.members.map((member) => [member.user.id, member]),
    );
    // Determine which contributors to add and which to remove
    const contributorsToRemove = currentProject.members.filter(
        (member) => !desiredContributors.has(member.user.id),
    );
    const contributorsToAdd = [...desiredContributors.values()].filter(
        (contributor) => !currentContributors.has(contributor.id),
    );
    // Prepare the API requests for adding and removing contributors
    const membershipChanges = [
        ...contributorsToRemove.map((member) =>
            apiRequest<Record<string, never>>(
                `/projects/${encodedProjectId}/contributors/${encodeURIComponent(member.user.id)}`,
                { method: "DELETE", token },
            ),
        ),
        ...contributorsToAdd.map((contributor) =>
            apiRequest<Record<string, never>>(
                `/projects/${encodedProjectId}/contributors`,
                {
                    method: "POST",
                    token,
                    body: JSON.stringify({
                        email: contributor.email,
                        role: "CONTRIBUTOR",
                    }),
                },
            ),
        ),
    ];

    // Execute the membership changes and handle any errors
    if (membershipChanges.length > 0) {
        const results = await Promise.allSettled(membershipChanges);
        const failures = results.filter(
            (result): result is PromiseRejectedResult =>
                result.status === "rejected",
        );

        if (failures.length > 0) {
            const authenticationError = failures.find(
                ({ reason }) =>
                    reason instanceof ApiRequestError && reason.status === 401,
            );

            if (authenticationError) {
                throw authenticationError.reason;
            }

            throw new PartialProjectUpdateError();
        }
    }

    return updateResponse;
}

/**
 * Recherche des utilisateurs pour les ajouter en tant que contributeurs à un projet.
 * @param query La chaîne de recherche pour filtrer les utilisateurs.
 *
 * @returns Un tableau d’utilisateurs correspondant à la recherche.
 */
export async function searchProjectUsers(query: string): Promise<ApiUser[]> {
    const token = await requireSessionToken();
    const response = await apiRequest<UsersData>(
        `/users/search?query=${encodeURIComponent(query)}`,
        { token },
    );

    return response.data?.users ?? [];
}
