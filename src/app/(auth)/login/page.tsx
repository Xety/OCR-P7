import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { getCurrentUser } from "@/lib/auth/user";

export const metadata: Metadata = {
    title: "Connexion",
};

export default async function LoginPage() {
    if (await getCurrentUser()) {
        redirect("/dashboard");
    }

    return (
        <AuthLayout
            title="Connexion"
            imageSrc="/images/login/bg_login.jpg"
            imageAlt="Bureau avec clavier, carnet, stylo et outils de mesure"
            footerText="Pas encore de compte ?"
            footerLinkText="Créer un compte"
            footerHref="/signup"
        >
            <AuthForm mode="login" />
        </AuthLayout>
    );
}
