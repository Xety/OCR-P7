"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import * as z from "zod";
import { ApiRequestError } from "@/lib/api/client";
import {
    mapApiFieldErrors,
    SERVICE_UNAVAILABLE_MESSAGE,
} from "@/lib/api/errors";
import { redirectOnExpiredSession } from "@/lib/auth/session-guard";
import {
    createProject,
    deleteProject,
    PartialProjectUpdateError,
    searchProjectUsers,
    updateProjectWithContributors,
} from "@/lib/projects/service";
import type {
    ProjectContributorInput,
    ProjectCreateState,
    ProjectDeleteState,
    ProjectFieldErrors,
    ProjectUpdateState,
    UserSearchResult,
} from "@/lib/projects/types";
import {
    projectCreateSchema,
    projectDeleteSchema,
    projectUpdateSchema,
    userSearchSchema,
} from "@/lib/projects/validation";

function revalidateProjectLists() {
    revalidatePath("/projects");
    revalidatePath("/dashboard");
}

/**
 *  Récupère la liste des contributeurs à partir des données du formulaire.
 * @param formData Les données du formulaire.
 *
 * @returns La liste des contributeurs ou null si la valeur n’est pas un JSON valide.
 */
function getContributors(formData: FormData): unknown {
    const value = formData.get("contributors");

    if (typeof value !== "string") {
        return [];
    }

    try {
        return JSON.parse(value) as unknown;
    } catch {
        return null;
    }
}

/**
 * Crée un projet avec les données validées du formulaire.
 */
export async function createProjectAction(
    _previousState: ProjectCreateState,
    formData: FormData,
): Promise<ProjectCreateState> {
    const result = projectCreateSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        contributors: getContributors(formData),
    });

    if (!result.success) {
        const { fieldErrors } = z.flattenError(result.error);

        return {
            status: "error",
            errors: {
                name: fieldErrors.name,
                description: fieldErrors.description,
                contributors: fieldErrors.contributors,
            },
        };
    }

    try {
        const { response, projectId } = await createProject({
            name: result.data.name,
            description: result.data.description,
            contributors: result.data.contributors as ProjectContributorInput[],
        });

        revalidatePath("/projects");

        return {
            status: "success",
            message: response.message || "Projet créé avec succès.",
            projectId,
        };
    } catch (error) {
        unstable_rethrow(error);
        await redirectOnExpiredSession(error);

        return getProjectErrorState(error);
    }
}

/**
 * Récupère l’état d’erreur du projet à partir de l’erreur levée.
 *
 * @param error L’erreur levée lors de la mise à jour du projet.
 *
 * @returns L’état d’erreur du projet.
 */
function getProjectErrorState(error: unknown): ProjectUpdateState {
    if (error instanceof PartialProjectUpdateError) {
        return { status: "error", message: error.message };
    }

    if (!(error instanceof ApiRequestError)) {
        return { status: "error", message: SERVICE_UNAVAILABLE_MESSAGE };
    }

    const errors: ProjectFieldErrors = mapApiFieldErrors(error, {
        name: "name",
        description: "description",
        contributors: "contributors",
    });

    return {
        status: "error",
        errors: Object.keys(errors).length > 0 ? errors : undefined,
        message: Object.keys(errors).length === 0 ? error.message : undefined,
    };
}

/**
 * Met à jour un projet avec les données du formulaire.
 *
 * @param _previousState L’état précédent de la mise à jour du projet.
 * @param formData Les données du formulaire.
 *
 * @returns L’état de la mise à jour du projet après l’opération.
 *
 * @throws {ApiRequestError} Si une erreur se produit lors de la requête API.
 * @throws {PartialProjectUpdateError} Si une partie de la mise à jour échoue.
 */
export async function updateProjectAction(
    _previousState: ProjectUpdateState,
    formData: FormData,
): Promise<ProjectUpdateState> {
    const result = projectUpdateSchema.safeParse({
        projectId: formData.get("projectId"),
        name: formData.get("name"),
        description: formData.get("description"),
        contributors: getContributors(formData),
    });

    if (!result.success) {
        const { fieldErrors } = z.flattenError(result.error);

        return {
            status: "error",
            errors: {
                name: fieldErrors.name,
                description: fieldErrors.description,
                contributors: fieldErrors.contributors,
            },
        };
    }

    try {
        const response = await updateProjectWithContributors(
            result.data.projectId,
            {
                name: result.data.name,
                description: result.data.description,
                contributors: result.data
                    .contributors as ProjectContributorInput[],
            },
        );

        revalidatePath("/projects");
        revalidatePath(`/projects/${result.data.projectId}`);

        return {
            status: "success",
            message: response.message || "Projet mis à jour avec succès.",
        };
    } catch (error) {
        unstable_rethrow(error);
        await redirectOnExpiredSession(error);

        if (error instanceof PartialProjectUpdateError) {
            revalidatePath("/projects");
            revalidatePath(`/projects/${result.data.projectId}`);
        }

        return getProjectErrorState(error);
    }
}

/**
 * Valide et supprime un projet à partir.
 *
 * @param _previousState L’état précédent de la mise à jour du projet.
 * @param formData Les données du formulaire.
 *
 * @returns
 */
export async function deleteProjectAction(
    _previousState: ProjectDeleteState,
    formData: FormData,
): Promise<ProjectDeleteState> {
    const result = projectDeleteSchema.safeParse({
        projectId: formData.get("projectId"),
    });

    if (!result.success) {
        return {
            status: "error",
            message: "Le projet ciblé est invalide. Rechargez la page puis réessayez.",
        };
    }

    try {
        await deleteProject(result.data.projectId);
        revalidateProjectLists();
        redirect("/projects");
    } catch (error) {
        unstable_rethrow(error);
        await redirectOnExpiredSession(error);

        if (error instanceof ApiRequestError && error.status === 404) {
            revalidateProjectLists();
            redirect("/projects");
        }

        if (error instanceof ApiRequestError && error.status === 403) {
            return {
                status: "error",
                message: "Vous n’avez pas l’autorisation de supprimer ce projet.",
            };
        }

        return {
            status: "error",
            message:
                error instanceof ApiRequestError
                    ? error.message
                    : SERVICE_UNAVAILABLE_MESSAGE,
        };
    }
}

/**
 * Recherche des utilisateurs pour les ajouter en tant que contributeurs à un projet.
 * @param query La chaîne de recherche pour filtrer les utilisateurs.
 *
 * @returns Un objet contenant la liste des utilisateurs trouvés et un message d'erreur éventuel.
 */
export async function searchProjectUsersAction(
    query: string,
): Promise<UserSearchResult> {
    const result = userSearchSchema.safeParse(query);

    if (!result.success) {
        return { users: [], message: result.error.issues[0]?.message };
    }

    try {
        return { users: await searchProjectUsers(result.data) };
    } catch (error) {
        unstable_rethrow(error);
        await redirectOnExpiredSession(error);

        return {
            users: [],
            message:
                error instanceof ApiRequestError
                    ? error.message
                    : SERVICE_UNAVAILABLE_MESSAGE,
        };
    }
}
