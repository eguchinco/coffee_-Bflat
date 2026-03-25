import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <Card className="w-full">
        <CardContent className="space-y-4 p-6 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a67a57]">
            404
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#17110d]">
            ページが見つかりません
          </h1>
          <p className="text-sm leading-7 text-[#6f6156]">
            URL を確認するか、ホームに戻ってください。
          </p>
          <Button asChild>
            <Link href="/">ホームへ戻る</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

