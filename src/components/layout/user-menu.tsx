"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import { LogoutIcon, UserIcon } from "@/components/ui/icons";
import { getUserInitials } from "@/lib/user";

type UserMenuProps = {
    name: string | null;
    email: string;
};

export function UserMenu({ name, email }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuId = useId();
    const initials = getUserInitials(name, email);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function closeOnOutsideClick(event: PointerEvent) {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        function closeOnEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        }

        document.addEventListener("pointerdown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);

        return () => {
            document.removeEventListener("pointerdown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [isOpen]);

    function focusMenuItem(position: "first" | "last") {
        window.requestAnimationFrame(() => {
            const items = wrapperRef.current?.querySelectorAll<HTMLElement>(
                '[role="menuitem"]',
            );
            const item = position === "first" ? items?.[0] : items?.[items.length - 1];
            item?.focus();
        });
    }

    function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setIsOpen(true);
            focusMenuItem(event.key === "ArrowDown" ? "first" : "last");
        }
    }

    function handleMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
            return;
        }

        event.preventDefault();
        const items = Array.from(
            wrapperRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ??
            [],
        );
        const currentIndex = items.indexOf(document.activeElement as HTMLElement);
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex = (currentIndex + direction + items.length) % items.length;
        items[nextIndex]?.focus();
    }

    return (
        <div ref={wrapperRef} className="relative justify-self-end">
            <button
                ref={triggerRef}
                type="button"
                aria-label={`Ouvrir le menu de ${name || email}`}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-controls={menuId}
                onClick={() => setIsOpen((open) => !open)}
                onKeyDown={handleTriggerKeyDown}
                className={`flex size-12 items-center justify-center rounded-full text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-3 ${isOpen
                    ? "bg-[#df5a00] text-white"
                    : "bg-[#fde7d8] text-neutral-950 hover:bg-[#df5a00] hover:text-white"
                    }`}
            >
                {initials}
            </button>

            {isOpen && (
                <div
                    id={menuId}
                    role="menu"
                    aria-label="Menu utilisateur"
                    onKeyDown={handleMenuKeyDown}
                    className="absolute top-[calc(100%+0.75rem)] right-0 z-50 w-52 overflow-hidden rounded-xl border border-neutral-200 bg-white py-2 shadow-[0_12px_32px_rgba(0,0,0,0.14)]"
                >
                    <Link
                        href="/account"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-800 outline-none hover:bg-[#fff1e8] focus:bg-[#fff1e8] focus:text-(--brand)"
                    >
                        <UserIcon className="size-5" />
                        Mon Compte
                    </Link>
                    <div className="mx-4 border-t border-neutral-100" />
                    <form action={logoutAction}>
                        <button
                            type="submit"
                            role="menuitem"
                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-neutral-800 outline-none hover:bg-[#fff1e8] focus:bg-[#fff1e8] focus:text-(--brand)"
                        >
                            <LogoutIcon className="size-5" />
                            Déconnexion
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
