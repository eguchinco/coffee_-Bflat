# Bflat Coffee MVP

`Bflat (B♭)` のコーヒー豆サブスク EC の MVP です。

## 構成

- Frontend: Next.js App Router + Tailwind CSS + shadcn/ui
- Payment: Stripe Checkout / Subscriptions
- DB: Supabase
- Email: Resend
- Blog: microCMS

## ローカル起動

```bash
npm install
npm run dev
```

## 必要な環境変数

`.env.example` を元に設定してください。

特に重要なのは以下です。

- `NEXT_PUBLIC_SITE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_MAP`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM`
- `ADMIN_SHARED_SECRET`
- `ADMIN_SESSION_SECRET`
- `ADMIN_NOTIFICATION_EMAIL`
- `GA_MEASUREMENT_ID`

## Stripe price map

`STRIPE_PRICE_MAP` は JSON 文字列です。

```json
{
  "bright-morning": {
    "100g-beans": {
      "one_time": "price_xxx",
      "two_weeks": "price_xxx",
      "one_month": "price_xxx"
    }
  }
}
```

`one_time`, `two_weeks`, `one_month` の 3 価格を各バリエーションに割り当てます。

## Supabase

`supabase/migrations/0001_init.sql` を適用すると、テーブルと初期データが作成されます。

## デプロイ

最安で始めるならこの構成です。

- Hosting: Vercel Hobby
- DB: Supabase Free
- Email: Resend Free
- CMS: microCMS は後回しでも可

手順は以下です。

1. GitHub に push する。
2. Vercel で repo を Import する。
3. Vercel の Environment Variables に `.env.example` を反映する。
4. Supabase で project を作り、`supabase/migrations/0001_init.sql` を SQL Editor で実行する。
5. Stripe で test mode の product / price を作成し、`STRIPE_PRICE_MAP` に price id を入れる。
6. Stripe Webhook を `https://<your-domain>/api/webhooks/stripe` に設定する。
7. Resend で送信元ドメインを認証して `RESEND_FROM` を設定する。
8. `npm run build` が通ることを確認してから、Vercel の Production に promote する。

Stripe の webhook は少なくとも以下を有効にします。

- `checkout.session.completed`
- `invoice.paid`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## 運用

- `/admin` で注文と発送を管理する。
- `/diagnosis` から診断結果をそのまま購入に繋げる。
- `/blog` は microCMS の記事を優先し、未設定時は `content/blog` を使う。
- 管理画面は `ADMIN_SHARED_SECRET` と `ADMIN_SESSION_SECRET` で保護する。
- 発送通知は手動で送る。
