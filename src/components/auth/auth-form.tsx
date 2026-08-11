"use client";

import { useState, type FormEvent } from "react";

type AuthFormProps = {
    mode: "login" | "signup";
};

const passwordRequirements =
    "Au moins 8 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial parmi @$!%*?&.";

export function AuthForm({ mode }: AuthFormProps) {
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
    const isLogin = mode === "login";

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col" noValidate={false}>
            <div className="flex flex-col gap-2">
                <label htmlFor={`${mode}-email`} className="text-base text-neutral-900">
                    Email
                </label>
                <input
                    id={`${mode}-email`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="h-16 w-full rounded-[5px] border border-[#d9dee3] bg-white px-4 text-lg text-neutral-950 outline-none transition-shadow focus:border-(--brand) focus:ring-2 focus:ring-[#d3590b33]"
                />
            </div>

            <div className="mt-8 flex flex-col gap-2">
                <label
                    htmlFor={`${mode}-password`}
                    className="text-base text-neutral-900"
                >
                    Mot de passe
                </label>
                <input
                    id={`${mode}-password`}
                    name="password"
                    type="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    minLength={isLogin ? undefined : 8}
                    pattern={
                        isLogin
                            ? undefined
                            : "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}"
                    }
                    aria-describedby={isLogin ? undefined : "signup-password-help"}
                    className="h-16 w-full rounded-[5px] border border-[#d9dee3] bg-white px-4 text-lg text-neutral-950 outline-none transition-shadow focus:border-(--brand) focus:ring-2 focus:ring-[#d3590b33]"
                />
                {!isLogin && (
                    <span id="signup-password-help" className="sr-only">
                        {passwordRequirements}
                    </span>
                )}
            </div>

            <button
                type="submit"
                className="mt-9 h-14.75 w-[calc(100%-38px)] self-center rounded-xl bg-[#202020] px-5 text-lg text-white outline-none transition-colors hover:bg-black focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-3 active:bg-neutral-800"
            >
                {isLogin ? "Se connecter" : "S’inscrire"}
            </button>

            {isLogin && (
                <div className="mt-5 text-center">
                    <button
                        type="button"
                        onClick={() =>
                            setForgotPasswordMessage(
                                "La réinitialisation du mot de passe n’est pas encore disponible.",
                            )
                        }
                        className="text-base text-(--brand) underline decoration-1 underline-offset-2 outline-none hover:text-[#a94308] focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2"
                    >
                        Mot de passe oublié ?
                    </button>
                    <p
                        aria-live="polite"
                        className="mt-3 min-h-5 text-sm leading-5 text-neutral-700"
                    >
                        {forgotPasswordMessage}
                    </p>
                </div>
            )}
        </form>
    );
}
