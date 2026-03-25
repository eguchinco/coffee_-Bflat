import { NextResponse } from "next/server";
import { buildShipmentEmail } from "@/lib/email";
import { getEmailReturnUrl, sendEmail } from "@/lib/mailer";
import { isAdminAuthed } from "@/lib/auth";
import { getOrderById, markOrderShipped } from "@/lib/db";

export const runtime = "nodejs";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: RouteProps) {
  if (!(await isAdminAuthed())) {
    return NextResponse.redirect(new URL("/admin?error=auth", request.url));
  }

  const { id } = await params;
  const formData = await request.formData();
  const trackingNumber = String(formData.get("trackingNumber") || "").trim() || null;
  const carrier = String(formData.get("carrier") || "").trim() || null;

  const order = await getOrderById(id);

  if (!order) {
    return NextResponse.redirect(new URL("/admin?error=notfound", request.url));
  }

  await markOrderShipped({
    orderId: id,
    trackingNumber,
    carrier,
  });

  const shipmentEmail = buildShipmentEmail({
    customerName: order.customer_name || order.customer_email,
    orderNumber: order.order_number,
    trackingNumber,
    carrier,
    orderUrl: getEmailReturnUrl("/checkout/success"),
  });

  await sendEmail({
    to: order.customer_email,
    subject: shipmentEmail.subject,
    html: shipmentEmail.html,
    text: shipmentEmail.text,
  });

  return NextResponse.redirect(new URL("/admin?shipped=1", request.url));
}
