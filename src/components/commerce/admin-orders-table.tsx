import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, formatYen } from "@/lib/format";

export function AdminOrdersTable({
  orders,
}: {
  orders: Array<{
    id: string;
    order_number: string;
    customer_email: string;
    customer_name?: string | null;
    mode: string;
    fulfillment_status: string;
    payment_status: string;
    total_amount: number;
    created_at: string;
    order_items: Array<{
      product_name: string;
      variant_label: string;
      quantity: number;
    }>;
  }>;
}) {
  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-[#6f6156]">
            まだ注文がありません。
          </CardContent>
        </Card>
      ) : (
        orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-xl">{order.order_number}</CardTitle>
                <Badge variant="subtle">{order.payment_status}</Badge>
                <Badge variant={order.fulfillment_status === "shipped" ? "success" : "warm"}>
                  {order.fulfillment_status === "shipped" ? "発送済み" : "未発送"}
                </Badge>
              </div>
              <div className="text-sm text-[#6f6156]">
                {order.customer_name || "-"} / {order.customer_email} / {order.mode}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-[#6f6156]">
                {order.order_items.map((item, index) => (
                  <div key={`${item.product_name}-${index}`}>
                    {item.product_name} / {item.variant_label} × {item.quantity}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-[#6f6156]">
                  {formatDateTime(order.created_at)} / {formatYen(order.total_amount)}
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin?order=${order.order_number}`}>詳細</Link>
                  </Button>
                  {order.fulfillment_status !== "shipped" ? (
                    <form action={`/api/admin/orders/${order.id}/ship`} method="post">
                      <Button type="submit" size="sm">
                        発送済みにする
                      </Button>
                    </form>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

