import { NextResponse } from "next/server";
import { diagnoseCoffee } from "@/lib/diagnosis";
import { diagnosisRequestSchema } from "@/lib/validation";
import { saveDiagnosisSession, saveLeadSignup } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = diagnosisRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力を確認してください。" },
      { status: 400 }
    );
  }

  const result = diagnoseCoffee(parsed.data.answers);

  await Promise.all([
    saveDiagnosisSession({
      email: parsed.data.email,
      name: parsed.data.name,
      source: parsed.data.source || "diagnosis",
      answers: parsed.data.answers,
      result,
    }),
    parsed.data.email
      ? saveLeadSignup({
          email: parsed.data.email,
          name: parsed.data.name,
          source: parsed.data.source || "diagnosis",
          interest: "diagnosis",
        })
      : Promise.resolve(null),
  ]);

  return NextResponse.json({ result });
}

