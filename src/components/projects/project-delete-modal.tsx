"use client";

import { useActionState } from "react";
import { deleteProjectAction } from "@/app/actions/projects";
import { Modal } from "@/components/ui/modal";
import type {
    ProjectDeleteState,
    ProjectDetailsData,
} from "@/lib/projects/types";

type ProjectDeleteModalProps = {
    open: boolean;
    project: Pick<ProjectDetailsData, "id" | "name">;
    onClose: () => void;
};

const initialState: ProjectDeleteState = {};

/**
 * Demande confirmation avant de supprimer définitivement un projet.
 */
export function ProjectDeleteModal({
    open,
    project,
    onClose,
}: ProjectDeleteModalProps) {
    const [state, formAction, isPending] = useActionState(
        deleteProjectAction,
        initialState,
    );

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Supprimer le projet ?"
            size="sm"
            closeDisabled={isPending}
        >
            <form action={formAction}>
                <input type="hidden" name="projectId" value={project.id} />

                <p className="text-sm leading-6 text-[#4B5563]">
                    <span>Voulez-vous vraiment supprimer le projet</span>
                    <strong className="ml-1 font-semibold text-neutral-950">
                        « {project.name} »
                    </strong>
                    <span className="ml-1">?</span>
                </p>
                <p className="mt-3 text-sm leading-6 text-[#4B5563]">
                    Cette action est irréversible.
                </p>

                {state.message && (
                    <p
                        role="alert"
                        className="mt-5 rounded-md border border-[#f2b8b5] bg-[#fff4f3] px-3 py-2 text-sm leading-5 text-[#8f1d18]"
                    >
                        {state.message}
                    </p>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                    <button
                        data-modal-initial-focus
                        type="button"
                        disabled={isPending}
                        onClick={onClose}
                        className="flex h-11 items-center justify-center rounded-lg border border-[#b9c0c9] bg-white px-6 text-sm text-[#374151] outline-none hover:cursor-pointer hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex h-11 items-center justify-center rounded-lg bg-[#b42318] px-6 text-sm text-white outline-none hover:cursor-pointer hover:bg-[#8f1d18] focus-visible:ring-2 focus-visible:ring-[#b42318] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#e0a9a5]"
                    >
                        {isPending ? "Suppression…" : "Supprimer"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
