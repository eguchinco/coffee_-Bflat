import { SITE } from "@/lib/catalog";
import { formatDateTime, formatYen, htmlEscape } from "@/lib/format";

type EmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
};

function shell(title: string, body: string) {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; background:#faf7f2; padding:32px; color:#1f1a17">
      <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e8dfd5;border-radius:24px;overflow:hidden">
        <div style="padding:24px 28px;background:linear-gradient(135deg,#1f1a17,#5f4a3b);color:#fff">
          <div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;opacity:.8">${SITE.name}</div>
          <h1 style="margin:8px 0 0;font-size:28px;line-height:1.2">${htmlEscape(title)}</h1>
        </div>
        <div style="padding:28px">${body}</div>
      </div>
    </div>
  `;
}

export function buildOrderConfirmationEmail({
  customerName,
  orderNumber,
  items,
  totalAmount,
  orderUrl,
}: {
  customerName: string;
  orderNumber: string;
  items: { name: string; label: string; quantity: number }[];
  totalAmount: number;
  orderUrl: string;
}): EmailPayload {
  const list = items
    .map(
      (item) =>
        `<li style="margin:0 0 8px">${htmlEscape(item.name)} / ${htmlEscape(
          item.label
        )} × ${item.quantity}</li>`
    )
    .join("");

  const html = shell(
    `${customerName}さん、ご注文ありがとうございます`,
    `
      <p style="margin:0 0 16px">注文番号 <strong>${htmlEscape(orderNumber)}</strong> を受け付けました。</p>
      <p style="margin:0 0 16px">ご注文内容</p>
      <ul style="padding-left:18px;margin:0 0 20px">${list}</ul>
      <p style="margin:0 0 16px">合計: <strong>${formatYen(totalAmount)}</strong></p>
      <p style="margin:0 0 24px">発送状況や注文詳細は以下から確認できます。</p>
      <a href="${orderUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#1f1a17;color:#fff;text-decoration:none">注文を見る</a>
    `
  );

  return {
    to: "",
    subject: `${SITE.name} ご注文完了: ${orderNumber}`,
    html,
    text: `${customerName}さん、ご注文ありがとうございます。注文番号 ${orderNumber}、合計 ${formatYen(
      totalAmount
    )}。`,
  };
}

export function buildAdminOrderNotificationEmail({
  orderNumber,
  customerEmail,
  customerName,
  totalAmount,
  mode,
  createdAt,
}: {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  mode: string;
  createdAt: string;
}): EmailPayload {
  const html = shell(
    `新規注文 ${orderNumber}`,
    `
      <p style="margin:0 0 12px">管理画面で確認してください。</p>
      <ul style="padding-left:18px;margin:0">
        <li>注文番号: ${htmlEscape(orderNumber)}</li>
        <li>顧客: ${htmlEscape(customerName)} / ${htmlEscape(customerEmail)}</li>
        <li>モード: ${htmlEscape(mode)}</li>
        <li>合計: ${formatYen(totalAmount)}</li>
        <li>日時: ${htmlEscape(formatDateTime(createdAt))}</li>
      </ul>
    `
  );

  return {
    to: "",
    subject: `${SITE.name} 新規注文: ${orderNumber}`,
    html,
    text: `新規注文 ${orderNumber} / ${customerName} / ${customerEmail} / ${formatYen(
      totalAmount
    )}`,
  };
}

export function buildShipmentEmail({
  customerName,
  orderNumber,
  trackingNumber,
  carrier,
  orderUrl,
}: {
  customerName: string;
  orderNumber: string;
  trackingNumber?: string | null;
  carrier?: string | null;
  orderUrl: string;
}): EmailPayload {
  const html = shell(
    `${customerName}さん、発送しました`,
    `
      <p style="margin:0 0 16px">注文番号 <strong>${htmlEscape(orderNumber)}</strong> を発送済みに更新しました。</p>
      ${
        trackingNumber
          ? `<p style="margin:0 0 16px">追跡番号: ${htmlEscape(trackingNumber)}${carrier ? ` / ${htmlEscape(carrier)}` : ""}</p>`
          : ""
      }
      <p style="margin:0 0 24px">注文の詳細はこちらから確認できます。</p>
      <a href="${orderUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#1f1a17;color:#fff;text-decoration:none">注文を見る</a>
    `
  );

  return {
    to: "",
    subject: `${SITE.name} 発送完了: ${orderNumber}`,
    html,
    text: `${customerName}さんの注文 ${orderNumber} を発送しました。`,
  };
}

export function buildLeadNotificationEmail({
  email,
  name,
  source,
  interest,
}: {
  email: string;
  name?: string | null;
  source?: string | null;
  interest?: string | null;
}): EmailPayload {
  const html = shell(
    "新しいリード獲得",
    `
      <ul style="padding-left:18px;margin:0">
        <li>Email: ${htmlEscape(email)}</li>
        <li>Name: ${htmlEscape(name || "-")}</li>
        <li>Source: ${htmlEscape(source || "-")}</li>
        <li>Interest: ${htmlEscape(interest || "-")}</li>
      </ul>
    `
  );

  return {
    to: "",
    subject: `${SITE.name} リード獲得`,
    html,
    text: `${email} / ${name || "-"} / ${source || "-"} / ${interest || "-"}`,
  };
}

