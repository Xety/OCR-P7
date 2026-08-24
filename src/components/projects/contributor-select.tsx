"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { searchProjectUsersAction } from "@/app/actions/projects";
import type { ApiUser } from "@/lib/api/types";
import { getUserInitials } from "@/lib/user";

type ContributorSelectProps = {
    selected: ApiUser[];
    ownerId: string;
    onChange: (contributors: ApiUser[]) => void;
    errorId?: string;
};

export function ContributorSelect({
    selected,
    ownerId,
    onChange,
    errorId,
}: ContributorSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ApiUser[]>([]);
    const [resultQuery, setResultQuery] = useState("");
    const [message, setMessage] = useState<string>();
    const [isSearching, startSearch] = useTransition();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const requestIdRef = useRef(0);
    const labelId = useId();
    const countId = useId();
    const panelId = useId();

    useEffect(() => {
        if (isOpen) {
            window.requestAnimationFrame(() => searchInputRef.current?.focus());
        }
    }, [isOpen]);

    useEffect(() => {
        const normalizedQuery = query.trim();
        const requestId = ++requestIdRef.current;

        if (normalizedQuery.length < 2) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            startSearch(async () => {
                const response = await searchProjectUsersAction(normalizedQuery);

                if (requestId !== requestIdRef.current) {
                    return;
                }

                setResults(
                    response.users.filter(
                        (user) =>
                            user.id !== ownerId &&
                            !selected.some((contributor) => contributor.id === user.id),
                    ),
                );
                setResultQuery(normalizedQuery);
                setMessage(response.message);
            });
        }, 300);

        return () => window.clearTimeout(timeoutId);
    }, [ownerId, query, selected]);

    function addContributor(user: ApiUser) {
        onChange([...selected, user]);
        setQuery("");
        setResults([]);
        setResultQuery("");
        searchInputRef.current?.focus();
    }

    function removeContributor(userId: string) {
        onChange(selected.filter((contributor) => contributor.id !== userId));
    }

    return (
        <div>
            <span id={labelId} className="block text-sm font-medium text-neutral-900">
                Contributeurs
            </span>
            <button
                type="button"
                aria-labelledby={`${labelId} ${countId}`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-describedby={errorId}
                onClick={() => setIsOpen((value) => !value)}
                className="mt-2 flex min-h-12 w-full items-center justify-between rounded-md border border-[#cbd1d8] bg-white px-4 text-left text-sm text-[#4B5563] outline-none hover:border-[#9ca3af] hover:cursor-pointer focus-visible:border-(--brand) focus-visible:ring-2 focus-visible:ring-[#d3590b33]"
            >
                <span id={countId}>
                    {selected.length} {selected.length > 1 ? "collaborateurs" : "collaborateur"}
                </span>
                <Image
                    src={isOpen ? "/icons/arrow_up.svg" : "/icons/arrow_down.svg"}
                    alt=""
                    width={17}
                    height={10}
                    aria-hidden="true"
                />
            </button>

            <div
                id={panelId}
                hidden={!isOpen}
                role="region"
                aria-labelledby={labelId}
                className="mt-3 rounded-md border border-[#cbd1d8] bg-white p-3"
            >
                <label htmlFor={`${panelId}-search`} className="sr-only">
                    Rechercher un utilisateur
                </label>
                <input
                    ref={searchInputRef}
                    id={`${panelId}-search`}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Nom ou adresse email"
                    className="h-11 w-full rounded-md border border-[#cbd1d8] px-3 text-sm outline-none focus:border-(--brand) focus:ring-2 focus:ring-[#d3590b33]"
                />
                <div className="mt-3 text-sm" aria-live="polite">
                    {query.trim().length < 2 ? (
                        <p className="text-[#4B5563]">Saisissez au moins 2 caractères.</p>
                    ) : isSearching ? (
                        <p className="text-[#4B5563]">Recherche en cours…</p>
                    ) : resultQuery !== query.trim() ? (
                        <p className="text-[#4B5563]">Recherche en attente…</p>
                    ) : message ? (
                        <p role="alert" className="text-[#8f1d18]">
                            {message}
                        </p>
                    ) : results.length > 0 ? (
                        <ul className="flex flex-col gap-1">
                            {results.map((user) => (
                                <li key={user.id}>
                                    <button
                                        type="button"
                                        onClick={() => addContributor(user)}
                                        className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left outline-none hover:bg-[#fff1e8] hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-(--brand)"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e4e7eb] text-[10px] font-medium text-[#4B5563]"
                                        >
                                            {getUserInitials(user.name, user.email)}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm text-neutral-900">
                                                {user.name || user.email}
                                            </span>
                                            {user.name && (
                                                <span className="block truncate text-xs text-[#4B5563]">
                                                    {user.email}
                                                </span>
                                            )}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-[#4B5563]">Aucun utilisateur trouvé.</p>
                    )}
                </div>
            </div>

            {selected.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2" aria-label="Contributeurs sélectionnés">
                    {selected.map((contributor) => {
                        const label = contributor.name || contributor.email;

                        return (
                            <li
                                key={contributor.id}
                                className="flex items-center gap-2 rounded-full bg-[#eef0f3] py-1 pr-2 pl-1 text-xs text-[#4B5563]"
                            >
                                <span
                                    aria-hidden="true"
                                    className="flex size-6 items-center justify-center rounded-full bg-[#d9dde2] text-[10px] font-medium"
                                >
                                    {getUserInitials(contributor.name, contributor.email)}
                                </span>
                                <span className="max-w-44 truncate">{label}</span>
                                <button
                                    type="button"
                                    aria-label={`Retirer ${label}`}
                                    onClick={() => removeContributor(contributor.id)}
                                    className="flex size-6 items-center justify-center rounded-full text-base outline-none hover:bg-[#d9dde2] hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-(--brand)"
                                >
                                    <span aria-hidden="true">×</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
