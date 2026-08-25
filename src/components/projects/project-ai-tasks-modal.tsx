"use client";

import {
    useEffect,
    useId,
    useRef,
    useState,
    type FormEvent,
} from "react";
import { PencilIcon, TrashIcon } from "@/components/ui/icons";
import { Modal } from "@/components/ui/modal";
import type { ApiProjectTask } from "@/lib/projects/types";

type ProjectAiTasksModalProps = {
    open: boolean;
    tasks: ApiProjectTask[];
    onClose: () => void;
};

type ModalView = "list" | "create";

const composerLabel = "Décrivez les tâches que vous souhaitez ajouter...";

function AiModalTitle({ view }: { view: ModalView }) {
    return (
        <span className="flex items-center gap-2.5">
            <span aria-hidden="true" className="text-xl text-[#ff7a33]">
                ✦
            </span>
            <span>{view === "list" ? "Vos tâches..." : "Créer une tâche"}</span>
        </span>
    );
}

function TaskList({ tasks }: { tasks: ApiProjectTask[] }) {
    return (
        <div className="space-y-5">
            {tasks.length > 0 ? (
                <ul className="space-y-5" aria-label="Tâches actuelles du projet">
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            className="rounded-lg border border-[#dfe3e8] bg-white px-5 py-5 sm:px-8 sm:py-6"
                        >
                            <h3 className="font-manrope wrap-break-word text-base font-semibold text-neutral-950">
                                {task.title || "Tâche sans nom"}
                            </h3>
                            <p className="mt-1 wrap-break-word text-sm leading-5 text-[#6B7280]">
                                {task.description || "Aucune description"}
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-[#8a929f]">
                                <button
                                    type="button"
                                    aria-disabled="true"
                                    title="Fonctionnalité indisponible"
                                    onClick={(event) => event.preventDefault()}
                                    className="flex cursor-not-allowed items-center gap-1.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2"
                                >
                                    <TrashIcon className="size-3.5" />
                                    Supprimer
                                </button>
                                <span aria-hidden="true" className="h-4 w-px bg-[#cbd1d8]" />
                                <button
                                    type="button"
                                    aria-disabled="true"
                                    title="Fonctionnalité indisponible"
                                    onClick={(event) => event.preventDefault()}
                                    className="flex cursor-not-allowed items-center gap-1.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2"
                                >
                                    <PencilIcon className="size-3.5" />
                                    Modifier
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="rounded-lg border border-dashed border-[#cbd1d8] px-5 py-12 text-center text-sm leading-6 text-[#6B7280]">
                    Ce projet ne contient aucune tâche pour le moment.
                </p>
            )}

            <div className="flex justify-center pt-0.5">
                <button
                    type="button"
                    aria-disabled="true"
                    title="Fonctionnalité indisponible"
                    onClick={(event) => event.preventDefault()}
                    className="flex h-11 cursor-not-allowed items-center justify-center rounded-lg bg-[#202020] px-5 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2"
                >
                    + Ajouter les tâches
                </button>
            </div>
        </div>
    );
}

export function ProjectAiTasksModal({
    open,
    tasks,
    onClose,
}: ProjectAiTasksModalProps) {
    const [view, setView] = useState<ModalView>("list");
    const [prompt, setPrompt] = useState("");
    const composerTriggerRef = useRef<HTMLButtonElement>(null);
    const promptInputRef = useRef<HTMLInputElement>(null);
    const restoreComposerFocusRef = useRef(false);
    const promptId = useId();

    useEffect(() => {
        if (!open) {
            return;
        }

        if (view === "create") {
            promptInputRef.current?.focus();
            return;
        }

        if (restoreComposerFocusRef.current) {
            restoreComposerFocusRef.current = false;
            composerTriggerRef.current?.focus();
        }
    }, [open, view]);

    function showCreateView() {
        setView("create");
    }

    function returnToTaskList() {
        restoreComposerFocusRef.current = true;
        setView("list");
    }

    function closeModal() {
        restoreComposerFocusRef.current = false;
        setView("list");
        onClose();
    }

    function preventFakeSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    const footer =
        view === "list" ? (
            <button
                ref={composerTriggerRef}
                type="button"
                data-modal-initial-focus
                onClick={showCreateView}
                className="flex h-14 w-full items-center gap-3 rounded-full bg-[#f7f7f8] px-5 text-left text-[11px] text-[#252525] outline-none transition-colors hover:bg-[#f1f2f4] hover:cursor-text focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2 sm:px-7"
            >
                <span className="min-w-0 flex-1 truncate">{composerLabel}</span>
                <span
                    aria-hidden="true"
                    className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#d3590b] text-xs text-white"
                >
                    ✦
                </span>
            </button>
        ) : (
            <form onSubmit={preventFakeSubmit} className="w-full">
                <label htmlFor={promptId} className="sr-only">
                    {composerLabel}
                </label>
                <div className="flex h-14 w-full items-center gap-3 rounded-full bg-[#f7f7f8] px-5 focus-within:ring-2 focus-within:ring-(--brand) focus-within:ring-offset-2 sm:px-7">
                    <input
                        ref={promptInputRef}
                        id={promptId}
                        type="text"
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        placeholder={composerLabel}
                        className="min-w-0 flex-1 bg-transparent text-[11px] text-[#252525] outline-none placeholder:text-[#252525]"
                    />
                    <button
                        type="submit"
                        aria-disabled="true"
                        aria-label="Créer les tâches avec l’IA, fonctionnalité indisponible"
                        title="Fonctionnalité indisponible"
                        className="flex size-6 shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-[#d3590b] text-xs text-white outline-none focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2"
                    >
                        <span aria-hidden="true">✦</span>
                    </button>
                </div>
            </form>
        );

    return (
        <Modal
            open={open}
            onClose={closeModal}
            title={<AiModalTitle view={view} />}
            size="md"
            footer={footer}
            dialogClassName="h-[min(47.5rem,calc(100dvh-2rem))] max-w-[33rem]! overflow-hidden"
            onCloseButtonClick={view === "create" ? returnToTaskList : closeModal}
            closeButtonLabel={
                view === "create" ? "Retourner à la liste des tâches" : "Fermer la fenêtre"
            }
        >
            {view === "list" ? <TaskList tasks={tasks} /> : null}
        </Modal>
    );
}
