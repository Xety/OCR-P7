"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createProjectAction } from "@/app/actions/projects";
import { ProjectFormFields } from "@/components/projects/project-form-fields";
import { Modal } from "@/components/ui/modal";
import type { ApiUser } from "@/lib/api/types";
import type { ProjectCreateState } from "@/lib/projects/types";

type ProjectCreateModalProps = {
    open: boolean;
    ownerId: string;
    onClose: () => void;
};

const initialState: ProjectCreateState = {};

/**
 * Affiche le formulaire de création d’un projet et redirige vers le projet
 * nouvellement créé après son enregistrement.
 */
export function ProjectCreateModal({
    open,
    ownerId,
    onClose,
}: ProjectCreateModalProps) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [contributors, setContributors] = useState<ApiUser[]>([]);
    const [state, formAction, isPending] = useActionState(
        createProjectAction,
        initialState,
    );
    const formIsInvalid =
        name.trim().length < 2 ||
        name.trim().length > 100 ||
        description.trim().length < 1 ||
        description.trim().length > 500;

    useEffect(() => {
        if (state.status === "success" && state.projectId) {
            onClose();
            router.push(`/projects/${encodeURIComponent(state.projectId)}`);
        }
    }, [onClose, router, state.projectId, state.status]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Créer un projet"
            size="md"
            closeDisabled={isPending}
        >
            <form action={formAction} className="space-y-5">
                <ProjectFormFields
                    idPrefix="project-create"
                    name={name}
                    description={description}
                    contributors={contributors}
                    ownerId={ownerId}
                    errors={state.errors}
                    contributorEmptyLabel="Choisir un ou plusieurs collaborateurs"
                    onNameChange={setName}
                    onDescriptionChange={setDescription}
                    onContributorsChange={setContributors}
                />

                {state.message && state.status === "error" && (
                    <p
                        role="alert"
                        className="rounded-md border border-[#f2b8b5] bg-[#fff4f3] px-3 py-2 text-sm leading-5 text-[#8f1d18]"
                    >
                        {state.message}
                    </p>
                )}

                <div className="pt-7">
                    <button
                        type="submit"
                        disabled={isPending || formIsInvalid}
                        className="flex h-13 items-center justify-center rounded-xl bg-[#202020] px-7 text-sm text-white outline-none hover:cursor-pointer hover:bg-black focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#e1e4e8] disabled:text-[#6B7280]"
                    >
                        {isPending ? "Création…" : "Ajouter un projet"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
