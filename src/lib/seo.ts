import type { Metadata } from "next";
import { SITE } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/env";

export function buildMetadata(options?: Partial<Metadata>): Metadata {
  const url = getSiteUrl();
  const defaults: Metadata = {
    metadataBase: new URL(url),
    title: {
      default: SITE.name,
      template: `%s | ${SITE.name}`,
    },
    description: SITE.description,
    openGraph: {
      title: SITE.name,
      description: SITE.description,
      url,
      siteName: SITE.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: SITE.name,
      description: SITE.description,
    },
  };
  const { openGraph, twitter, ...rest } = options || {};

  return {
    ...defaults,
    ...rest,
    openGraph: {
      ...(defaults.openGraph as NonNullable<Metadata["openGraph"]>),
      ...(openGraph || {}),
    },
    twitter: {
      ...(defaults.twitter as NonNullable<Metadata["twitter"]>),
      ...(twitter || {}),
    },
  };
}

export function buildJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data);
}

export function productJsonLd({
  name,
  description,
  url,
  price,
  currency = "JPY",
}: {
  name: string;
  description: string;
  url: string;
  price: number;
  currency?: string;
}) {
  return buildJsonLd({
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
    },
  });
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return buildJsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  });
}

export function articleJsonLd({
  headline,
  description,
  url,
  datePublished,
  dateModified,
}: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
}) {
  return buildJsonLd({
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
    },
  });
}
