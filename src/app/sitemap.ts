import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { getBlogPosts } from "@/lib/blog";
import { getSiteUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const posts = await getBlogPosts();

  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/diagnosis`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/cart`,
      changeFrequency: "daily",
      priority: 0.5,
    },
    ...getProducts().map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

