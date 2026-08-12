export type ProfileFieldErrors = {
    lastName?: string[];
    firstName?: string[];
    email?: string[];
};

export type PasswordFieldErrors = {
    currentPassword?: string[];
    newPassword?: string[];
};

export type AccountActionState<T> = {
    status?: "success" | "error";
    errors?: T;
    message?: string;
};

export type ProfileActionState = AccountActionState<ProfileFieldErrors>;
export type PasswordActionState = AccountActionState<PasswordFieldErrors>;
