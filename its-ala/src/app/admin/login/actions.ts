"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createAdminSessionValue,
  getAdminCookieName,
  isAdminAuthConfigured,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function loginAction(formData: FormData) {
  if (!isAdminAuthConfigured()) {
    redirect("/admin/login?error=config");
  }

  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin/leads");

  if (!verifyAdminPassword(password)) {
    redirect(`/admin/login?error=invalid&next=${encodeURIComponent(next)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(getAdminCookieName(), await createAdminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect(next.startsWith("/admin") ? next : "/admin/leads");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(getAdminCookieName());
  redirect("/admin/login?message=logged-out");
}
