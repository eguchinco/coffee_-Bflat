import crypto from "crypto";
import { cookies } from "next/headers";
import { getAdminSessionSecret, getAdminSecret } from "@/lib/env";

export const ADMIN_COOKIE_NAME = "coffee_sale_admin";

export function getAdminToken() {
  const secret = getAdminSessionSecret();

  if (!secret) {
    return "";
  }

  return crypto.createHash("sha256").update(secret).digest("hex");
}

export async function isAdminAuthed() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return Boolean(token && token === getAdminToken());
}

export function assertAdminSecret(secret: string) {
  const configured = getAdminSecret();

  if (!configured || secret !== configured) {
    throw new Error("Unauthorized");
  }
}

