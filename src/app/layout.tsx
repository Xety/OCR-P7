import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope-next",
});

export const metadata: Metadata = {
  title: {
    default: "Abricot",
    template: "%s | Abricot",
  },
  description: "Application collaborative de gestion de projets",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
