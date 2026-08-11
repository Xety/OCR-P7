import Image from "next/image";

export function AppFooter() {
    return (
        <footer className="border-t border-neutral-100 bg-white">
            <div className="mx-auto flex min-h-14 w-full max-w-325 flex-wrap items-center justify-between gap-4 px-5 py-4 text-xs text-neutral-900">
                <Image
                    src="/images/logo.svg"
                    alt="Abricot"
                    width={253}
                    height={33}
                    className="h-auto w-20 brightness-0"
                />
                <p>Abricot {new Date().getFullYear()}</p>
            </div>
        </footer>
    );
}
