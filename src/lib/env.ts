const DEFAULT_SITE_URL = "http://localhost:3000";

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
}

export function hasStripeSecrets() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
}

export function getStripeWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET || "";
}

export function hasSupabaseSecrets() {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function hasResendSecrets() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}

export function hasMicroCmsSecrets() {
  return Boolean(
    process.env.MICROCMS_SERVICE_DOMAIN && process.env.MICROCMS_API_KEY
  );
}

export function getAdminSecret() {
  return process.env.ADMIN_SHARED_SECRET || "";
}

export function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SHARED_SECRET || "";
}

export function getAdminNotificationEmail() {
  return process.env.ADMIN_NOTIFICATION_EMAIL || process.env.RESEND_FROM || "";
}

export function getMicrocmsEndpoint() {
  return process.env.MICROCMS_ENDPOINT || "blog";
}
