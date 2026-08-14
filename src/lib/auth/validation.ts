/**
 * Extrait les informations d'identification (email et mot de passe) à partir d'un objet FormData.
 *
 * @param formData L'objet FormData contenant les informations d'identification.
 *
 * @returns Un objet contenant l'email et le mot de passe extraits du FormData.
 */
export function getCredentialsInput(formData: FormData) {
    return {
        email: formData.get("email"),
        password: formData.get("password"),
    };
}
