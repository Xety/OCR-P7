"use client";

import { useCallback, useState } from "react";
import { ProjectCreateModal } from "@/components/projects/project-create-modal";

type ProjectCreateButtonProps = {
    ownerId: string;
    label?: string;
    className?: string;
};

const defaultClassName =
    "flex h-11 items-center justify-center rounded-lg bg-[#202020] px-6 text-sm text-white outline-none transition-colors hover:cursor-pointer hover:bg-black focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2";

/**
 * Ouvre la modale réutilisable de création d’un projet.
 */
export function ProjectCreateButton({
    ownerId,
    label = "+ Créer un projet",
    className = defaultClassName,
}: ProjectCreateButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const closeModal = useCallback(() => setIsOpen(false), []);

    return (
        <>
            <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => setIsOpen(true)}
                className={className}
            >
                {label}
            </button>
            {isOpen && (
                <ProjectCreateModal
                    open
                    ownerId={ownerId}
                    onClose={closeModal}
                />
            )}
        </>
    );
}
