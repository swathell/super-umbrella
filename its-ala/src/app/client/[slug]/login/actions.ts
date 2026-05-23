"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createClientSessionValue,
  getClientCookieName,
  isClientAuthConfigured,
} from "@/lib/client-auth";
import { verifyWorkspaceAccess } from "@/lib/workspace-store";

export async function clientLoginAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const code = String(formData.get("accessCode") ?? "");

  const workspace = await verifyWorkspaceAccess(slug, code);
  if (!workspace) {
    redirect(`/client/${slug}/login?error=invalid`);
  }

  const cookieStore = await cookies();

  if (isClientAuthConfigured()) {
    cookieStore.set(
      `${getClientCookieName()}_${workspace.id}`,
      await createClientSessionValue(workspace.id, workspace.slug),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 14,
      },
    );
  }

  redirect(`/client/${workspace.slug}`);
}
