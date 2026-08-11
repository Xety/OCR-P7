export type AuthFieldErrors = {
    email?: string[];
    password?: string[];
};

export type AuthFormState = {
    errors?: AuthFieldErrors;
    message?: string;
};
