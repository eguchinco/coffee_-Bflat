"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CustomerPortalForm() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/customer-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "failed");
      }

      setStatus("success");
      setMessage(data.message || "メールで管理リンクを送信しました。");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "送信に失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[28px] border border-[#e8ddd2] bg-white p-6">
      <div className="space-y-2">
        <div className="text-lg font-semibold text-[#17110d]">サブスク管理リンク</div>
        <p className="text-sm leading-7 text-[#6f6156]">
          登録メールアドレスを入れると、Stripe Customer Portal のリンクを送信します。
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="portal-email">メールアドレス</Label>
        <Input
          id="portal-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "送信中..." : "リンクを送る"}
        </Button>
        {message ? <span className="text-sm text-[#6f6156]">{message}</span> : null}
      </div>
    </form>
  );
}

