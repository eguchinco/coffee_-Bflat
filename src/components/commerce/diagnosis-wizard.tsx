"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecommendationCard } from "@/components/commerce/recommendation-card";
import { diagnosisRequestSchema } from "@/lib/validation";
import type { DiagnosisAnswers, DiagnosisResult } from "@/lib/diagnosis";

const steps = [
  {
    title: "味わいの好み",
    key: "taste",
    options: [
      { value: "bright", label: "軽やかで明るい" },
      { value: "balanced", label: "バランス重視" },
      { value: "deep", label: "濃くてしっかり" },
    ],
  },
  {
    title: "いつもの形",
    key: "grind",
    options: [
      { value: "beans", label: "豆で買う" },
      { value: "ground", label: "粉で買う" },
      { value: "not_sure", label: "まだ決めてない" },
    ],
  },
  {
    title: "飲む量",
    key: "volume",
    options: [
      { value: "light", label: "たまに飲む" },
      { value: "medium", label: "毎日1〜2杯" },
      { value: "heavy", label: "よく飲む" },
    ],
  },
] as const;

const initialAnswers: DiagnosisAnswers = {
  taste: "balanced",
  grind: "not_sure",
  volume: "medium",
};

export function DiagnosisWizard() {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<DiagnosisAnswers>(initialAnswers);
  const [result, setResult] = React.useState<DiagnosisResult | null>(null);
  const [pending, setPending] = React.useState(false);
  const currentStep = steps[step];

  const submit = async () => {
    setPending(true);

    try {
      const parsed = diagnosisRequestSchema.parse({
        answers,
        source: "diagnosis-page",
      });

      const response = await fetch("/api/diagnosis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed),
      });

      const data = (await response.json()) as { result?: DiagnosisResult; error?: string };

      if (!response.ok || !data.result) {
        throw new Error(data.error || "診断に失敗しました");
      }

      setResult(data.result);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "診断に失敗しました");
    } finally {
      setPending(false);
    }
  };

  if (result) {
    return (
      <div className="space-y-6">
        <RecommendationCard result={result} />
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setResult(null)}>
            もう一度診断する
          </Button>
          <Button asChild variant="secondary">
            <Link href="/products">商品一覧を見る</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="warm">3問で完了</Badge>
          <span className="text-sm text-[#7f6f63]">
            {step + 1} / {steps.length}
          </span>
        </div>
        <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
        <p className="text-sm leading-7 text-[#6f6156]">
          迷ったときは、いちばん近いものを選べば大丈夫です。
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3">
          {currentStep.options.map((option) => {
            const selected = answers[currentStep.key] === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  selected
                    ? "border-[#17110d] bg-[#17110d] text-white"
                    : "border-[#e4d8ca] bg-white text-[#17110d] hover:bg-[#faf7f2]"
                }`}
                onClick={() => {
                  setAnswers((current) => ({ ...current, [currentStep.key]: option.value }));
                }}
              >
                <div className="text-sm font-semibold">{option.label}</div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => setStep((value) => Math.max(value - 1, 0))}
            disabled={step === 0}
          >
            戻る
          </Button>

          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((value) => value + 1)}>次へ</Button>
          ) : (
            <Button onClick={submit} disabled={pending}>
              {pending ? "診断中..." : "結果を見る"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
