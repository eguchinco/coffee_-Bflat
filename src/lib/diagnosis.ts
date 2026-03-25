import {
  getProducts,
  getVariantBySlug,
  type Grind,
  type PurchaseMode,
  type RoastLevel,
  type SubscriptionInterval,
} from "@/lib/catalog";

export type DiagnosisTaste = "bright" | "balanced" | "deep";
export type DiagnosisGrind = "beans" | "ground" | "not_sure";
export type DiagnosisVolume = "light" | "medium" | "heavy";

export interface DiagnosisAnswers {
  taste: DiagnosisTaste;
  grind: DiagnosisGrind;
  volume: DiagnosisVolume;
}

export interface DiagnosisResult {
  primary: {
    productSlug: string;
    productName: string;
    variantSlug: string;
    variantLabel: string;
    roastLevel: RoastLevel;
    grind: Grind;
    sizeGrams: 100 | 200;
    purchaseMode: PurchaseMode;
    subscriptionInterval: SubscriptionInterval;
    explanation: string;
  };
  alternate: {
    productSlug: string;
    productName: string;
    variantSlug: string;
    variantLabel: string;
    explanation: string;
  };
  summary: string;
}

const roastScores: Record<DiagnosisTaste, Record<RoastLevel, number>> = {
  bright: { light: 3, medium: 1, dark: 0 },
  balanced: { light: 1, medium: 3, dark: 1 },
  deep: { light: 0, medium: 1, dark: 3 },
};

function scoreProducts(taste: DiagnosisTaste) {
  const scores = getProducts().map((product) => ({
    product,
    score: roastScores[taste][product.roastLevel],
  }));

  return scores.sort((a, b) => b.score - a.score);
}

function mapGrind(answer: DiagnosisGrind): Grind {
  if (answer === "ground") {
    return "ground";
  }

  return "beans";
}

function mapSize(volume: DiagnosisVolume): 100 | 200 {
  if (volume === "light") {
    return 100;
  }

  return 200;
}

function mapInterval(volume: DiagnosisVolume): SubscriptionInterval {
  if (volume === "heavy") {
    return "two_weeks";
  }

  return "one_month";
}

function getVariantSlug(size: 100 | 200, grind: Grind) {
  return `${size}g-${grind}`;
}

export function diagnoseCoffee(answers: DiagnosisAnswers): DiagnosisResult {
  const scored = scoreProducts(answers.taste);
  const primaryProduct = scored[0]?.product || getProducts()[1];
  const alternateProduct =
    scored[1]?.product ||
    getProducts().find((product) => product.slug !== primaryProduct.slug) ||
    primaryProduct;

  const grind = mapGrind(answers.grind);
  const size = mapSize(answers.volume);
  const interval = mapInterval(answers.volume);
  const primaryVariant = getVariantBySlug(
    primaryProduct.slug,
    getVariantSlug(size, grind)
  ) || primaryProduct.variants[0];
  const alternateVariant =
    getVariantBySlug(alternateProduct.slug, getVariantSlug(size, grind)) ||
    alternateProduct.variants[0];

  return {
    primary: {
      productSlug: primaryProduct.slug,
      productName: primaryProduct.name,
      variantSlug: primaryVariant.slug,
      variantLabel: primaryVariant.label,
      roastLevel: primaryProduct.roastLevel,
      grind: primaryVariant.grind,
      sizeGrams: primaryVariant.sizeGrams,
      purchaseMode: "subscription",
      subscriptionInterval: interval,
      explanation:
        answers.taste === "bright"
          ? "軽やかな香りと明るい酸味を優先しました。"
          : answers.taste === "balanced"
            ? "毎日飲みやすいバランスを優先しました。"
            : "コクと余韻をしっかり楽しめる方向で選びました。",
    },
    alternate: {
      productSlug: alternateProduct.slug,
      productName: alternateProduct.name,
      variantSlug: alternateVariant.slug,
      variantLabel: alternateVariant.label,
      explanation: "好みに少し寄せた次点候補です。",
    },
    summary: `${primaryProduct.name} の ${primaryVariant.label} を、${interval === "two_weeks" ? "2週間ごと" : "1ヶ月ごと"}の定期便で始めるのが最適です。`,
  };
}
