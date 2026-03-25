import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AdminOrdersTable } from "@/components/commerce/admin-orders-table";
import { getAdminOrders, getAdminStats } from "@/lib/db";
import { isAdminAuthed } from "@/lib/auth";

export const metadata: Metadata = {
  title: "管理画面",
  description: "注文、発送、通知の管理。",
};

type PageProps = {
  searchParams: Promise<{ error?: string; shipped?: string }>;
};

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: PageProps) {
  const authed = await isAdminAuthed();
  const query = await searchParams;

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-16 sm:px-6 lg:px-8">
        <Card className="w-full">
          <CardContent className="space-y-4 p-6">
            <div className="text-2xl font-semibold text-[#17110d]">管理画面ログイン</div>
            <p className="text-sm leading-7 text-[#6f6156]">
              共有秘密を入力してください。
            </p>
            {query.error ? (
              <div className="rounded-2xl bg-[#fff3e6] px-4 py-3 text-sm text-[#a75822]">
                秘密が違います。
              </div>
            ) : null}
            <form action="/api/admin/login" method="post" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secret">Admin Secret</Label>
                <Input id="secret" name="secret" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                ログイン
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [stats, orders] = await Promise.all([getAdminStats(), getAdminOrders()]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a67a57]">
            Admin
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#17110d]">
            管理画面
          </h1>
        </div>
        <form action="/api/admin/logout" method="post">
          <Button variant="outline" type="submit">
            ログアウト
          </Button>
        </form>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "注文", value: stats.orders },
          { label: "発送済み", value: stats.shipped },
          { label: "リード", value: stats.leads },
          { label: "診断", value: stats.diagnosis },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-[#a67a57]">{item.label}</div>
              <div className="mt-2 text-3xl font-semibold text-[#17110d]">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold text-[#17110d]">注文一覧</h2>
        <AdminOrdersTable orders={orders} />
      </div>
    </div>
  );
}
