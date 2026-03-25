import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { getCustomerByEmail } from "@/lib/db";
import { getSiteUrl, hasStripeSecrets } from "@/lib/env";
import { sendEmail } from "@/lib/mailer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string };
  const email = body.email?.trim() || "";

  if (!email) {
    return NextResponse.json({ message: "メールアドレスを入力してください。" }, { status: 400 });
  }

  if (!hasStripeSecrets()) {
    return NextResponse.json({
      message: "デモ環境のため Customer Portal は送信しません。",
    });
  }

  const customer = await getCustomerByEmail(email);
  const stripe = getStripeClient();

  if (!stripe || !customer?.stripe_customer_id) {
    return NextResponse.json({
      message: "注文完了後のメールアドレスで試してください。",
    });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customer.stripe_customer_id,
    return_url: `${getSiteUrl()}/checkout/success`,
  });

  await sendEmail({
    to: customer.email,
    subject: "Bflat サブスク管理リンク",
    html: `
      <p>サブスク管理リンクです。</p>
      <p><a href="${session.url}">${session.url}</a></p>
    `,
    text: `サブスク管理リンク: ${session.url}`,
  });

  return NextResponse.json({
    message: "管理リンクをメールで送信しました。",
  });
}
