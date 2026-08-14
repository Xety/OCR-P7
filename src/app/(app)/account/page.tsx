import type { Metadata } from "next";
import { AccountSettings } from "@/components/account/account-settings";
import { requireUser } from "@/lib/auth/user";

export const metadata: Metadata = {
    title: "Mon Compte",
};

export default async function AccountPage() {
    const user = await requireUser();

    return <AccountSettings user={user} />;
}
