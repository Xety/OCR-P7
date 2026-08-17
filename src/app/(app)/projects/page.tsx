import type { Metadata } from "next";
import { redirect, unstable_rethrow } from "next/navigation";
import { ProjectsContent } from "@/components/projects/projects-content";
import { ApiRequestError } from "@/lib/api/client";
import { getProjects } from "@/lib/projects/data";
import type { ProjectCardData } from "@/lib/projects/types";

export const metadata: Metadata = {
    title: "Mes projets",
};

export default async function ProjectsPage() {
    let projects: ProjectCardData[] = [];
    let hasLoadingError = false;

    try {
        projects = await getProjects();
    } catch (error) {
        unstable_rethrow(error);

        if (error instanceof ApiRequestError && error.status === 401) {
            redirect("/login");
        }

        hasLoadingError = true;
    }

    return (
        <ProjectsContent
            projects={projects}
            hasLoadingError={hasLoadingError}
        />
    );
}
