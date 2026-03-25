import { NextResponse } from "next/server";
import { leadSignupSchema } from "@/lib/validation";
import { saveLeadSignup } from "@/lib/db";
import { buildLeadNotificationEmail } from "@/lib/email";
import { getAdminNotificationEmail } from "@/lib/env";
import { sendEmail } from "@/lib/mailer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = leadSignupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力を確認してください。" },
      { status: 400 }
    );
  }

  await saveLeadSignup(parsed.data);

  const adminEmail = getAdminNotificationEmail();
  if (adminEmail) {
    const email = buildLeadNotificationEmail(parsed.data);
    await sendEmail({
      to: adminEmail,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
  }

  return NextResponse.json({ ok: true });
}

