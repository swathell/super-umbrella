"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addSignal,
  briefingStatuses,
  createBriefingFromSignal,
  signalStages,
  updateBriefing,
  updateSignal,
} from "@/lib/upstream-store";

export async function captureSignalAction(formData: FormData) {
  const signal = await addSignal({
    organizationName: String(formData.get("organizationName") ?? ""),
    title: String(formData.get("title") ?? ""),
    sourceType: String(formData.get("sourceType") ?? ""),
    sourceLabel: String(formData.get("sourceLabel") ?? ""),
    sourceUrl: String(formData.get("sourceUrl") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    whyNow: String(formData.get("whyNow") ?? ""),
    route: String(formData.get("route") ?? ""),
    score: Number(formData.get("score") ?? 70),
    tags: String(formData.get("tags") ?? ""),
    frictionPoints: String(formData.get("frictionPoints") ?? ""),
    stackHints: String(formData.get("stackHints") ?? ""),
  });

  revalidatePath("/admin/upstream");
  redirect(`/admin/upstream?module=signals&signal=${signal.id}&captured=1`);
}

export async function updateSignalAction(formData: FormData) {
  const signalId = String(formData.get("signalId") ?? "");
  const stage = String(formData.get("stage") ?? "");
  const signal = await updateSignal({
    signalId,
    stage: signalStages.includes(stage as (typeof signalStages)[number])
      ? (stage as (typeof signalStages)[number])
      : "captured",
    score: Number(formData.get("score") ?? 70),
    route: String(formData.get("route") ?? ""),
    whyNow: String(formData.get("whyNow") ?? ""),
  });

  revalidatePath("/admin/upstream");
  redirect(`/admin/upstream?module=signals&signal=${signal?.id ?? signalId}&saved=1`);
}

export async function createBriefingAction(formData: FormData) {
  const signalId = String(formData.get("signalId") ?? "");
  const briefing = await createBriefingFromSignal(signalId);
  revalidatePath("/admin/upstream");
  if (briefing) {
    redirect(`/admin/upstream?module=briefings&briefing=${briefing.id}&promoted=1`);
  }
  redirect(`/admin/upstream?module=signals&signal=${signalId}&error=missing-briefing`);
}

export async function updateBriefingAction(formData: FormData) {
  const briefingId = String(formData.get("briefingId") ?? "");
  const status = String(formData.get("status") ?? "");
  const briefing = await updateBriefing({
    briefingId,
    status: briefingStatuses.includes(status as (typeof briefingStatuses)[number])
      ? (status as (typeof briefingStatuses)[number])
      : "draft",
    objective: String(formData.get("objective") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    nextAction: String(formData.get("nextAction") ?? ""),
  });
  revalidatePath("/admin/upstream");
  redirect(`/admin/upstream?module=briefings&briefing=${briefing?.id ?? briefingId}&saved=1`);
}
