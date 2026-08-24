"use client";

import { useActionState, useEffect, useState } from "react";
import { updateProjectAction } from "@/app/actions/projects";
import { ContributorSelect } from "@/components/projects/contributor-select";
import { Modal } from "@/components/ui/modal";
import type { ProjectDetailsData, ProjectUpdateState } from "@/lib/projects/types";

type ProjectEditModalProps = {
    open: boolean;
    onClose: () => void;
    project: ProjectDetailsData;
};

const initialState: ProjectUpdateState = {};
const inputClassName =
    "mt-2 w-full rounded-md border border-[#cbd1d8] bg-white px-4 text-sm text-neutral-950 outline-none focus:border-(--brand) focus:ring-2 focus:ring-[#d3590b33] aria-invalid:border-[#b42318]";

export function ProjectEditModal({
    open,
    onClose,
    project,
}: ProjectEditModalProps) {
    const [contributors, setContributors] = useState(
        project.members.map((member) => member.user),
    );
    const [state, formAction, isPending] = useActionState(
        updateProjectAction,
        initialState,
    );

    useEffect(() => {
        if (state.status === "success") {
            onClose();
        }
    }, [onClose, state.status]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Modifier un projet"
            size="md"
            closeDisabled={isPending}
        >
            <form action={formAction} className="space-y-5">
                <input type="hidden" name="projectId" value={project.id} />
                <input
                    type="hidden"
                    name="contributors"
                    value={JSON.stringify(
                        contributors.map(({ id, email, name }) => ({
                            id,
                            email,
                            name,
                        })),
                    )}
                />

                <div>
                    <label htmlFor="project-name" className="text-sm font-medium text-neutral-900">
                        Titre<span aria-hidden="true">*</span>
                    </label>
                    <input
                        id="project-name"
                        name="name"
                        type="text"
                        required
                        minLength={2}
                        maxLength={100}
                        defaultValue={project.name}
                        data-modal-initial-focus
                        aria-invalid={state.errors?.name ? true : undefined}
                        aria-describedby={state.errors?.name ? "project-name-error" : undefined}
                        className={`${inputClassName} h-12`}
                    />
                    <FieldError id="project-name-error" errors={state.errors?.name} />
                </div>

                <div>
                    <label
                        htmlFor="project-description"
                        className="text-sm font-medium text-neutral-900"
                    >
                        Description<span aria-hidden="true">*</span>
                    </label>
                    <textarea
                        id="project-description"
                        name="description"
                        required
                        maxLength={500}
                        defaultValue={project.description ?? ""}
                        aria-invalid={state.errors?.description ? true : undefined}
                        aria-describedby={
                            state.errors?.description
                                ? "project-description-error"
                                : undefined
                        }
                        className={`${inputClassName} min-h-28 resize-y py-3`}
                    />
                    <FieldError
                        id="project-description-error"
                        errors={state.errors?.description}
                    />
                </div>

                <div>
                    <ContributorSelect
                        selected={contributors}
                        ownerId={project.owner.id}
                        onChange={setContributors}
                        errorId={
                            state.errors?.contributors
                                ? "project-contributors-error"
                                : undefined
                        }
                    />
                    <FieldError
                        id="project-contributors-error"
                        errors={state.errors?.contributors}
                    />
                </div>

                {state.message && state.status !== "success" && (
                    <p
                        role="alert"
                        className="rounded-md border border-[#f2b8b5] bg-[#fff4f3] px-3 py-2 text-sm leading-5 text-[#8f1d18]"
                    >
                        {state.message}
                    </p>
                )}

                <div className="flex flex-wrap gap-3 pt-3">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex h-11 items-center justify-center rounded-lg bg-[#202020] px-7 text-sm text-white outline-none hover:bg-black hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#d9dde2] disabled:text-[#4B5563]"
                    >
                        {isPending ? "Enregistrement…" : "Enregistrer"}
                    </button>
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={onClose}
                        className="flex h-11 items-center justify-center rounded-lg border border-[#b9c0c9] bg-white px-7 text-sm text-[#374151] outline-none hover:bg-neutral-50 hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </Modal>
    );
}

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
    if (!errors?.length) {
        return null;
    }

    return (
        <p id={id} className="mt-1 text-sm leading-5 text-[#b42318]">
            {errors[0]}
        </p>
    );
}
