import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/user";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <section className="mx-auto w-full max-w-[900px] px-5 py-12 md:px-0 md:py-16">
      <h1 className="text-2xl font-semibold text-neutral-950">
        Tableau de bord
      </h1>
      <p className="mt-2 text-base text-neutral-700">
        Bonjour{user.name ? ` ${user.name}` : ""}, voici un aperçu de vos projets
        et tâches.
      </p>
    </section>
  );
}
