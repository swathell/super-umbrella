"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addWorkspaceMilestone,
  addWorkspaceResource,
  addWorkspaceUpdate,
  createWorkspaceFromLead,
  updateWorkspaceBase,
  workspaceStatuses,
} from "@/lib/workspace-store";

export async function createWorkspaceFromLeadAction(formData: FormData) {
  const leadId = String(formData.get("leadId") ?? "");
  if (!leadId) {
    redirect("/admin/leads?error=missing-lead");
  }
  const workspace = await createWorkspaceFromLead(leadId);
  if (!workspace) {
    redirect(`/admin/leads/${leadId}?workspaceError=missing-lead`);
  }
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  redirect(`/admin/workspaces/${workspace.id}?created=1`);
}

export async function updateWorkspaceBaseAction(formData: FormData) {
  const workspaceId = String(formData.get("workspaceId") ?? "");
  if (!workspaceId) {
    redirect("/admin/leads?error=missing-workspace");
  }
  const status = String(formData.get("status") ?? "");
  await updateWorkspaceBase(workspaceId, {
    title: String(formData.get("title") ?? ""),
    status: workspaceStatuses.includes(status as (typeof workspaceStatuses)[number])
      ? (status as (typeof workspaceStatuses)[number])
      : undefined,
    overview: String(formData.get("overview") ?? ""),
    currentFocus: String(formData.get("currentFocus") ?? ""),
    nextStep: String(formData.get("nextStep") ?? ""),
    communicationGuidance: String(formData.get("communicationGuidance") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    isActive: formData.get("isActive") === "on",
  });
  revalidatePath(`/admin/workspaces/${workspaceId}`);
  redirect(`/admin/workspaces/${workspaceId}?saved=1`);
}

export async function addWorkspaceMilestoneAction(formData: FormData) {
  const workspaceId = String(formData.get("workspaceId") ?? "");
  await addWorkspaceMilestone(workspaceId, {
    title: String(formData.get("title") ?? ""),
    status: (String(formData.get("status") ?? "upcoming") as "upcoming" | "active" | "done"),
    detail: String(formData.get("detail") ?? ""),
    dueLabel: String(formData.get("dueLabel") ?? ""),
  });
  revalidatePath(`/admin/workspaces/${workspaceId}`);
  redirect(`/admin/workspaces/${workspaceId}?milestone=1`);
}

export async function addWorkspaceUpdateAction(formData: FormData) {
  const workspaceId = String(formData.get("workspaceId") ?? "");
  await addWorkspaceUpdate(workspaceId, {
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
  });
  revalidatePath(`/admin/workspaces/${workspaceId}`);
  redirect(`/admin/workspaces/${workspaceId}?update=1`);
}

export async function addWorkspaceResourceAction(formData: FormData) {
  const workspaceId = String(formData.get("workspaceId") ?? "");
  await addWorkspaceResource(workspaceId, {
    label: String(formData.get("label") ?? ""),
    url: String(formData.get("url") ?? ""),
    description: String(formData.get("description") ?? ""),
  });
  revalidatePath(`/admin/workspaces/${workspaceId}`);
  redirect(`/admin/workspaces/${workspaceId}?resource=1`);
}
