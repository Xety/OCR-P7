export type ApiUser = {
    id: string;
    email: string;
    name: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export type ApiFieldError = {
    field: string;
    message: string;
};

export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data?: T & {
        errors?: ApiFieldError[];
    };
    error?: string;
};

export type AuthData = {
    user: ApiUser;
    token: string;
};

export type ProfileData = {
    user: ApiUser;
};
