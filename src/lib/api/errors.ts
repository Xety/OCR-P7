import "server-only";

import { ApiRequestError } from "@/lib/api/client";

export const SERVICE_UNAVAILABLE_MESSAGE =
    "Le service est momentanément indisponible. Veuillez réessayer plus tard.";

/**
 * Convertit les erreurs de champs de l'API vers les noms utilisés par un formulaire.
 */
export function mapApiFieldErrors<const TField extends string>(
    error: ApiRequestError,
    fieldMap: Readonly<Record<string, TField>>,
): Partial<Record<TField, string[]>> {
    const errors: Partial<Record<TField, string[]>> = {};

    for (const fieldError of error.fieldErrors) {
        const field = fieldMap[fieldError.field];

        if (field) {
            errors[field] = [...(errors[field] ?? []), fieldError.message];
        }
    }

    return errors;
}
