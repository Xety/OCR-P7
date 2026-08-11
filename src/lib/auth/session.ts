import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "abricot_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

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

export async function getSessionToken() {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value;
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}
