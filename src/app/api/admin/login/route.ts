import { NextResponse } from "next/server";
import { adminLoginSchema } from "@/lib/validation";
import {
  ADMIN_COOKIE_NAME,
  getAdminToken,
  resolveAdminSecret,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = adminLoginSchema.safeParse({
    secret: String(formData.get("secret") || ""),
  });

  if (!parsed.success) {
    return NextResponse.redirect(new URL("/admin?error=1", request.url));
  }

  const secret = resolveAdminSecret(parsed.data.secret);

  if (!secret) {
    return NextResponse.redirect(new URL("/admin?error=1", request.url));
  }

  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: getAdminToken(secret),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
