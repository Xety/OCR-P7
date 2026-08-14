"use client";

import { useActionState, useState } from "react";
import {
    updatePasswordAction,
    updateProfileAction,
} from "@/app/actions/account";
import type { ApiUser } from "@/lib/api/types";
import type {
    PasswordActionState,
    ProfileActionState,
} from "@/lib/account/types";
import { splitFullName } from "@/lib/user";

type AccountSettingsProps = {
    user: ApiUser;
};

const initialProfileState: ProfileActionState = {};
const initialPasswordState: PasswordActionState = {};
const inputClassName =
    "h-12 w-full rounded-[5px] border border-[#d9dee3] bg-white px-4 text-sm text-neutral-950 outline-none focus:border-(--brand) focus:ring-2 focus:ring-[#d3590b33] aria-invalid:border-[#b42318]";

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
    if (!errors?.length) {
        return null;
    }

    return (
        <p id={id} className="text-sm leading-5 text-[#b42318]">
            {errors[0]}
        </p>
    );
}

function FormMessage({
    state,
}: {
    state: ProfileActionState | PasswordActionState;
}) {
    if (!state.message) {
        return null;
    }

    const isSuccess = state.status === "success";

    return (
        <p
            role={isSuccess ? "status" : "alert"}
            aria-live="polite"
            className={`rounded-md border px-3 py-2 text-sm leading-5 ${isSuccess
                ? "border-[#a7e0c3] bg-[#effbf5] text-[#207c4e]"
                : "border-[#f2b8b5] bg-[#fff4f3] text-[#8f1d18]"
                }`}
        >
            {state.message}
        </p>
    );
}

export function AccountSettings({ user }: AccountSettingsProps) {
    const initialName = splitFullName(user.name);
    const [lastName, setLastName] = useState(initialName.lastName);
    const [firstName, setFirstName] = useState(initialName.firstName);
    const [email, setEmail] = useState(user.email);
    const [profileState, profileAction, profilePending] = useActionState(
        updateProfileAction,
        initialProfileState,
    );
    const [passwordState, passwordAction, passwordPending] = useActionState(
        updatePasswordAction,
        initialPasswordState,
    );

    const lastNameErrorId = profileState.errors?.lastName
        ? "account-last-name-error"
        : undefined;
    const firstNameErrorId = profileState.errors?.firstName
        ? "account-first-name-error"
        : undefined;
    const emailErrorId = profileState.errors?.email
        ? "account-email-error"
        : undefined;
    const currentPasswordErrorId = passwordState.errors?.currentPassword
        ? "account-current-password-error"
        : undefined;
    const newPasswordErrorId = passwordState.errors?.newPassword
        ? "account-new-password-error"
        : undefined;
    const passwordHelpId = "account-new-password-help";
    const newPasswordDescription = [passwordHelpId, newPasswordErrorId]
        .filter(Boolean)
        .join(" ");

    return (
        <section className="mx-auto w-full max-w-300 px-5 py-10 sm:py-14 lg:px-0 lg:py-16">
            <div className="rounded-lg border border-[#dfe3e8] bg-white px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
                <header>
                    <h1 className="text-lg font-medium text-neutral-950">Mon compte</h1>
                    <p className="mt-1 text-sm text-[#858b98]">
                        {user.name || user.email}
                    </p>
                </header>

                <form action={profileAction} noValidate className="mt-9 space-y-6">
                    <h2 className="sr-only">Informations personnelles</h2>

                    <div className="space-y-2">
                        <label htmlFor="account-last-name" className="text-sm text-neutral-900">
                            Nom
                        </label>
                        <input
                            id="account-last-name"
                            name="lastName"
                            type="text"
                            autoComplete="family-name"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            aria-invalid={Boolean(profileState.errors?.lastName)}
                            aria-describedby={lastNameErrorId}
                            className={inputClassName}
                        />
                        <FieldError
                            id="account-last-name-error"
                            errors={profileState.errors?.lastName}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="account-first-name" className="text-sm text-neutral-900">
                            Prénom
                        </label>
                        <input
                            id="account-first-name"
                            name="firstName"
                            type="text"
                            autoComplete="given-name"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            aria-invalid={Boolean(profileState.errors?.firstName)}
                            aria-describedby={firstNameErrorId}
                            className={inputClassName}
                        />
                        <FieldError
                            id="account-first-name-error"
                            errors={profileState.errors?.firstName}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="account-email" className="text-sm text-neutral-900">
                            Email
                        </label>
                        <input
                            id="account-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            aria-invalid={Boolean(profileState.errors?.email)}
                            aria-describedby={emailErrorId}
                            className={inputClassName}
                        />
                        <FieldError
                            id="account-email-error"
                            errors={profileState.errors?.email}
                        />
                    </div>

                    <FormMessage state={profileState} />

                    <button
                        type="submit"
                        disabled={profilePending}
                        aria-disabled={profilePending}
                        className="flex min-h-12 items-center justify-center rounded-lg bg-[#202020] px-6 text-sm text-white outline-none transition-colors hover:bg-black focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-3 disabled:cursor-wait disabled:bg-neutral-500"
                    >
                        {profilePending
                            ? "Modification…"
                            : "Modifier les informations"}
                    </button>
                </form>

                <div className="my-10 border-t border-neutral-200" />

                <form action={passwordAction} noValidate className="space-y-6">
                    <div>
                        <h2 className="text-base font-medium text-neutral-950">
                            Modifier le mot de passe
                        </h2>
                        <p className="mt-1 text-sm text-[#858b98]">
                            Saisissez votre mot de passe actuel avant d’en choisir un nouveau.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="account-current-password"
                            className="text-sm text-neutral-900"
                        >
                            Mot de passe actuel
                        </label>
                        <input
                            id="account-current-password"
                            name="currentPassword"
                            type="password"
                            autoComplete="current-password"
                            required
                            aria-invalid={Boolean(
                                passwordState.errors?.currentPassword,
                            )}
                            aria-describedby={currentPasswordErrorId}
                            className={inputClassName}
                        />
                        <FieldError
                            id="account-current-password-error"
                            errors={passwordState.errors?.currentPassword}
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="account-new-password"
                            className="text-sm text-neutral-900"
                        >
                            Nouveau mot de passe
                        </label>
                        <input
                            id="account-new-password"
                            name="newPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                            aria-invalid={Boolean(passwordState.errors?.newPassword)}
                            aria-describedby={newPasswordDescription}
                            className={inputClassName}
                        />
                        <p id={passwordHelpId} className="text-xs leading-5 text-[#858b98]">
                            Au moins 8 caractères, avec une majuscule, une minuscule,
                            un chiffre et un caractère spécial parmi @$!%*?&amp;.
                        </p>
                        <FieldError
                            id="account-new-password-error"
                            errors={passwordState.errors?.newPassword}
                        />
                    </div>

                    <FormMessage state={passwordState} />

                    <button
                        type="submit"
                        disabled={passwordPending}
                        aria-disabled={passwordPending}
                        className="flex min-h-12 items-center justify-center rounded-lg bg-[#202020] px-6 text-sm text-white outline-none transition-colors hover:bg-black focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-3 disabled:cursor-wait disabled:bg-neutral-500"
                    >
                        {passwordPending
                            ? "Modification…"
                            : "Modifier le mot de passe"}
                    </button>
                </form>
            </div>
        </section>
    );
}
