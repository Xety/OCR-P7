"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProjectAiTasksModal } from "@/components/projects/project-ai-tasks-modal";
import { ProjectCreateTaskModal } from "@/components/projects/project-create-task-modal";
import { ProjectEditModal } from "@/components/projects/project-edit-modal";
import { ProjectTaskCard } from "@/components/projects/project-task-card";
import { SearchIcon, TeamIcon } from "@/components/ui/icons";
import type { ApiUser } from "@/lib/api/types";
import {
    hasProjectPermission,
    resolveProjectRole,
} from "@/lib/permissions";
import {
    filterProjectTasks,
    projectTaskStatusLabels,
} from "@/lib/projects/project-utils";
import type {
    ProjectDetailsData,
    ProjectTaskStatus,
} from "@/lib/projects/types";
import { getUserInitials } from "@/lib/user";

type ProjectDetailsContentProps = {
    project: ProjectDetailsData;
    currentUser: ApiUser;
};

type ActiveModal = "edit-project" | "create-task" | "ai" | null;

const statusOptions: Array<{
    value: ProjectTaskStatus | "ALL";
    label: string;
}> = [
        { value: "ALL", label: "Tous les statuts" },
        ...Object.entries(projectTaskStatusLabels).map(([value, label]) => ({
            value: value as ProjectTaskStatus,
            label,
        })),
    ];

export function ProjectDetailsContent({
    project,
    currentUser,
}: ProjectDetailsContentProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [status, setStatus] = useState<ProjectTaskStatus | "ALL">("ALL");
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);
    const filteredTasks = useMemo(
        () => filterProjectTasks(project.tasks, searchQuery, status),
        [project.tasks, searchQuery, status],
    );
    const canComment =
        project.owner.id === currentUser.id ||
        project.members.some((member) => member.user.id === currentUser.id);
    const projectRole = resolveProjectRole(
        { ownerId: project.owner.id, userRole: project.userRole },
        currentUser.id,
    );
    const canCreateTasks = hasProjectPermission(projectRole, "createTasks");

    return (
        <section className="mx-auto w-full max-w-300 px-5 py-10 md:px-0 md:py-14">
            <div className="flex flex-wrap items-start justify-between gap-7">
                <div className="flex min-w-0 items-start gap-4">
                    <Link
                        href="/projects"
                        aria-label="Retour à la liste des projets"
                        className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-[#d9dee3] bg-white text-xl text-[#374151] outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-(--brand)"
                    >
                        <span aria-hidden="true">←</span>
                    </Link>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <h1 className="font-manrope text-2xl font-semibold text-neutral-950">
                                {project.name}
                            </h1>
                            {project.userRole === "ADMIN" && (
                                <button
                                    type="button"
                                    onClick={() => setActiveModal("edit-project")}
                                    className="rounded-sm text-xs font-medium text-(--brand-text) underline underline-offset-4 outline-none hover:no-underline hover:cursor-pointer"
                                >
                                    Modifier
                                </button>
                            )}
                        </div>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#4B5563] sm:text-base">
                            {project.description || "Aucune description"}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {canCreateTasks && (
                        <button
                            type="button"
                            aria-haspopup="dialog"
                            onClick={() => setActiveModal("create-task")}
                            className="flex h-11 items-center justify-center rounded-lg bg-[#202020] px-5 text-sm text-white outline-none hover:bg-black hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2"
                        >
                            Créer une tâche
                        </button>
                    )}
                    <button
                        type="button"
                        aria-haspopup="dialog"
                        onClick={() => setActiveModal("ai")}
                        className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#c94f00] px-5 text-sm font-medium text-white outline-none hover:bg-[#a94300] hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2"
                    >
                        <span aria-hidden="true">✦</span>
                        IA
                    </button>
                </div>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-4 rounded-lg bg-[#f1f2f4] px-5 py-4 sm:px-7">
                <div className="flex items-center gap-2 text-sm font-medium text-neutral-900">
                    <TeamIcon className="size-4" />
                    <span>Contributeurs</span>
                    <span className="font-normal text-[#4B5563]">
                        {project.team.length} {project.team.length > 1 ? "personnes" : "personne"}
                    </span>
                </div>
                <ul className="flex flex-wrap items-center gap-2">
                    {project.team.map(({ user, role }) => {
                        const label = user.name || user.email;

                        return (
                            <li key={user.id} className="flex items-center gap-2">
                                <span
                                    title={label}
                                    aria-hidden="true"
                                    className={`flex size-7 items-center justify-center rounded-full text-[10px] font-medium ${role === "ADMIN"
                                        ? "bg-[#ffe4d3] text-[#8f4a20]"
                                        : "bg-[#dfe3e8] text-[#4B5563]"
                                        }`}
                                >
                                    {getUserInitials(user.name, user.email)}
                                </span>
                                <span
                                    className={`rounded-full px-3 py-1.5 text-xs ${role === "ADMIN"
                                        ? "bg-[#ffe4d3] text-[#a34208]"
                                        : "bg-[#e2e5e9] text-[#4B5563]"
                                        }`}
                                >
                                    {role === "ADMIN" ? (
                                        <>
                                            <span className="sr-only">{label} · </span>
                                            Propriétaire
                                        </>
                                    ) : (
                                        label
                                    )}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="mt-7 rounded-lg border border-[#d9dee3] bg-white p-5 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-start justify-between gap-7">
                    <div>
                        <h2 className="font-manrope text-lg font-semibold text-neutral-950">
                            Tâches
                        </h2>
                        <p className="mt-1 text-sm text-[#4B5563]">Par ordre de priorité</p>
                    </div>
                    <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
                        <span className="flex h-11 items-center gap-3 rounded-lg bg-[#FFE8D9] px-4 text-sm font-medium text-[#D3590B]">
                            <span
                                aria-hidden="true"
                                className="block h-4 w-4 bg-[#d3590b] mask-[url('/icons/check.svg')] mask-center mask-no-repeat mask-contain"
                            />
                            Liste
                        </span>
                        <button
                            type="button"
                            disabled
                            aria-label="Vue Calendrier, indisponible pour le moment"
                            className="flex h-11 cursor-not-allowed items-center gap-3 rounded-lg px-4 text-sm font-medium text-[#D3590B]"
                        >
                            <span
                                aria-hidden="true"
                                className="block h-4.25 w-3.75 bg-[#d3590b] mask-[url('/icons/date.svg')] mask-center mask-no-repeat mask-contain"
                            />
                            Calendrier
                        </button>
                        <label htmlFor="project-task-status" className="sr-only">
                            Filtrer par statut
                        </label>
                        <select
                            id="project-task-status"
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value as ProjectTaskStatus | "ALL")
                            }
                            className="h-15 min-w-44 rounded-lg border border-[#E5E7EB] bg-white px-6 text-sm text-[#6B7280] outline-none focus:border-(--brand) focus:ring-2 focus:ring-[#d3590b33] hover:cursor-pointer"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label className="relative block min-w-0 flex-1 sm:min-w-64">
                            <label htmlFor="project-task-search" className="sr-only">
                                Rechercher une tâche
                            </label>
                            <input
                                id="project-task-search"
                                type="search"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Rechercher une tâche"
                                className="h-15 w-full rounded-lg border border-[#E5E7EB] bg-white pr-11 pl-4 text-sm text-neutral-950 outline-none placeholder:text-[#6B7280] focus:border-(--brand) focus:ring-2 focus:ring-[#d3590b33]"
                            />
                            <SearchIcon className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#4B5563]" />
                        </label>
                    </div>
                </div>

                {filteredTasks.length > 0 ? (
                    <div className="mt-8 flex flex-col gap-4">
                        {filteredTasks.map((task) => (
                            <ProjectTaskCard
                                key={task.id}
                                task={task}
                                currentUser={currentUser}
                                canComment={canComment}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="mt-8 rounded-lg border border-dashed border-[#cbd1d8] px-5 py-12 text-center text-sm text-[#4B5563]">
                        {project.tasks.length > 0
                            ? "Aucune tâche ne correspond à vos filtres."
                            : "Ce projet ne contient aucune tâche pour le moment."}
                    </p>
                )}
            </div>

            {activeModal === "edit-project" && (
                <ProjectEditModal
                    open
                    project={project}
                    onClose={() => setActiveModal(null)}
                />
            )}
            {canCreateTasks && activeModal === "create-task" && (
                <ProjectCreateTaskModal
                    open
                    projectId={project.id}
                    ownerId={project.owner.id}
                    team={project.team}
                    onClose={() => setActiveModal(null)}
                />
            )}
            {activeModal === "ai" && (
                <ProjectAiTasksModal
                    open
                    tasks={project.tasks}
                    onClose={() => setActiveModal(null)}
                />
            )}
        </section>
    );
}
