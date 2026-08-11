"use client";

import { useActionState, useState } from "react";
import { loginAction, signupAction } from "@/app/actions/auth";
import type { AuthFormState } from "@/lib/auth/types";

type AuthFormProps = {
  mode: "login" | "signup";
};

const initialState: AuthFormState = {};
const passwordRequirements =
  "Au moins 8 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial parmi @$!%*?&.";

export function AuthForm({ mode }: AuthFormProps) {
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const isLogin = mode === "login";
  const action = isLogin ? loginAction : signupAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const emailErrorId = state.errors?.email ? `${mode}-email-error` : undefined;
  const passwordErrorId = state.errors?.password
    ? `${mode}-password-error`
    : undefined;
  const passwordHelpId = isLogin ? undefined : "signup-password-help";
  const passwordDescription = [passwordHelpId, passwordErrorId]
    .filter(Boolean)
    .join(" ");

  return (
    <form action={formAction} className="flex flex-col" noValidate>
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
          aria-invalid={Boolean(state.errors?.email)}
          aria-describedby={emailErrorId}
          className="h-16 w-full rounded-[5px] border border-[#d9dee3] bg-white px-4 text-lg text-neutral-950 outline-none transition-shadow focus:border-[var(--brand)] focus:ring-2 focus:ring-[#d3590b33] aria-invalid:border-[#b42318]"
        />
        {state.errors?.email && (
          <p id={emailErrorId} className="text-sm leading-5 text-[#b42318]">
            {state.errors.email[0]}
          </p>
        )}
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
          aria-invalid={Boolean(state.errors?.password)}
          aria-describedby={passwordDescription || undefined}
          className="h-16 w-full rounded-[5px] border border-[#d9dee3] bg-white px-4 text-lg text-neutral-950 outline-none transition-shadow focus:border-[var(--brand)] focus:ring-2 focus:ring-[#d3590b33] aria-invalid:border-[#b42318]"
        />
        {!isLogin && (
          <span id={passwordHelpId} className="sr-only">
            {passwordRequirements}
          </span>
        )}
        {state.errors?.password && (
          <p id={passwordErrorId} className="text-sm leading-5 text-[#b42318]">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      {state.message && (
        <p
          role="alert"
          className="mt-5 rounded-md border border-[#f2b8b5] bg-[#fff4f3] px-3 py-2 text-sm leading-5 text-[#8f1d18]"
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        aria-disabled={pending}
        className="mt-9 h-[59px] w-[calc(100%-38px)] self-center rounded-xl bg-[#202020] px-5 text-lg text-white outline-none transition-colors hover:bg-black focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-3 active:bg-neutral-800 disabled:cursor-wait disabled:bg-neutral-500"
      >
        {pending
          ? isLogin
            ? "Connexion…"
            : "Inscription…"
          : isLogin
            ? "Se connecter"
            : "S’inscrire"}
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
            className="text-base text-[var(--brand)] underline decoration-1 underline-offset-2 outline-none hover:text-[#a94308] focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
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
