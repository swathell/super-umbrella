import { NextResponse } from "next/server";
import { saveInquiry } from "@/lib/inquiry-store";
import { validateInquiry } from "@/lib/inquiries";

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

    return NextResponse.json({
      ok: true,
      inquiry: saved.record,
      storage: saved.storage,
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
