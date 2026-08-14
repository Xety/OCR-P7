import "server-only";

import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "abricot_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

/**
 * Crée une session en stockant le token dans un cookie sécurisé.
 *
 * @param token Le token de session à stocker.
 */
export async function createSession(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

/**
 * Récupère le token de session à partir du cookie.
 *
 * @returns Le token de session ou undefined s'il n'existe pas.
 */
export async function getSessionToken() {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value;
}

/**
 * Supprime la session en supprimant le cookie de session.
 */
export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}
