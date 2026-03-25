export function formatYen(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(typeof value === "string" ? new Date(value) : value);
}

export function formatRelativeDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  const diffDays = Math.round(
    (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return "今日";
  }

  if (diffDays > 0) {
    return `${diffDays}日後`;
  }

  return `${Math.abs(diffDays)}日前`;
}

export function htmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

