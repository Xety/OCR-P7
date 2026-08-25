"use client";

import { ContributorSelect } from "@/components/projects/contributor-select";
import type { ApiUser } from "@/lib/api/types";
import type { ProjectFieldErrors } from "@/lib/projects/types";

type ProjectFormFieldsProps = {
    idPrefix: string;
    name: string;
    description: string;
    contributors: ApiUser[];
    ownerId: string;
    errors?: ProjectFieldErrors;
    contributorEmptyLabel?: string;
    onNameChange: (name: string) => void;
    onDescriptionChange: (description: string) => void;
    onContributorsChange: (contributors: ApiUser[]) => void;
};

const inputClassName =
    "mt-2 w-full rounded-md border border-[#cbd1d8] bg-white px-4 text-sm text-neutral-950 outline-none focus:border-(--brand) focus:ring-2 focus:ring-[#d3590b33] aria-invalid:border-[#b42318]";

/**
 * Regroupe les champs communs aux formulaires de création et de modification
 * d’un projet.
 */
export function ProjectFormFields({
    idPrefix,
    name,
    description,
    contributors,
    ownerId,
    errors,
    contributorEmptyLabel,
    onNameChange,
    onDescriptionChange,
    onContributorsChange,
}: ProjectFormFieldsProps) {
    const nameId = `${idPrefix}-name`;
    const nameErrorId = `${nameId}-error`;
    const descriptionId = `${idPrefix}-description`;
    const descriptionErrorId = `${descriptionId}-error`;
    const contributorsErrorId = `${idPrefix}-contributors-error`;

    return (
        <>
            <input
                type="hidden"
                name="contributors"
                value={JSON.stringify(
                    contributors.map(({ id, email, name: contributorName }) => ({
                        id,
                        email,
                        name: contributorName,
                    })),
                )}
            />

            <div>
                <label htmlFor={nameId} className="text-sm font-medium text-neutral-900">
                    Titre<span aria-hidden="true">*</span>
                </label>
                <input
                    id={nameId}
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={100}
                    value={name}
                    onChange={(event) => onNameChange(event.target.value)}
                    data-modal-initial-focus
                    aria-invalid={errors?.name ? true : undefined}
                    aria-describedby={errors?.name ? nameErrorId : undefined}
                    className={`${inputClassName} h-12`}
                />
                <FieldError id={nameErrorId} errors={errors?.name} />
            </div>

            <div>
                <label
                    htmlFor={descriptionId}
                    className="text-sm font-medium text-neutral-900"
                >
                    Description<span aria-hidden="true">*</span>
                </label>
                <textarea
                    id={descriptionId}
                    name="description"
                    required
                    maxLength={500}
                    value={description}
                    onChange={(event) => onDescriptionChange(event.target.value)}
                    aria-invalid={errors?.description ? true : undefined}
                    aria-describedby={
                        errors?.description ? descriptionErrorId : undefined
                    }
                    className={`${inputClassName} min-h-28 resize-y py-3`}
                />
                <FieldError
                    id={descriptionErrorId}
                    errors={errors?.description}
                />
            </div>

            <div>
                <ContributorSelect
                    selected={contributors}
                    ownerId={ownerId}
                    onChange={onContributorsChange}
                    errorId={errors?.contributors ? contributorsErrorId : undefined}
                    emptyLabel={contributorEmptyLabel}
                />
                <FieldError
                    id={contributorsErrorId}
                    errors={errors?.contributors}
                />
            </div>
        </>
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
