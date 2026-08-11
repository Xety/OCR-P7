import type { Metadata } from "next";
import Image from "next/image";
import { logoutAction } from "@/app/actions/auth";
import { requireUser } from "@/lib/auth/user";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <main className="min-h-dvh bg-[#f8f9fa] px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-6 border-b border-neutral-200 pb-6">
          <Image
            src="/images/logo.svg"
            alt="Abricot"
            width={253}
            height={33}
            priority
            className="h-auto w-47.5 sm:w-55"
          />
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg bg-[#202020] px-5 py-3 text-base font-medium text-white outline-none transition-colors hover:bg-black focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-3"
            >
              Se déconnecter
            </button>
          </form>
        </header>

        <section className="mt-12 max-w-2xl rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm sm:p-10">
          <p className="text-sm font-semibold tracking-wide text-(--brand) uppercase">
            Tableau de bord
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-neutral-950 sm:text-4xl">
            Bonjour{user.name ? ` ${user.name}` : ""}
          </h1>
          <p className="mt-4 text-lg leading-7 text-neutral-600">
            Vous êtes connecté avec l’adresse {user.email}.
          </p>
          <p className="mt-8 rounded-lg bg-[#fff6ef] px-4 py-3 text-sm leading-6 text-[#7a3508]">
            Les projets et les tâches seront ajoutés dans le prochain lot.
          </p>
        </section>
      </div>
    </main>
  );
}
