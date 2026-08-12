export function splitFullName(name: string | null) {
    const [firstName = "", ...lastNameParts] =
        name?.trim().split(/\s+/).filter(Boolean) ?? [];

    return {
        firstName,
        lastName: lastNameParts.join(" "),
    };
}

export function joinFullName(firstName: string, lastName: string) {
    return [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
}
