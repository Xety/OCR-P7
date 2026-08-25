import Link from "next/link";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectCreateButton } from "@/components/projects/project-create-button";
import type { ProjectCardData } from "@/lib/projects/types";

type ProjectsContentProps = {
    projects: ProjectCardData[];
    hasLoadingError: boolean;
    ownerId: string;
};

export function ProjectsContent({
    projects,
    hasLoadingError,
    ownerId,
}: ProjectsContentProps) {
    return (
        <section className="mx-auto w-full max-w-300 px-5 py-12 md:px-0 md:py-16">
            <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                    <h1 className="font-manrope text-2xl font-semibold text-neutral-950">
                        Mes projets
                    </h1>
                    <p className="mt-2 text-lg text-neutral-800 sm:text-base">
                        Gérez vos projets
                    </p>
                </div>
                <ProjectCreateButton ownerId={ownerId} />
            </div>

            {hasLoadingError ? (
                <div
                    role="alert"
                    className="mt-10 rounded-lg border border-[#f0c8b6] bg-white p-8 text-center"
                >
                    <h2 className="font-semibold text-neutral-950">
                        Impossible de charger les projets
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">
                        Vérifiez que le backend est disponible, puis réessayez.
                    </p>
                    <Link
                        href="/projects"
                        className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-[#202020] px-5 text-sm text-white outline-none hover:bg-black focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2"
                    >
                        Réessayer
                    </Link>
                </div>
            ) : projects.length > 0 ? (
                <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <div className="mt-10 rounded-lg border border-dashed border-[#d5dae0] bg-white px-6 py-16 text-center">
                    <h2 className="font-semibold text-neutral-950">
                        Aucun projet pour le moment
                    </h2>
                    <p className="mt-2 text-sm text-[#6B7280]">
                        Les projets dont vous êtes propriétaire ou membre apparaîtront ici.
                    </p>
                </div>
            )}
        </section>
    );
}
