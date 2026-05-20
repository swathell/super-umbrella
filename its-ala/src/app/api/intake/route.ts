import { NextRequest, NextResponse } from "next/server";

type IntakePayload = {
  name?: string;
  email?: string;
  projectType?: string;
  budget?: string;
  summary?: string;
};

function isEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as IntakePayload;

  const name = body.name?.trim() || "";
  const email = body.email?.trim() || "";
  const summary = body.summary?.trim() || "";
  const projectType = body.projectType?.trim() || "Unknown";
  const budget = body.budget?.trim() || "Unknown";

  if (!name || !email || !summary) {
    return NextResponse.json(
      { message: "Please fill in your name, email, and project summary." },
      { status: 400 },
    );
  }

  if (!isEmail(email)) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!notificationEmail || !resendApiKey) {
    return NextResponse.json(
      {
        message:
          "The form is wired up, but email delivery is not configured yet. Add NOTIFICATION_EMAIL and RESEND_API_KEY in Vercel to make submissions go live.",
      },
      { status: 503 },
    );
  }

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Its Ala <onboarding@resend.dev>",
      to: notificationEmail,
      subject: `New inquiry: ${projectType}`,
      html: `
        <h2>New Its Ala inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Project type:</strong> ${projectType}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Summary:</strong></p>
        <p>${summary.replace(/\n/g, "<br />")}</p>
      `,
    }),
  });

  if (!emailResponse.ok) {
    return NextResponse.json(
      { message: "The form is set up, but the notification email failed to send." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    message: "Inquiry sent. You should receive a clear next-step reply rather than a vague sales bounce.",
  });
}
