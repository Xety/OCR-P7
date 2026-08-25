"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ProjectTeamMember } from "@/lib/projects/types";
import { getUserInitials } from "@/lib/user";

type TaskAssigneeSelectProps = {
    team: ProjectTeamMember[];
    ownerId: string;
    selectedIds: string[];
    onChange: (selectedIds: string[]) => void;
    errorId?: string;
    disabled?: boolean;
};

export function TaskAssigneeSelect({
    team,
    ownerId,
    selectedIds,
    onChange,
    errorId,
    disabled = false,
}: TaskAssigneeSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const firstCheckboxRef = useRef<HTMLInputElement>(null);
    const labelId = useId();
    const countId = useId();
    const panelId = useId();
    const panelIsOpen = isOpen && !disabled;
    const members = useMemo(
        () => [
            ...new Map(team.map((member) => [member.user.id, member])).values(),
        ],
        [team],
    );

    useEffect(() => {
        if (!panelIsOpen) {
            return;
        }

        window.requestAnimationFrame(() => firstCheckboxRef.current?.focus());

        function handlePointerDown(event: PointerEvent) {
            if (
                event.target instanceof Node &&
                !rootRef.current?.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                setIsOpen(false);
                buttonRef.current?.focus();
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [panelIsOpen]);

    useEffect(() => {
        const form = rootRef.current?.closest("form");

        function handleSubmit() {
            setIsOpen(false);
        }

        form?.addEventListener("submit", handleSubmit);

        return () => form?.removeEventListener("submit", handleSubmit);
    }, []);

    function toggleAssignee(userId: string) {
        if (selectedIds.includes(userId)) {
            onChange(selectedIds.filter((selectedId) => selectedId !== userId));
            return;
        }

        onChange([...selectedIds, userId]);
    }

    return (
        <div ref={rootRef}>
            <span id={labelId} className="block text-sm font-medium text-neutral-900">
                Assigné à
            </span>
            <button
                ref={buttonRef}
                type="button"
                disabled={disabled || members.length === 0}
                aria-labelledby={`${labelId} ${countId}`}
                aria-expanded={panelIsOpen}
                aria-controls={panelId}
                aria-describedby={errorId}
                onClick={() => setIsOpen((value) => !value)}
                className="mt-2 flex min-h-12 w-full items-center justify-between gap-4 rounded-md border border-[#cbd1d8] bg-white px-4 text-left text-sm text-[#6B7280] outline-none hover:border-[#9ca3af] hover:cursor-pointer focus-visible:border-(--brand) focus-visible:ring-2 focus-visible:ring-[#d3590b33] disabled:cursor-not-allowed disabled:bg-[#f5f6f7]"
            >
                <span id={countId}>
                    {members.length === 0
                        ? "Aucun membre disponible"
                        : selectedIds.length === 0
                            ? "Choisir un ou plusieurs collaborateurs"
                            : `${selectedIds.length} ${selectedIds.length > 1 ? "personnes sélectionnées" : "personne sélectionnée"}`}
                </span>
                <Image
                    src={panelIsOpen ? "/icons/arrow_up.svg" : "/icons/arrow_down.svg"}
                    alt=""
                    width={17}
                    height={10}
                    aria-hidden="true"
                    className="shrink-0"
                />
            </button>

            <div
                id={panelId}
                hidden={!panelIsOpen}
                role="region"
                aria-labelledby={labelId}
                className="mt-2 rounded-md border border-[#cbd1d8] bg-white p-2 shadow-sm"
            >
                <ul className="max-h-52 space-y-1 overflow-y-auto" aria-label="Membres du projet">
                    {members.map(({ user, role }, index) => {
                        const label = user.name || user.email;
                        const roleLabel =
                            user.id === ownerId
                                ? "Propriétaire"
                                : role === "ADMIN"
                                    ? "Administrateur"
                                    : "Collaborateur";

                        return (
                            <li key={user.id}>
                                <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 outline-none hover:bg-[#fff1e8]">
                                    <input
                                        ref={index === 0 ? firstCheckboxRef : undefined}
                                        type="checkbox"
                                        checked={selectedIds.includes(user.id)}
                                        onChange={() => toggleAssignee(user.id)}
                                        className="size-4 shrink-0 accent-[#d3590b]"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e4e7eb] text-[10px] font-medium text-[#4B5563]"
                                    >
                                        {getUserInitials(user.name, user.email)}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm text-neutral-900">
                                            {label}
                                        </span>
                                        <span className="block truncate text-xs text-[#6B7280]">
                                            {roleLabel}
                                            {user.name ? ` · ${user.email}` : ""}
                                        </span>
                                    </span>
                                </label>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
