import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect, unstable_rethrow } from "next/navigation";
import { ProjectDetailsContent } from "@/components/projects/project-details-content";
import { ApiRequestError } from "@/lib/api/client";
import type { ApiUser } from "@/lib/api/types";
import { requireUser } from "@/lib/auth/user";
import { getProjectDetails } from "@/lib/projects/data";
import type { ProjectDetailsData } from "@/lib/projects/types";

export const metadata: Metadata = {
    title: "Projet",
};

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    let project: ProjectDetailsData | undefined;
    let currentUser: ApiUser | undefined;

    try {
        [project, currentUser] = await Promise.all([
            getProjectDetails(id),
            requireUser(),
        ]);
    } catch (error) {
        unstable_rethrow(error);

        if (error instanceof ApiRequestError) {
            if (error.status === 401) {
                redirect("/login");
            }

            if (error.status === 403 || error.status === 404) {
                notFound();
            }
        }

    }

    if (project && currentUser) {
        return (
            <ProjectDetailsContent
                project={project}
                currentUser={currentUser}
            />
        );
    }

    return (
        <section className="mx-auto w-full max-w-300 px-5 py-12 md:px-0 md:py-16">
            <div
                role="alert"
                className="rounded-lg border border-[#f0c8b6] bg-white p-8 text-center"
            >
                <h1 className="font-manrope text-xl font-semibold text-neutral-950">
                    Impossible de charger le projet
                </h1>
                <p className="mt-2 text-sm text-[#4B5563]">
                    Vérifiez que le backend est disponible, puis réessayez.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <a
                        href={`/projects/${encodeURIComponent(id)}`}
                        className="flex h-11 items-center justify-center rounded-lg bg-[#202020] px-5 text-sm text-white outline-none hover:bg-black focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2"
                    >
                        Réessayer
                    </a>
                    <Link
                        href="/projects"
                        className="flex h-11 items-center justify-center rounded-lg border border-[#b9c0c9] bg-white px-5 text-sm text-[#374151] outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2"
                    >
                        Retour aux projets
                    </Link>
                </div>
            </div>
        </section>
    );
}
