import Image from "next/image";
import { ProjectCommentForm } from "@/components/projects/project-comment-form";
import type { ApiUser } from "@/lib/api/types";
import { formatProjectCommentDate } from "@/lib/projects/project-utils";
import type { ApiTaskComment } from "@/lib/projects/types";
import { getUserInitials } from "@/lib/user";

type ProjectTaskCommentsProps = {
    projectId: string;
    taskId: string;
    comments: ApiTaskComment[];
    currentUser: ApiUser;
    canComment: boolean;
};

/**
 * Affiche les commentaires d’une tâche dans un accordéon natif accessible.
 */
export function ProjectTaskComments({
    projectId,
    taskId,
    comments,
    currentUser,
    canComment,
}: ProjectTaskCommentsProps) {
    return (
        <details className="group mt-6 border-t border-[#e5e7eb] pt-1">
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-md py-4 text-sm text-neutral-900 outline-none focus-visible:ring-2 focus-visible:ring-(--brand)">
                <span>Commentaires ({comments.length})</span>
                <span aria-hidden="true" className="flex size-5 items-center justify-center">
                    <Image
                        src="/icons/arrow_down.svg"
                        alt=""
                        width={17}
                        height={10}
                        className="group-open:hidden"
                    />
                    <Image
                        src="/icons/arrow_up.svg"
                        alt=""
                        width={17}
                        height={10}
                        className="hidden group-open:block"
                    />
                </span>
            </summary>
            <div className="pb-3">
                {comments.length > 0 ? (
                    <ul className="flex flex-col gap-5 pt-2">
                        {comments.map((comment) => {
                            const author = comment.author.name || comment.author.email;

                            return (
                                <li key={comment.id} className="flex items-start gap-4">
                                    <span
                                        aria-hidden="true"
                                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e4e7eb] text-xs font-medium text-[#374151]"
                                    >
                                        {getUserInitials(
                                            comment.author.name,
                                            comment.author.email,
                                        )}
                                    </span>
                                    <div className="min-w-0 flex-1 rounded-xl bg-[#F3F4F6] px-3.5 py-4.5">
                                        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
                                            <span className="font-medium text-neutral-950">
                                                {author}
                                            </span>
                                            <time
                                                dateTime={comment.createdAt}
                                                className="text-xs text-[#4B5563] sm:text-sm"
                                            >
                                                {formatProjectCommentDate(
                                                    comment.createdAt,
                                                )}
                                            </time>
                                        </div>
                                        <p className="mt-5 wrap-break-word text-xs leading-6 text-neutral-900">
                                            {comment.content}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="py-2 text-sm text-[#4B5563]">
                        Aucun commentaire pour cette tâche.
                    </p>
                )}
                {canComment && (
                    <ProjectCommentForm
                        projectId={projectId}
                        taskId={taskId}
                        currentUser={currentUser}
                    />
                )}
            </div>
        </details>
    );
}
