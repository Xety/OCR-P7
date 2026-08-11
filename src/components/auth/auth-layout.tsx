import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthLayoutProps = {
    title: string;
    imageSrc: string;
    imageAlt: string;
    footerText: string;
    footerLinkText: string;
    footerHref: "/login" | "/signup";
    children: ReactNode;
};

export function AuthLayout({
    title,
    imageSrc,
    imageAlt,
    footerText,
    footerLinkText,
    footerHref,
    children,
}: AuthLayoutProps) {
    return (
        <main className="grid min-h-dvh bg-(--auth-panel) lg:grid-cols-[39%_61%]">
            <section className="grid min-h-dvh grid-rows-[auto_1fr_auto] px-6 py-10 sm:px-12 lg:px-8 lg:py-[9vh]">
                <div className="mx-auto w-full max-w-83">
                    <Image
                        src="/images/logo.svg"
                        alt="Abricot"
                        width={300}
                        height={39}
                        priority
                        className="h-auto w-63.25 sm:w-75"
                    />
                </div>

                <div className="mx-auto flex w-full max-w-83 flex-col justify-center py-12">
                    <h1 className="mb-10 text-[2.625rem] leading-tight font-semibold text-(--brand) sm:text-5xl">
                        {title}
                    </h1>
                    {children}
                </div>

                <p className="mx-auto w-full max-w-83 text-base leading-6 text-neutral-900">
                    {footerText}{" "}
                    <Link
                        href={footerHref}
                        className="text-(--brand) underline decoration-1 underline-offset-2 outline-none hover:text-[#a94308] focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2"
                    >
                        {footerLinkText}
                    </Link>
                </p>
            </section>

            <div className="relative hidden overflow-hidden lg:block">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    priority
                    sizes="61vw"
                    className="object-cover"
                />
            </div>
        </main>
    );
}
