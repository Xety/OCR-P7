import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthLayout } from "@/components/auth/auth-layout";

export const metadata: Metadata = {
  title: "Inscription",
};

export default function SignupPage() {
  return (
    <AuthLayout
      title="Inscription"
      imageSrc="/images/signup/bg_singup.jpg"
      imageAlt="Bureau avec ordinateur, fournitures et outils de mesure"
      footerText="Déjà inscrit ?"
      footerLinkText="Se connecter"
      footerHref="/login"
    >
      <AuthForm mode="signup" />
    </AuthLayout>
  );
}
