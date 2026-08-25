"use client";

import { useActionState, useEffect, useState } from "react";
import { updateProjectAction } from "@/app/actions/projects";
import { ProjectFormFields } from "@/components/projects/project-form-fields";
import { Modal } from "@/components/ui/modal";
import type { ProjectDetailsData, ProjectUpdateState } from "@/lib/projects/types";

type ProjectEditModalProps = {
    open: boolean;
    onClose: () => void;
    project: ProjectDetailsData;
};

const initialState: ProjectUpdateState = {};
export function ProjectEditModal({
    open,
    onClose,
    project,
}: ProjectEditModalProps) {
    const [contributors, setContributors] = useState(
        project.members.map((member) => member.user),
    );
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description ?? "");
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
                <ProjectFormFields
                    idPrefix="project-edit"
                    name={name}
                    description={description}
                    contributors={contributors}
                    ownerId={project.owner.id}
                    errors={state.errors}
                    onNameChange={setName}
                    onDescriptionChange={setDescription}
                    onContributorsChange={setContributors}
                />

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
                        disabled={
                            isPending ||
                            name.trim().length < 2 ||
                            description.trim().length < 1
                        }
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
