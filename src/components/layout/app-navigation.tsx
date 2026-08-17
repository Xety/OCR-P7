"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardIcon, FolderIcon } from "@/components/ui/icons";

const navigationItems = [
    {
        href: "/dashboard",
        label: "Tableau de bord",
        icon: DashboardIcon,
    },
    {
        href: "/projects",
        label: "Projets",
        icon: FolderIcon,
    },
] as const;

export function AppNavigation() {
    const pathname = usePathname();

    return (
        <nav aria-label="Navigation principale" className="w-full md:w-auto">
            <ul className="flex items-center justify-center gap-2 sm:gap-5">
                {navigationItems.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return (
                        <li key={item.href} className="flex-1 md:flex-none">
                            <Link
                                href={item.href}
                                aria-current={isActive ? "page" : undefined}
                                className={`flex h-12 items-center justify-center gap-3 rounded-lg px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2 sm:min-w-40 md:h-14 ${isActive
                                    ? "bg-[#151515] text-white"
                                    : "text-(--brand-text) hover:bg-[#fff1e8]"
                                    }`}
                            >
                                <Icon className="size-5" />
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
