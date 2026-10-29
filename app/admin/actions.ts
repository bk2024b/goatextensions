"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, SESSION_SECONDS, createSessionValue, passwordMatches } from "@/lib/auth";

export async function login(formData: FormData) {
  const input = String(formData.get("password") ?? "");
  if (!passwordMatches(input)) {
    await new Promise((r) => setTimeout(r, 600)); // ralentit les essais en rafale
    redirect("/admin?error=1");
  }
  (await cookies()).set(COOKIE_NAME, createSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: SESSION_SECONDS,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: COOKIE_NAME, path: "/admin" });
  redirect("/admin");
}
