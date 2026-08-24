export type CommentCreateFieldErrors = {
    content?: string[];
};

export type CommentCreateState = {
    status?: "success" | "error";
    errors?: CommentCreateFieldErrors;
    message?: string;
};
