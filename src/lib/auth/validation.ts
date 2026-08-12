import * as z from "zod";

const requiredEmailMessage = "L’adresse email est requise.";
const invalidEmailMessage = "Saisissez une adresse email valide.";
const requiredPasswordMessage = "Le mot de passe est requis.";
const invalidPasswordMessage =
    "Utilisez au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial parmi @$!%*?&.";

const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const emailSchema = z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z
        .string({ error: requiredEmailMessage })
        .min(1, { error: requiredEmailMessage })
        .pipe(z.email({ error: invalidEmailMessage })),
);

const requiredPasswordSchema = z
    .string({ error: requiredPasswordMessage })
    .min(1, { error: requiredPasswordMessage });

const signupPasswordSchema = requiredPasswordSchema.pipe(
    z.string().regex(passwordPattern, { error: invalidPasswordMessage }),
);

export const credentialsSchemas = {
    login: z.object({
        email: emailSchema,
        password: requiredPasswordSchema,
    }),
    signup: z.object({
        email: emailSchema,
        password: signupPasswordSchema,
    }),
} as const;

export type AuthMode = keyof typeof credentialsSchemas;
export type Credentials = z.infer<(typeof credentialsSchemas)[AuthMode]>;

export function getCredentialsInput(formData: FormData) {
    return {
        email: formData.get("email"),
        password: formData.get("password"),
    };
}
