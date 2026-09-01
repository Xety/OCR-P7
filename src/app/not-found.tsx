import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AppFooter } from "@/components/layout/app-footer";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/lib/auth/user";

type NotFoundContentProps = {
    isAuthenticated: boolean;
};

function NotFoundContent({ isAuthenticated }: NotFoundContentProps) {
    return (
        <section
            aria-labelledby="not-found-title"
            className="mx-auto flex min-h-[calc(100dvh-12rem)] w-full max-w-300 items-center justify-center px-5 py-14 md:px-0 md:py-20"
        >
            <div className="w-full max-w-xl rounded-xl border border-[#e2e5e9] bg-white px-6 py-12 text-center shadow-[0_16px_45px_rgba(15,23,42,0.06)] sm:px-12 sm:py-16">
                <p
                    aria-hidden="true"
                    className="font-manrope text-7xl font-semibold tracking-tight text-(--brand) sm:text-8xl"
                >
                    404
                </p>
                <h1
                    id="not-found-title"
                    className="mt-5 font-manrope text-2xl font-semibold text-neutral-950 sm:text-3xl"
                >
                    Page introuvable
                </h1>
                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#4B5563] sm:text-base">
                    L’adresse saisie est incorrecte ou la page que vous recherchez
                    n’existe plus.
                </p>
                <Link
                    href={isAuthenticated ? "/dashboard" : "/login"}
                    className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-[#202020] px-6 text-sm text-white outline-none transition-colors hover:bg-black focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2"
                >
                    {isAuthenticated
                        ? "Retour au tableau de bord"
                        : "Retour à la connexion"}
                </Link>
            </div>
        </section>
    );
}

function PublicNotFoundShell({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-dvh flex-col bg-[#f8f9fa]">
            <a
                href="#main-content"
                className="sr-only z-50 rounded-md bg-white px-4 py-3 text-(--brand-text) focus:fixed focus:top-3 focus:left-3 focus:not-sr-only focus:ring-2 focus:ring-(--brand)"
            >
                Aller au contenu principal
            </a>
            <header className="border-b border-neutral-100 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                <div className="mx-auto flex min-h-17 w-full max-w-300 items-center px-5 md:px-0">
                    <Link
                        href="/"
                        aria-label="Abricot — Accueil"
                        className="w-fit rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-3"
                    >
                        <Image
                            src="/images/logo.svg"
                            alt=""
                            width={253}
                            height={33}
                            priority
                            className="h-auto w-28"
                        />
                    </Link>
                </div>
            </header>
            <main id="main-content" className="flex-1">
                {children}
            </main>
            <AppFooter />
        </div>
    );
}

export default async function NotFound() {
    const user = await getCurrentUser();
    const content = <NotFoundContent isAuthenticated={Boolean(user)} />;

    if (user) {
        return <AppShell user={user}>{content}</AppShell>;
    }

    return <PublicNotFoundShell>{content}</PublicNotFoundShell>;
}
