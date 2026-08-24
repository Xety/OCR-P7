"use client";

import {
    useEffect,
    useId,
    useRef,
    type MouseEvent,
    type ReactNode,
} from "react";

export type ModalProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg";
    closeDisabled?: boolean;
};

const sizeStyles = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
} as const;

/**
 * Affiche une fenêtre modale générique et accessible basée sur l’élément
 * natif `<dialog>`. Le composant gère le focus initial, sa restauration à la
 * fermeture, la touche Échap, le clic sur l’arrière-plan et le verrouillage
 * du défilement de la page.
 */
export function Modal({
    open,
    onClose,
    title,
    children,
    size = "md",
    closeDisabled = false,
}: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);
    const titleId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!open || !dialog) {
            return;
        }

        previousFocusRef.current = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        dialog.showModal();

        window.requestAnimationFrame(() => {
            const initialFocus = dialog.querySelector<HTMLElement>(
                "[data-modal-initial-focus]",
            );
            (initialFocus ?? dialog).focus();
        });

        return () => {
            if (dialog.open) {
                dialog.close();
            }

            document.body.style.overflow = previousOverflow;

            if (previousFocusRef.current?.isConnected) {
                previousFocusRef.current.focus();
            }
        };
    }, [open]);

    function requestClose() {
        if (!closeDisabled) {
            onClose();
        }
    }

    function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
        if (event.target === event.currentTarget) {
            requestClose();
        }
    }

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            onCancel={(event) => {
                event.preventDefault();
                requestClose();
            }}
            onClick={handleBackdropClick}
            className={`app-modal fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-xl border-0 bg-white p-0 text-neutral-950 shadow-[0_24px_80px_rgba(15,23,42,0.24)] ${sizeStyles[size]}`}
        >
            <div className="p-6 sm:p-10">
                <div className="flex items-start justify-between gap-6">
                    <h2 id={titleId} className="font-manrope text-xl font-semibold">
                        {title}
                    </h2>
                    <button
                        type="button"
                        aria-label="Fermer la fenêtre"
                        disabled={closeDisabled}
                        onClick={requestClose}
                        className="flex size-10 shrink-0 items-center justify-center rounded-md text-2xl leading-none text-[#4B5563] outline-none hover:bg-neutral-100 hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-(--brand) disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="mt-8">{children}</div>
            </div>
        </dialog>
    );
}
