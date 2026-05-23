"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { leadStatuses, updateLead } from "@/lib/lead-store";

function parseArchived(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

export async function updateLeadAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const notes = String(formData.get("notes") ?? "");
  const archived = parseArchived(formData.get("archived"));

  if (!id) {
    return;
  }

  await updateLead(id, {
    status: leadStatuses.includes(status as (typeof leadStatuses)[number])
      ? (status as (typeof leadStatuses)[number])
      : undefined,
    notes,
    archived,
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  redirect(`/admin/leads/${id}?saved=1`);
}
