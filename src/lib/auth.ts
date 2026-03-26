import crypto from "crypto";
import { cookies } from "next/headers";
import { getAdminSessionSecret, getAdminSecret } from "@/lib/env";

export const ADMIN_COOKIE_NAME = "coffee_sale_admin";
export const FALLBACK_ADMIN_SECRET = "bflat-admin-2026";

function hashSecret(secret: string) {
  return crypto.createHash("sha256").update(secret).digest("hex");
}

function getAdminSecretCandidates() {
  return Array.from(
    new Set(
      [getAdminSecret(), getAdminSessionSecret(), FALLBACK_ADMIN_SECRET].filter(
        (value): value is string => Boolean(value)
      )
    )
  );
}

export function getAdminToken(secret: string = getAdminSessionSecret() || getAdminSecret() || FALLBACK_ADMIN_SECRET) {
  return hashSecret(secret);
}

export function resolveAdminSecret(secret: string) {
  return getAdminSecretCandidates().find((candidate) => candidate === secret) || "";
}

export async function isAdminAuthed() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) {
    return false;
  }

  return getAdminSecretCandidates().some((secret) => token === hashSecret(secret));
}

export function assertAdminSecret(secret: string) {
  if (!resolveAdminSecret(secret)) {
    throw new Error("Unauthorized");
  }
}
