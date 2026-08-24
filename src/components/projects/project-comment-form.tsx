"use client";

import { useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { createTaskCommentAction } from "@/app/actions/comments";
import type { ApiUser } from "@/lib/api/types";
import type { CommentCreateState } from "@/lib/comments/types";
import { getUserInitials } from "@/lib/user";

type ProjectCommentFormProps = {
    projectId: string;
    taskId: string;
    currentUser: ApiUser;
};

/**
 * Affiche le formulaire d’ajout d’un commentaire pour une tâche.
 */
export function ProjectCommentForm({
    projectId,
    taskId,
    currentUser,
}: ProjectCommentFormProps) {
    const [content, setContent] = useState("");
    const [state, setState] = useState<CommentCreateState>({});
    const fieldId = useId();
    const hintId = `${fieldId}-hint`;
    const errorId = `${fieldId}-error`;
    const userLabel = currentUser.name || currentUser.email;
    const contentError = state.errors?.content?.[0];
    const formError =
        contentError || (state.status === "error" ? state.message : undefined);

    async function submitComment(formData: FormData) {
        setState({});
        const nextState = await createTaskCommentAction(formData);
        setState(nextState);

        if (nextState.status === "success") {
            setContent("");
        }
    }

    return (
        <div className="mt-5 flex items-start gap-4">
            <span
                title={userLabel}
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ffe4d3] text-xs font-medium text-[#8f4a20]"
            >
                {getUserInitials(currentUser.name, currentUser.email)}
            </span>
            <form action={submitComment} className="min-w-0 flex-1">
                <input type="hidden" name="projectId" value={projectId} />
                <input type="hidden" name="taskId" value={taskId} />
                <label htmlFor={fieldId} className="sr-only">
                    Ajouter un commentaire en tant que {userLabel}
                </label>
                <textarea
                    id={fieldId}
                    name="content"
                    value={content}
                    required
                    maxLength={2000}
                    rows={4}
                    placeholder="Ajouter un commentaire…"
                    aria-invalid={contentError ? true : undefined}
                    aria-describedby={`${hintId}${formError ? ` ${errorId}` : ""}`}
                    onChange={(event) => {
                        setContent(event.target.value);

                        if (state.status) {
                            setState({});
                        }
                    }}
                    className="min-h-24 w-full resize-y rounded-xl border border-transparent bg-[#f3f4f6] px-4 py-4 text-sm leading-6 text-neutral-950 outline-none placeholder:text-[#4B5563] focus:border-(--brand) focus:ring-2 focus:ring-[#d3590b33] aria-invalid:border-[#b42318]"
                />
                <span id={hintId} className="sr-only">
                    2 000 caractères maximum.
                </span>

                {formError && (
                    <p
                        id={errorId}
                        role="alert"
                        className="mt-2 text-sm leading-5 text-[#b42318]"
                    >
                        {formError}
                    </p>
                )}
                {state.status === "success" && (
                    <p role="status" className="sr-only">
                        {state.message}
                    </p>
                )}

                <div className="mt-4 flex justify-end">
                    <CommentSubmitButton contentIsEmpty={!content.trim()} />
                </div>
            </form>
        </div>
    );
}

function CommentSubmitButton({ contentIsEmpty }: { contentIsEmpty: boolean }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={contentIsEmpty || pending}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-[#202020] px-8 text-sm font-medium text-white outline-none hover:bg-black hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#e1e4e8] disabled:text-[#6B7280] sm:w-58"
        >
            {pending ? "Envoi…" : "Envoyer"}
        </button>
    );
}
