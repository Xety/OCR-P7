/**
 * Génère les initiales d'un utilisateur à partir de son nom complet ou de son email.
 *
 * @param name Le nom complet de l'utilisateur.
 * @param email L'email de l'utilisateur.
 *
 * @returns Les initiales de l'utilisateur.
 */
export function getUserInitials(name: string | null, email: string) {
    const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];

    // Si le nom complet contient au moins deux mots, on prend la première lettre du premier mot et la première lettre du dernier mot.
    if (words.length >= 2) {
        return `${words[0][0]}${words.at(-1)?.[0] ?? ""}`.toUpperCase();
    }

    // Si le nom complet ne contient qu'un seul mot, on prend les deux premières lettres de ce mot.
    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    // Si le nom complet n'est pas disponible, on utilise l'email pour générer les initiales.
    return email.split("@")[0].slice(0, 2).toUpperCase();
}

/**
 * Divise un nom complet en prénom et nom de famille.
 *
 * @param name Le nom complet à diviser.
 *
 * @returns Un objet contenant le prénom et le nom de famille.
 */
export function splitFullName(name: string | null) {
    const [firstName = "", ...lastNameParts] =
        name?.trim().split(/\s+/).filter(Boolean) ?? [];

    return {
        firstName,
        lastName: lastNameParts.join(" "),
    };
}

/**
 *  Combine le prénom et le nom de famille en un nom complet.
 *
 * @param firstName Le prénom.
 * @param lastName Le nom de famille.
 *
 * @returns Le nom complet.
 */
export function joinFullName(firstName: string, lastName: string) {
    return [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
}