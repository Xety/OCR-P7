import Link from "next/link";
import { TeamIcon } from "@/components/ui/icons";
import type { ApiUser } from "@/lib/api/types";
import type { ProjectCardData } from "@/lib/projects/types";
import { getUserInitials } from "@/lib/user";

type ProjectCardProps = {
    project: ProjectCardData;
};

export function ProjectCard({ project }: ProjectCardProps) {
    const progressId = `project-progress-${project.id}`;
    const progressDescriptionId = `${progressId}-description`;
    const visibleMembers = project.team.slice(1, 3);
    const hiddenMembersCount = Math.max(
        0,
        project.team.length - visibleMembers.length - 1,
    );
    const taskLabel = project.totalTasks > 1 ? "tâches terminées" : "tâche terminée";

    return (
        <Link
            href={`/projects/${project.id}`}
            aria-label={`Ouvrir le projet ${project.name}`}
            className="group block h-full rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-3"
        >
            <article className="flex min-h-80 h-full flex-col rounded-lg border border-[#E5E7EB] bg-white p-6 transition-[border-color,box-shadow,transform] group-hover:border-(--brand) sm:p-7">
                <div className="min-w-0">
                    <h2 className="font-manrope truncate text-lg font-medium text-neutral-950">
                        {project.name}
                    </h2>
                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#6B7280]">
                        {project.description || "Aucune description"}
                    </p>
                </div>

                <div className="mt-11">
                    <div className="flex items-center justify-between gap-4 text-xs text-[#6B7280]">
                        <label htmlFor={progressId}>Progression</label>
                        <span className="font-medium text-neutral-800">
                            {project.progress}%
                        </span>
                    </div>
                    <progress
                        id={progressId}
                        value={project.progress}
                        max={100}
                        aria-describedby={progressDescriptionId}
                        className="project-progress mt-4"
                    >
                        {project.progress}%
                    </progress>
                    <p
                        id={progressDescriptionId}
                        className="mt-3 text-xs text-[#6B7280]"
                    >
                        {project.completedTasks}/{project.totalTasks} {taskLabel}
                    </p>
                </div>

                <div className="mt-auto pt-10">
                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                        <TeamIcon className="size-4" />
                        <span>Équipe ({project.team.length})</span>
                    </div>
                    <div className="mt-4 flex min-w-0 items-center gap-2">
                        <Avatar user={project.owner} variant="owner" />
                        <span className="shrink-0 rounded-full bg-[#ffe4d3] px-4 py-1.5 text-xs text-[#a34208]">
                            Propriétaire
                        </span>
                        <div className="flex min-w-0 items-center -space-x-1">
                            {visibleMembers.map((member) => (
                                <Avatar key={member.id} user={member} variant="contributor" />
                            ))}
                            {hiddenMembersCount > 0 && (
                                <span
                                    aria-label={`${hiddenMembersCount} membres supplémentaires`}
                                    className="relative flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#dfe3e8] text-[10px] font-medium text-[#596273]"
                                >
                                    +{hiddenMembersCount}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}

function Avatar({
    user,
    variant,
}: {
    user: ApiUser;
    variant: "owner" | "contributor";
}) {
    const label = user.name || user.email;

    return (
        <span
            role="img"
            aria-label={label}
            title={label}
            className={`relative flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-white text-[10px] font-medium ${variant === "owner"
                ? "bg-[#ffe4d3] text-[#8f4a20]"
                : "bg-[#e4e7eb] text-[#596273]"
                }`}
        >
            {getUserInitials(user.name, user.email)}
        </span>
    );
}
