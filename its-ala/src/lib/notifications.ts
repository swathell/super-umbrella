import { formatLeadFacet, type LeadRecord, type StorageMode } from "@/lib/lead-store";

type NotificationOutcome = "sent" | "skipped" | "failed";

export type NotificationReport = {
  operator: NotificationOutcome;
  confirmation: NotificationOutcome;
  messages: string[];
};

function buildBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

async function sendResendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return {
      ok: false as const,
      reason: "Missing RESEND_API_KEY or RESEND_FROM_EMAIL.",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    return {
      ok: false as const,
      reason: `Resend API error: ${response.status} ${text}`,
    };
  }

  return { ok: true as const };
}

export async function sendLeadNotifications({
  lead,
  storage,
}: {
  lead: LeadRecord;
  storage: StorageMode;
}): Promise<NotificationReport> {
  const messages: string[] = [];
  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  const loginUrl = `${buildBaseUrl().replace(/\/$/, "")}/admin/leads/${lead.id}`;

  let operator: NotificationOutcome = "skipped";
  let confirmation: NotificationOutcome = "skipped";

  if (!notificationEmail) {
    messages.push("Operator notification skipped: NOTIFICATION_EMAIL is missing.");
  } else {
    const operatorResult = await sendResendEmail({
      to: notificationEmail,
      subject: `New lead: ${lead.name} (${formatLeadFacet(lead.projectType)})`,
      html: `
        <h2>New project inquiry received</h2>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Company:</strong> ${lead.company || "Not provided"}</p>
        <p><strong>Industry:</strong> ${lead.industry ? formatLeadFacet(lead.industry) : "Not provided"}</p>
        <p><strong>Team size:</strong> ${lead.teamSize ? formatLeadFacet(lead.teamSize) : "Not provided"}</p>
        <p><strong>Project type:</strong> ${formatLeadFacet(lead.projectType)}</p>
        <p><strong>Timeline:</strong> ${lead.timeline}</p>
        <p><strong>Budget:</strong> ${lead.budget}</p>
        <p><strong>Storage:</strong> ${storage}</p>
        <p><strong>Summary:</strong></p>
        <p>${lead.projectSummary.replace(/\n/g, "<br />")}</p>
        <p><a href="${loginUrl}">Open this lead in admin</a></p>
      `,
    });

    if (operatorResult.ok) {
      operator = "sent";
    } else {
      operator = "failed";
      messages.push(operatorResult.reason);
    }
  }

  const sendConfirmation = process.env.SEND_CONFIRMATION_EMAIL !== "false";

  if (!sendConfirmation) {
    messages.push("Submitter confirmation skipped: SEND_CONFIRMATION_EMAIL=false.");
  } else {
    const confirmationResult = await sendResendEmail({
      to: lead.email,
      subject: "We received your project inquiry",
      html: `
        <h2>Inquiry received</h2>
        <p>Thanks for reaching out. Your project inquiry is in review.</p>
        <p><strong>Project type:</strong> ${formatLeadFacet(lead.projectType)}</p>
        <p><strong>Industry:</strong> ${lead.industry ? formatLeadFacet(lead.industry) : "Not provided"}</p>
        <p><strong>Timeline:</strong> ${lead.timeline}</p>
        <p><strong>Budget:</strong> ${lead.budget}</p>
        <p>We will follow up as soon as possible.</p>
      `,
    });

    if (confirmationResult.ok) {
      confirmation = "sent";
    } else {
      confirmation = "failed";
      messages.push(confirmationResult.reason);
    }
  }

  return { operator, confirmation, messages };
}
