import { cache } from "react";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { createClient } from "microcms-js-sdk";
import { hasMicroCmsSecrets } from "@/lib/env";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  bodyBlocks: string[];
  publishedAt: string;
  updatedAt?: string;
  category: string;
  coverLabel: string;
}

type MicrocmsPost = {
  slug?: string;
  title?: string;
  excerpt?: string;
  body?: string;
  content?: string;
  publishedAt?: string;
  updatedAt?: string;
  category?: string;
  coverLabel?: string;
};

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function toBlocks(value: string) {
  return value
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

async function loadLocalBlogPosts(): Promise<BlogPost[]> {
  try {
    const files = await fs.readdir(BLOG_DIR);
    const posts = await Promise.all(
      files
        .filter((file) => file.endsWith(".md"))
        .map(async (file) => {
          const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf8");
          const { data, content } = matter(raw);
          const slug = String(data.slug || file.replace(/\.md$/, ""));

          return {
            slug,
            title: String(data.title || slug),
            excerpt: String(data.excerpt || ""),
            bodyBlocks: toBlocks(content),
            publishedAt: String(data.publishedAt || new Date().toISOString()),
            updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
            category: String(data.category || "コーヒーの基礎"),
            coverLabel: String(data.coverLabel || "Bflat"),
          } satisfies BlogPost;
        })
    );

    return posts.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch {
    return [];
  }
}

async function loadMicrocmsBlogPosts(): Promise<BlogPost[]> {
  if (!hasMicroCmsSecrets()) {
    return [];
  }

  try {
    const client = createClient({
      serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN as string,
      apiKey: process.env.MICROCMS_API_KEY as string,
    });

    const endpoint = process.env.MICROCMS_ENDPOINT || "blog";
    const response = await client.getList<MicrocmsPost>({ endpoint, queries: { limit: 100 } });

    return response.contents
      .map((post) => ({
        slug: post.slug || "",
        title: post.title || "",
        excerpt: post.excerpt || "",
        bodyBlocks: toBlocks(post.body || post.content || ""),
        publishedAt: post.publishedAt || new Date().toISOString(),
        updatedAt: post.updatedAt,
        category: post.category || "コーヒーの基礎",
        coverLabel: post.coverLabel || "Bflat",
      }))
      .filter((post) => post.slug && post.title)
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  } catch {
    return [];
  }
}

export const getBlogPosts = cache(async () => {
  const remote = await loadMicrocmsBlogPosts();

  if (remote.length > 0) {
    return remote;
  }

  return loadLocalBlogPosts();
});

export const getBlogPostBySlug = cache(async (slug: string) => {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
});
