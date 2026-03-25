create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  roast_level text not null check (roast_level in ('light', 'medium', 'dark')),
  short_description text not null,
  story text not null,
  story_points text[] not null default '{}'::text[],
  notes text[] not null default '{}'::text[],
  recommendation text not null,
  hero_phrase text not null,
  image_alt text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  slug text not null,
  label text not null,
  size_grams integer not null check (size_grams in (100, 200)),
  grind text not null check (grind in ('beans', 'ground')),
  sku text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, slug)
);

create table if not exists public.variant_prices (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  purchase_mode text not null check (purchase_mode in ('one_time', 'subscription')),
  subscription_interval text null check (subscription_interval in ('two_weeks', 'one_month')),
  currency text not null default 'JPY',
  amount integer not null,
  stripe_price_id text unique,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (variant_id, purchase_mode, subscription_interval)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text null,
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  customer_email text not null,
  customer_name text null,
  mode text not null check (mode in ('one_time', 'subscription')),
  subscription_interval text null check (subscription_interval in ('two_weeks', 'one_month')),
  status text not null default 'confirmed',
  fulfillment_status text not null default 'unshipped' check (fulfillment_status in ('unshipped', 'shipped')),
  payment_status text not null default 'paid' check (payment_status in ('paid', 'demo', 'pending', 'failed', 'refunded')),
  subtotal_amount integer not null default 0,
  discount_amount integer not null default 0,
  total_amount integer not null default 0,
  currency text not null default 'JPY',
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  stripe_subscription_id text,
  shipping_address jsonb,
  tracking_number text,
  carrier text,
  shipped_at timestamptz,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  variant_slug text not null,
  variant_label text not null,
  quantity integer not null default 1,
  unit_amount integer not null,
  mode text not null check (mode in ('one_time', 'subscription')),
  subscription_interval text null check (subscription_interval in ('two_weeks', 'one_month')),
  created_at timestamptz not null default now()
);

create table if not exists public.subscription_contracts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  customer_email text null,
  customer_name text null,
  stripe_subscription_id text not null unique,
  subscription_interval text not null check (subscription_interval in ('two_weeks', 'one_month')),
  status text not null default 'active',
  cancel_at_period_end boolean not null default false,
  current_period_end timestamptz null,
  items_snapshot jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.diagnosis_sessions (
  id uuid primary key default gen_random_uuid(),
  email text null,
  name text null,
  source text null,
  answers jsonb not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.lead_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text null,
  source text null,
  interest text null,
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.webhook_events (
  id text primary key,
  type text not null,
  payload jsonb not null,
  processed_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.variant_prices enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.subscription_contracts enable row level security;
alter table public.diagnosis_sessions enable row level security;
alter table public.lead_signups enable row level security;
alter table public.webhook_events enable row level security;

create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger set_product_variants_updated_at
before update on public.product_variants
for each row execute function public.set_updated_at();

create trigger set_variant_prices_updated_at
before update on public.variant_prices
for each row execute function public.set_updated_at();

create trigger set_customers_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create trigger set_subscription_contracts_updated_at
before update on public.subscription_contracts
for each row execute function public.set_updated_at();

create trigger set_lead_signups_updated_at
before update on public.lead_signups
for each row execute function public.set_updated_at();

create or replace function public.claim_webhook_event(
  p_event_id text,
  p_event_type text,
  p_payload jsonb
)
returns boolean
language plpgsql
security definer
as $$
declare
  inserted_id text;
begin
  insert into public.webhook_events (id, type, payload)
  values (p_event_id, p_event_type, p_payload)
  on conflict (id) do nothing
  returning id into inserted_id;

  return inserted_id is not null;
end;
$$;

insert into public.products (slug, name, roast_level, short_description, story, story_points, notes, recommendation, hero_phrase, image_alt, sort_order)
values
  (
    'bright-morning',
    'Bright Morning',
    'light',
    '柑橘系の香りと、朝に飲みやすい軽やかさ。',
    '迷ったらここから。コーヒー初心者でも飲みやすい、明るい酸味と澄んだ後味を軸にした一杯です。',
    array['果実感がある', 'ミルクなしでも飲みやすい', '朝の一杯を軽くする'],
    array['柑橘', '白い花', 'すっきり'],
    '浅煎り派、フルーティな香りが好きな人向け。',
    '軽やかで、朝にちょうどいい。',
    '浅煎りコーヒーの軽やかなパッケージイメージ',
    1
  ),
  (
    'daily-balance',
    'Daily Balance',
    'medium',
    '甘さ・香り・コクのバランスが取れた王道ブレンド。',
    '毎日飲んでも飽きにくい、もっとも汎用性の高い中心ポジション。初めての定期便にも向いています。',
    array['甘さと香りのバランス', 'ホットもアイスも合う', '家族でもシェアしやすい'],
    array['キャラメル', 'ナッツ', 'やさしい甘み'],
    '迷ったらこれ。万人向けで失敗しにくい中煎り。',
    'まずは定番。毎日飲みやすい。',
    '中煎りコーヒーのバランスのよいパッケージイメージ',
    2
  ),
  (
    'deep-evening',
    'Deep Evening',
    'dark',
    'しっかりしたコクと、夜に合う落ち着いた余韻。',
    '深煎りの厚みを前面に出しつつ、苦味だけに寄せない設計。ラテやデザートとも合わせやすい味です。',
    array['ミルクと相性がいい', 'しっかりした飲みごたえ', '夜のリラックス時間向け'],
    array['ビターチョコ', 'ロースト', '余韻'],
    '深煎り好き、ラテ用、夜に飲む人向け。',
    '濃くて、落ち着く。',
    '深煎りコーヒーの落ち着いたパッケージイメージ',
    3
  )
on conflict (slug) do update set
  name = excluded.name,
  roast_level = excluded.roast_level,
  short_description = excluded.short_description,
  story = excluded.story,
  story_points = excluded.story_points,
  notes = excluded.notes,
  recommendation = excluded.recommendation,
  hero_phrase = excluded.hero_phrase,
  image_alt = excluded.image_alt,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.product_variants (product_id, slug, label, size_grams, grind, sku, sort_order)
select
  p.id,
  v.slug,
  v.label,
  v.size_grams,
  v.grind,
  v.sku,
  v.sort_order
from (
  values
    ('bright-morning', '100g-beans', '100g / 豆', 100, 'beans', 'BR-100-B', 1),
    ('bright-morning', '100g-ground', '100g / 粉', 100, 'ground', 'BR-100-G', 2),
    ('bright-morning', '200g-beans', '200g / 豆', 200, 'beans', 'BR-200-B', 3),
    ('bright-morning', '200g-ground', '200g / 粉', 200, 'ground', 'BR-200-G', 4),
    ('daily-balance', '100g-beans', '100g / 豆', 100, 'beans', 'DB-100-B', 1),
    ('daily-balance', '100g-ground', '100g / 粉', 100, 'ground', 'DB-100-G', 2),
    ('daily-balance', '200g-beans', '200g / 豆', 200, 'beans', 'DB-200-B', 3),
    ('daily-balance', '200g-ground', '200g / 粉', 200, 'ground', 'DB-200-G', 4),
    ('deep-evening', '100g-beans', '100g / 豆', 100, 'beans', 'DE-100-B', 1),
    ('deep-evening', '100g-ground', '100g / 粉', 100, 'ground', 'DE-100-G', 2),
    ('deep-evening', '200g-beans', '200g / 豆', 200, 'beans', 'DE-200-B', 3),
    ('deep-evening', '200g-ground', '200g / 粉', 200, 'ground', 'DE-200-G', 4)
) as v(product_slug, slug, label, size_grams, grind, sku, sort_order)
join public.products p on p.slug = v.product_slug
on conflict (product_id, slug) do update set
  label = excluded.label,
  size_grams = excluded.size_grams,
  grind = excluded.grind,
  sku = excluded.sku,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.variant_prices (variant_id, purchase_mode, subscription_interval, currency, amount, stripe_price_id, active)
select pv.id, 'one_time', null, 'JPY',
  case when pv.size_grams = 100 then 1680 else 2980 end,
  null,
  true
from public.product_variants pv
on conflict (variant_id, purchase_mode, subscription_interval) do update set
  currency = excluded.currency,
  amount = excluded.amount,
  active = excluded.active,
  updated_at = now();

insert into public.variant_prices (variant_id, purchase_mode, subscription_interval, currency, amount, stripe_price_id, active)
select pv.id, 'subscription', 'two_weeks', 'JPY',
  case when pv.size_grams = 100 then 1480 else 2680 end,
  null,
  true
from public.product_variants pv
on conflict (variant_id, purchase_mode, subscription_interval) do update set
  currency = excluded.currency,
  amount = excluded.amount,
  active = excluded.active,
  updated_at = now();

insert into public.variant_prices (variant_id, purchase_mode, subscription_interval, currency, amount, stripe_price_id, active)
select pv.id, 'subscription', 'one_month', 'JPY',
  case when pv.size_grams = 100 then 1480 else 2680 end,
  null,
  true
from public.product_variants pv
on conflict (variant_id, purchase_mode, subscription_interval) do update set
  currency = excluded.currency,
  amount = excluded.amount,
  active = excluded.active,
  updated_at = now();

