export function getUserInitials(name: string | null, email: string) {
    const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];

    if (words.length >= 2) {
        return `${words[0][0]}${words.at(-1)?.[0] ?? ""}`.toUpperCase();
    }

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return email.split("@")[0].slice(0, 2).toUpperCase();
}
