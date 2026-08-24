"use client";

import { useEffect, useRef, useState } from "react";
import { ProjectTaskComments } from "@/components/projects/project-task-comments";
import { CalendarIcon } from "@/components/ui/icons";
import type { ApiUser } from "@/lib/api/types";
import {
    formatProjectDate,
    projectTaskStatusLabels,
} from "@/lib/projects/project-utils";
import type { ApiProjectTask } from "@/lib/projects/types";
import { getUserInitials } from "@/lib/user";

type ProjectTaskCardProps = {
    task: ApiProjectTask;
    currentUser: ApiUser;
    canComment: boolean;
};

const statusStyles = {
    TODO: "bg-[#ffe0e1] text-[#991b1f]",
    IN_PROGRESS: "bg-[#fff0d5] text-[#824600]",
    DONE: "bg-[#e5f9ef] text-[#176b45]",
    CANCELLED: "bg-[#e4e7eb] text-[#4B5563]",
} as const;

export function ProjectTaskCard({
    task,
    currentUser,
    canComment,
}: ProjectTaskCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const menuWrapperRef = useRef<HTMLDivElement>(null);
    const menuTriggerRef = useRef<HTMLButtonElement>(null);
    const menuId = `task-actions-${task.id}`;

    useEffect(() => {
        if (!isMenuOpen) {
            return;
        }

        function closeOnOutsideClick(event: PointerEvent) {
            if (!menuWrapperRef.current?.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }

        function closeOnEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
                menuTriggerRef.current?.focus();
            }
        }

        document.addEventListener("pointerdown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);

        return () => {
            document.removeEventListener("pointerdown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [isMenuOpen]);

    return (
        <>
            <article className="rounded-lg border border-[#d9dee3] bg-white px-5 py-5 sm:px-8">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-manrope text-base font-semibold text-neutral-950 sm:text-lg">
                                {task.title}
                            </h3>
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[task.status]}`}
                            >
                                {projectTaskStatusLabels[task.status]}
                            </span>
                        </div>
                        <p className="mt-2 text-sm leading-5 text-[#4B5563]">
                            {task.description || "Aucune description"}
                        </p>
                    </div>

                    <div ref={menuWrapperRef} className="relative shrink-0">
                        <button
                            ref={menuTriggerRef}
                            type="button"
                            aria-label={`Actions pour la tâche ${task.title}`}
                            aria-expanded={isMenuOpen}
                            aria-controls={menuId}
                            onClick={() => setIsMenuOpen((value) => !value)}
                            className="flex size-11 items-center justify-center rounded-lg border border-[#E5E7EB] text-xl text-[#6B7280] outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-(--brand) hover:cursor-pointer"
                        >
                            <span aria-hidden="true">•••</span>
                        </button>
                        {isMenuOpen && (
                            <div
                                id={menuId}
                                aria-label={`Actions pour ${task.title}`}
                                className="absolute top-[calc(100%+0.5rem)] right-0 z-20 w-44 rounded-lg border border-[#d9dee3] bg-white p-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.14)]"
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsEditModalOpen(true);
                                    }}
                                    className="w-full rounded-md px-3 py-2 text-left text-sm text-neutral-900 outline-none hover:bg-[#fff1e8] focus-visible:ring-2 focus-visible:ring-(--brand) hover:cursor-pointer"
                                >
                                    Modifier
                                </button>
                                <button
                                    type="button"
                                    aria-disabled="true"
                                    onClick={(event) => event.preventDefault()}
                                    className="w-full cursor-not-allowed rounded-md px-3 py-2 text-left text-sm text-[#6B7280] opacity-70"
                                >
                                    Supprimer
                                    <span className="sr-only"> — indisponible pour le moment</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex flex-col items-start gap-4 text-xs text-[#4B5563]">
                    <span className="flex flex-wrap items-center gap-2">
                        <span>Échéance :</span>
                        <CalendarIcon className="size-4" />
                        {task.dueDate ? (
                            <time dateTime={task.dueDate}>
                                {formatProjectDate(task.dueDate)}
                            </time>
                        ) : (
                            <span>{formatProjectDate(task.dueDate)}</span>
                        )}
                    </span>
                    <span className="flex flex-wrap items-center gap-2">
                        <span>Assigné à :</span>
                        {task.assignees.length > 0 ? (
                            task.assignees.map(({ id, user }) => {
                                const label = user.name || user.email;

                                return (
                                    <span
                                        key={id}
                                        title={label}
                                        className="flex items-center gap-2 text-[#4B5563]"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="flex size-6 items-center justify-center rounded-full bg-[#d9dde2] text-[10px] font-medium"
                                        >
                                            {getUserInitials(user.name, user.email)}
                                        </span>
                                        <span className="rounded-full bg-[#e4e7eb] px-3 py-1.5">
                                            {label}
                                        </span>
                                    </span>
                                );
                            })
                        ) : (
                            <span>Personne</span>
                        )}
                    </span>
                </div>

                <ProjectTaskComments
                    projectId={task.projectId}
                    taskId={task.id}
                    comments={task.comments}
                    currentUser={currentUser}
                    canComment={canComment}
                />
            </article>

            {isEditModalOpen && (
                // TODO: Implement Edit Task modal
                <></>
            )}
        </>
    );
}
