import { Resend } from "resend";
import { hasResendSecrets } from "@/lib/env";

let resendClient: Resend | null = null;

export function getResendClient() {
  if (resendClient) {
    return resendClient;
  }

  if (!hasResendSecrets()) {
    return null;
  }

  resendClient = new Resend(process.env.RESEND_API_KEY as string);
  return resendClient;
}

