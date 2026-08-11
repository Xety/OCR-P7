import Image from "next/image";
import Link from "next/link";
import type { ApiUser } from "@/lib/api/types";
import { AppNavigation } from "@/components/layout/app-navigation";
import { UserMenu } from "@/components/layout/user-menu";

type AppHeaderProps = {
    user: ApiUser;
};

export function AppHeader({ user }: AppHeaderProps) {
    return (
        <header className="relative z-40 border-b border-neutral-100 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
            <div className="mx-auto grid w-full max-w-300 grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 px-5 py-3 md:grid-cols-[1fr_auto_1fr] md:px-0 md:py-1.5">
                <Link
                    href="/dashboard"
                    aria-label="Abricot — Tableau de bord"
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

                <div className="order-3 col-span-2 md:order-0 md:col-span-1">
                    <AppNavigation />
                </div>

                <UserMenu name={user.name} email={user.email} />
            </div>
        </header>
    );
}
