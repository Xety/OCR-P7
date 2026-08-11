import type { ReactNode } from "react";
import type { ApiUser } from "@/lib/api/types";
import { AppFooter } from "@/components/layout/app-footer";
import { AppHeader } from "@/components/layout/app-header";

type AppShellProps = {
    user: ApiUser;
    children: ReactNode;
};

export function AppShell({ user, children }: AppShellProps) {
    return (
        <div className="flex min-h-dvh flex-col bg-[#f8f9fa]">
            <a
                href="#main-content"
                className="sr-only z-50 rounded-md bg-white px-4 py-3 text-(--brand) focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:ring-2 focus:ring-(--brand)"
            >
                Aller au contenu principal
            </a>
            <AppHeader user={user} />
            <main id="main-content" className="flex-1">
                {children}
            </main>
            <AppFooter />
        </div>
    );
}
