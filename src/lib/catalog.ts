import { getSiteUrl } from "@/lib/env";

export type RoastLevel = "light" | "medium" | "dark";
export type Grind = "beans" | "ground";
export type PurchaseMode = "one_time" | "subscription";
export type SubscriptionInterval = "two_weeks" | "one_month";

type StripePriceIds = {
  one_time?: string;
  two_weeks?: string;
  one_month?: string;
};

export interface VariantPricing {
  oneTime: number;
  subscriptionTwoWeeks: number;
  subscriptionOneMonth: number;
  stripePriceIds: StripePriceIds;
}

export interface ProductVariant {
  slug: string;
  label: string;
  sizeGrams: 100 | 200;
  grind: Grind;
  sku: string;
  pricing: VariantPricing;
}

export interface Product {
  slug: string;
  name: string;
  roastLevel: RoastLevel;
  shortDescription: string;
  story: string;
  storyPoints: string[];
  notes: string[];
  recommendation: string;
  heroPhrase: string;
  imageAlt: string;
  variants: ProductVariant[];
}

type StripePriceMap = Record<string, Record<string, StripePriceIds>>;

const BASE_PRODUCTS: Omit<Product, "variants">[] = [
  {
    slug: "bright-morning",
    name: "Bright Morning",
    roastLevel: "light",
    shortDescription: "柑橘系の香りと、朝に飲みやすい軽やかさ。",
    story:
      "迷ったらここから。コーヒー初心者でも飲みやすい、明るい酸味と澄んだ後味を軸にした一杯です。",
    storyPoints: ["果実感がある", "ミルクなしでも飲みやすい", "朝の一杯を軽くする"],
    notes: ["柑橘", "白い花", "すっきり"],
    recommendation: "浅煎り派、フルーティな香りが好きな人向け。",
    heroPhrase: "軽やかで、朝にちょうどいい。",
    imageAlt: "浅煎りコーヒーの軽やかなパッケージイメージ",
  },
  {
    slug: "daily-balance",
    name: "Daily Balance",
    roastLevel: "medium",
    shortDescription: "甘さ・香り・コクのバランスが取れた王道ブレンド。",
    story:
      "毎日飲んでも飽きにくい、もっとも汎用性の高い中心ポジション。初めての定期便にも向いています。",
    storyPoints: ["甘さと香りのバランス", "ホットもアイスも合う", "家族でもシェアしやすい"],
    notes: ["キャラメル", "ナッツ", "やさしい甘み"],
    recommendation: "迷ったらこれ。万人向けで失敗しにくい中煎り。",
    heroPhrase: "まずは定番。毎日飲みやすい。",
    imageAlt: "中煎りコーヒーのバランスのよいパッケージイメージ",
  },
  {
    slug: "deep-evening",
    name: "Deep Evening",
    roastLevel: "dark",
    shortDescription: "しっかりしたコクと、夜に合う落ち着いた余韻。",
    story:
      "深煎りの厚みを前面に出しつつ、苦味だけに寄せない設計。ラテやデザートとも合わせやすい味です。",
    storyPoints: ["ミルクと相性がいい", "しっかりした飲みごたえ", "夜のリラックス時間向け"],
    notes: ["ビターチョコ", "ロースト", "余韻"],
    recommendation: "深煎り好き、ラテ用、夜に飲む人向け。",
    heroPhrase: "濃くて、落ち着く。",
    imageAlt: "深煎りコーヒーの落ち着いたパッケージイメージ",
  },
];

const SIZE_PRICE_MATRIX = {
  100: {
    oneTime: 1680,
    subscriptionTwoWeeks: 1480,
    subscriptionOneMonth: 1480,
  },
  200: {
    oneTime: 2980,
    subscriptionTwoWeeks: 2680,
    subscriptionOneMonth: 2680,
  },
} as const;

function buildStripePriceMap(): StripePriceMap {
  const raw = process.env.STRIPE_PRICE_MAP;

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as StripePriceMap;
    return parsed;
  } catch {
    return {};
  }
}

function buildVariants(productSlug: string): ProductVariant[] {
  const stripePriceMap = buildStripePriceMap();
  const sizeVariants: Array<{ sizeGrams: 100 | 200; grind: Grind }> = [
    { sizeGrams: 100, grind: "beans" },
    { sizeGrams: 100, grind: "ground" },
    { sizeGrams: 200, grind: "beans" },
    { sizeGrams: 200, grind: "ground" },
  ];

  return sizeVariants.map((entry) => {
    const slug = `${entry.sizeGrams}g-${entry.grind}`;
    const label = `${entry.sizeGrams}g / ${entry.grind === "beans" ? "豆" : "粉"}`;
    const pricing = SIZE_PRICE_MATRIX[entry.sizeGrams];
    return {
      slug,
      label,
      sizeGrams: entry.sizeGrams,
      grind: entry.grind,
      sku: `${productSlug.slice(0, 2).toUpperCase()}-${entry.sizeGrams}-${entry.grind === "beans" ? "B" : "G"}`,
      pricing: {
        oneTime: pricing.oneTime,
        subscriptionTwoWeeks: pricing.subscriptionTwoWeeks,
        subscriptionOneMonth: pricing.subscriptionOneMonth,
        stripePriceIds:
          stripePriceMap[productSlug]?.[slug] ??
          {},
      },
    };
  });
}

export const PRODUCTS: Product[] = BASE_PRODUCTS.map((product) => ({
  ...product,
  variants: buildVariants(product.slug),
}));

export const SITE = {
  name: "Bflat",
  description:
    "Bflat (B♭) のコーヒー初心者でも選びやすい、診断ベースのサブスクECサイト。",
  url: getSiteUrl(),
  email: "hello@example.com",
};

export function getProducts() {
  return PRODUCTS;
}

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug) || null;
}

export function getVariantBySlug(productSlug: string, variantSlug: string) {
  const product = getProductBySlug(productSlug);

  if (!product) {
    return null;
  }

  return product.variants.find((variant) => variant.slug === variantSlug) || null;
}

export function getProductPricingSummary(product: Product) {
  const amounts = product.variants.map((variant) => variant.pricing);
  const minOneTime = Math.min(...amounts.map((price) => price.oneTime));
  const minSubscription = Math.min(
    ...amounts.map((price) => price.subscriptionTwoWeeks)
  );

  return {
    minOneTime,
    minSubscription,
  };
}

export function getProductPath(productSlug: string) {
  return `${SITE.url}/products/${productSlug}`;
}

export function getVariantPriceId(
  productSlug: string,
  variantSlug: string,
  mode: PurchaseMode,
  interval?: SubscriptionInterval
) {
  const variant = getVariantBySlug(productSlug, variantSlug);

  if (!variant) {
    return null;
  }

  if (mode === "one_time") {
    return variant.pricing.stripePriceIds.one_time ?? null;
  }

  if (interval === "one_month") {
    return variant.pricing.stripePriceIds.one_month ?? null;
  }

  return variant.pricing.stripePriceIds.two_weeks ?? null;
}

export function getVariantAmount(
  productSlug: string,
  variantSlug: string,
  mode: PurchaseMode,
  interval?: SubscriptionInterval
) {
  const variant = getVariantBySlug(productSlug, variantSlug);

  if (!variant) {
    return null;
  }

  if (mode === "one_time") {
    return variant.pricing.oneTime;
  }

  if (interval === "one_month") {
    return variant.pricing.subscriptionOneMonth;
  }

  return variant.pricing.subscriptionTwoWeeks;
}

export function getAdjacentProductSlugs(roastLevel: RoastLevel) {
  const order: RoastLevel[] = ["light", "medium", "dark"];
  const index = order.indexOf(roastLevel);
  return {
    previous: order[Math.max(index - 1, 0)],
    next: order[Math.min(index + 1, order.length - 1)],
  };
}
