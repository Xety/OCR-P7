import Link from "next/link";

export default function ProjectNotFound() {
    return (
        <section className="mx-auto flex w-full max-w-300 flex-1 items-center justify-center px-5 py-20 md:px-0">
            <div className="max-w-lg rounded-lg border border-[#d9dee3] bg-white px-8 py-14 text-center">
                <h1 className="font-manrope text-2xl font-semibold text-neutral-950">
                    Projet introuvable
                </h1>
                <p className="mt-3 text-sm leading-6 text-[#4B5563]">
                    Ce projet n’existe pas ou vous n’avez pas l’autorisation d’y accéder.
                </p>
                <Link
                    href="/projects"
                    className="mt-7 inline-flex h-11 items-center justify-center rounded-lg bg-[#202020] px-6 text-sm text-white outline-none hover:bg-black focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2"
                >
                    Retour à mes projets
                </Link>
            </div>
        </section>
    );
}