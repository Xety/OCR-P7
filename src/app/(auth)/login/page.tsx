import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthLayout } from "@/components/auth/auth-layout";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function LoginPage() {
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
