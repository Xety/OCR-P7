export function getProfileInput(formData: FormData) {
    return {
        lastName: formData.get("lastName"),
        firstName: formData.get("firstName"),
        email: formData.get("email"),
    };
}

export function getPasswordInput(formData: FormData) {
    return {
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
    };
}
