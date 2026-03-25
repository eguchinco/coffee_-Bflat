import { getResendClient } from "@/lib/resend";
import { hasResendSecrets, getSiteUrl } from "@/lib/env";

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}) {
  const client = getResendClient();

  if (!client || !hasResendSecrets()) {
    console.log("[mail:demo]", { to, subject, text });
    return { sent: false, demo: true };
  }

  const from = process.env.RESEND_FROM as string;
  const recipients = Array.isArray(to) ? to : [to];

  const result = await client.emails.send({
    from,
    to: recipients,
    subject,
    html,
    text,
  });

  return { sent: true, result };
}

export function getEmailReturnUrl(path = "/") {
  return `${getSiteUrl()}${path}`;
}

