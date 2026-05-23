import { NextResponse } from "next/server";
import { saveInquiry } from "@/lib/lead-store";
import { validateInquiry } from "@/lib/inquiries";
import { sendLeadNotifications } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = validateInquiry(payload);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, errors: result.errors },
        { status: 400 },
      );
    }

    const saved = await saveInquiry(result.data);
    const notifications = await sendLeadNotifications({
      lead: saved.record,
      storage: saved.storage,
    });

    if (notifications.messages.length > 0) {
      console.warn("Lead notification warnings:", notifications.messages);
    }

    return NextResponse.json({
      ok: true,
      inquiry: saved.record,
      storage: saved.storage,
      notifications,
    });
  } catch (error) {
    console.error("Inquiry submission failed", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Something went wrong while sending your inquiry. Please try again.",
      },
      { status: 500 },
    );
  }
}
