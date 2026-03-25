"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LeadCaptureForm({
  source = "site",
  title = "メールで新着を受け取る",
  description = "診断結果、入荷、初回オファーを優先的に案内します。",
}: {
  source?: string;
  title?: string;
  description?: string;
}) {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, source, interest: "launch" }),
      });

      if (!response.ok) {
        throw new Error("failed");
      }

      setStatus("success");
      setEmail("");
      setName("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[28px] border border-[#e8ddd2] bg-white p-6">
      <div className="space-y-2">
        <div className="text-xl font-semibold text-[#17110d]">{title}</div>
        <p className="text-sm leading-7 text-[#6f6156]">{description}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="lead-name">お名前</Label>
          <Input id="lead-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="山田 太郎" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-email">メールアドレス</Label>
          <Input
            id="lead-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "送信中..." : "受け取る"}
        </Button>
        {status === "success" ? <span className="text-sm text-[#3b7d4a]">登録しました。</span> : null}
        {status === "error" ? <span className="text-sm text-[#b14a2b]">送信に失敗しました。</span> : null}
      </div>
    </form>
  );
}

