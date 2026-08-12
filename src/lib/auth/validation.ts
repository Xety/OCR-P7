export function getCredentialsInput(formData: FormData) {
    return {
        email: formData.get("email"),
        password: formData.get("password"),
    };
}
