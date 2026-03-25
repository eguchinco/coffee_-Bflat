import { NextResponse } from "next/server";
import { adminLoginSchema } from "@/lib/validation";
import { assertAdminSecret, getAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = adminLoginSchema.safeParse({
    secret: String(formData.get("secret") || ""),
  });

  if (!parsed.success) {
    return NextResponse.redirect(new URL("/admin?error=1", request.url));
  }

  try {
    assertAdminSecret(parsed.data.secret);
  } catch {
    return NextResponse.redirect(new URL("/admin?error=1", request.url));
  }

  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: getAdminToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}

