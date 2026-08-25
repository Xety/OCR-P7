"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { updateProjectTaskAction } from "@/app/actions/tasks";
import { TaskAssigneeSelect } from "@/components/projects/task-assignee-select";
import { Modal } from "@/components/ui/modal";
import type {
    ApiProjectTask,
    ProjectTaskPriority,
    ProjectTaskStatus,
    ProjectTeamMember,
} from "@/lib/projects/types";
import type { TaskUpdateState } from "@/lib/tasks/types";

type ProjectEditTaskModalProps = {
    open: boolean;
    task: ApiProjectTask;
    ownerId: string;
    team: ProjectTeamMember[];
    onClose: () => void;
};

const initialState: TaskUpdateState = {};
const priorityOptions: Array<{
    value: ProjectTaskPriority;
    label: string;
}> = [
    { value: "LOW", label: "Faible" },
    { value: "MEDIUM", label: "Moyenne" },
    { value: "HIGH", label: "Haute" },
    { value: "URGENT", label: "Urgente" },
];
const editableStatusOptions: Array<{
    value: Exclude<ProjectTaskStatus, "CANCELLED">;
    label: string;
    styles: string;
}> = [
    {
        value: "TODO",
        label: "À faire",
        styles: "bg-[#ffe0e1] text-[#991b1f] ring-[#e6a7aa]",
    },
    {
        value: "IN_PROGRESS",
        label: "En cours",
        styles: "bg-[#fff0d5] text-[#824600] ring-[#e9c67e]",
    },
    {
        value: "DONE",
        label: "Terminée",
        styles: "bg-[#e5f9ef] text-[#176b45] ring-[#9ed6bb]",
    },
];

function FieldError({
    id,
    errors,
}: {
    id: string;
    errors?: string[];
}) {
    if (!errors?.length) {
        return null;
    }

    return (
        <p id={id} role="alert" className="mt-1.5 text-sm text-[#8f1d18]">
            {errors[0]}
        </p>
    );
}

function getDateInputValue(date: string | null) {
    return date?.slice(0, 10) ?? "";
}

/** Formulaire prérempli de modification d’une tâche. */
export function ProjectEditTaskModal({
    open,
    task,
    ownerId,
    team,
    onClose,
}: ProjectEditTaskModalProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description ?? "");
    const [dueDate, setDueDate] = useState(getDateInputValue(task.dueDate));
    const [assigneeIds, setAssigneeIds] = useState(
        task.assignees.map((assignee) => assignee.user.id),
    );
    const [priority, setPriority] = useState<ProjectTaskPriority>(task.priority);
    const [status, setStatus] = useState<ProjectTaskStatus>(task.status);
    const [state, formAction, isPending] = useActionState(
        updateProjectTaskAction,
        initialState,
    );
    const formId = useId();
    const titleErrorId = `${formId}-title-error`;
    const descriptionErrorId = `${formId}-description-error`;
    const dueDateErrorId = `${formId}-due-date-error`;
    const assigneeErrorId = `${formId}-assignee-error`;
    const priorityErrorId = `${formId}-priority-error`;
    const statusErrorId = `${formId}-status-error`;
    const formIsInvalid =
        title.trim().length < 2 ||
        title.trim().length > 200 ||
        description.trim().length < 1 ||
        description.trim().length > 1000 ||
        dueDate.length === 0;

    useEffect(() => {
        if (state.status === "success") {
            onClose();
        }
    }, [onClose, state.status]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Modifier"
            size="md"
            closeDisabled={isPending}
        >
            <form action={formAction} className="space-y-5">
                <input type="hidden" name="projectId" value={task.projectId} />
                <input type="hidden" name="taskId" value={task.id} />
                <input type="hidden" name="status" value={status} />
                {assigneeIds.map((assigneeId) => (
                    <input
                        key={assigneeId}
                        type="hidden"
                        name="assigneeIds"
                        value={assigneeId}
                    />
                ))}

                <div>
                    <label
                        htmlFor={`${formId}-title`}
                        className="block text-sm font-medium text-neutral-900"
                    >
                        Titre<span aria-hidden="true">*</span>
                    </label>
                    <input
                        data-modal-initial-focus
                        id={`${formId}-title`}
                        name="title"
                        type="text"
                        required
                        minLength={2}
                        maxLength={200}
                        value={title}
                        disabled={isPending}
                        aria-invalid={Boolean(state.errors?.title)}
                        aria-describedby={
                            state.errors?.title ? titleErrorId : undefined
                        }
                        onChange={(event) => setTitle(event.target.value)}
                        className="mt-2 h-12 w-full rounded-md border border-[#cbd1d8] bg-white px-4 text-sm text-neutral-950 outline-none focus:border-(--brand) focus:ring-2 focus:ring-[#d3590b33] disabled:bg-[#f5f6f7]"
                    />
                    <FieldError id={titleErrorId} errors={state.errors?.title} />
                </div>

                <div>
                    <label
                        htmlFor={`${formId}-description`}
                        className="block text-sm font-medium text-neutral-900"
                    >
                        Description<span aria-hidden="true">*</span>
                    </label>
                    <textarea
                        id={`${formId}-description`}
                        name="description"
                        required
                        maxLength={1000}
                        rows={4}
                        value={description}
                        disabled={isPending}
                        aria-invalid={Boolean(state.errors?.description)}
                        aria-describedby={
                            state.errors?.description
                                ? descriptionErrorId
                                : undefined
                        }
                        onChange={(event) => setDescription(event.target.value)}
                        className="mt-2 min-h-24 w-full resize-y rounded-md border border-[#cbd1d8] bg-white px-4 py-3 text-sm text-neutral-950 outline-none focus:border-(--brand) focus:ring-2 focus:ring-[#d3590b33] disabled:bg-[#f5f6f7]"
                    />
                    <FieldError
                        id={descriptionErrorId}
                        errors={state.errors?.description}
                    />
                </div>

                <div>
                    <label
                        htmlFor={`${formId}-due-date`}
                        className="block text-sm font-medium text-neutral-900"
                    >
                        Échéance<span aria-hidden="true">*</span>
                    </label>
                    <input
                        id={`${formId}-due-date`}
                        name="dueDate"
                        type="date"
                        required
                        value={dueDate}
                        disabled={isPending}
                        aria-invalid={Boolean(state.errors?.dueDate)}
                        aria-describedby={
                            state.errors?.dueDate ? dueDateErrorId : undefined
                        }
                        onChange={(event) => setDueDate(event.target.value)}
                        className="mt-2 h-12 w-full rounded-md border border-[#cbd1d8] bg-white px-4 text-sm text-neutral-950 outline-none focus:border-(--brand) focus:ring-2 focus:ring-[#d3590b33] disabled:bg-[#f5f6f7]"
                    />
                    <FieldError id={dueDateErrorId} errors={state.errors?.dueDate} />
                </div>

                <div>
                    <TaskAssigneeSelect
                        team={team}
                        ownerId={ownerId}
                        selectedIds={assigneeIds}
                        onChange={setAssigneeIds}
                        errorId={
                            state.errors?.assigneeIds
                                ? assigneeErrorId
                                : undefined
                        }
                        disabled={isPending}
                    />
                    <FieldError
                        id={assigneeErrorId}
                        errors={state.errors?.assigneeIds}
                    />
                </div>

                <div>
                    <label
                        htmlFor={`${formId}-priority`}
                        className="block text-sm font-medium text-neutral-900"
                    >
                        Priorité<span aria-hidden="true">*</span>
                    </label>
                    <select
                        id={`${formId}-priority`}
                        name="priority"
                        required
                        value={priority}
                        disabled={isPending}
                        aria-invalid={Boolean(state.errors?.priority)}
                        aria-describedby={
                            state.errors?.priority ? priorityErrorId : undefined
                        }
                        onChange={(event) =>
                            setPriority(event.target.value as ProjectTaskPriority)
                        }
                        className="mt-2 h-12 w-full rounded-md border border-[#cbd1d8] bg-white px-4 text-sm text-neutral-950 outline-none focus:border-(--brand) focus:ring-2 focus:ring-[#d3590b33] disabled:bg-[#f5f6f7]"
                    >
                        {priorityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <FieldError
                        id={priorityErrorId}
                        errors={state.errors?.priority}
                    />
                </div>

                <fieldset
                    aria-invalid={Boolean(state.errors?.status)}
                    aria-describedby={
                        state.errors?.status ? statusErrorId : undefined
                    }
                >
                    <legend className="text-sm font-medium text-neutral-900">
                        Statut<span aria-hidden="true">*</span>
                    </legend>
                    {status === "CANCELLED" && (
                        <p className="mt-2 text-sm text-[#4B5563]">
                            Statut actuel :
                            <span className="ml-2 rounded-full bg-[#e4e7eb] px-3 py-1 text-xs">
                                Annulée
                            </span>
                        </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                        {editableStatusOptions.map((option) => (
                            <label key={option.value} className="cursor-pointer">
                                <input
                                    type="radio"
                                    name={`${formId}-status-choice`}
                                    value={option.value}
                                    checked={status === option.value}
                                    disabled={isPending}
                                    onChange={() => setStatus(option.value)}
                                    className="peer sr-only"
                                />
                                <span
                                    className={`block rounded-full px-4 py-1.5 text-xs font-medium outline-none ring-0 transition peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-checked:ring-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-60 ${option.styles}`}
                                >
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                    <FieldError id={statusErrorId} errors={state.errors?.status} />
                </fieldset>

                {state.message && state.status === "error" && (
                    <p
                        role="alert"
                        className="rounded-md border border-[#f2b8b5] bg-[#fff4f3] px-3 py-2 text-sm leading-5 text-[#8f1d18]"
                    >
                        {state.message}
                    </p>
                )}

                <div className="pt-5">
                    <button
                        type="submit"
                        disabled={isPending || formIsInvalid}
                        className="flex h-13 min-w-48 items-center justify-center rounded-xl bg-[#202020] px-7 text-sm text-white outline-none hover:cursor-pointer hover:bg-black focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#e1e4e8] disabled:text-[#9ca3af]"
                    >
                        {isPending ? "Enregistrement…" : "Enregistrer"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
