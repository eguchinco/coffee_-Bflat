import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { articleJsonLd, buildMetadata } from "@/lib/seo";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/blog";
import { formatDateTime } from "@/lib/format";
import { getSiteUrl } from "@/lib/env";

type Params = { slug: string };
type PageProps = { params: Promise<Params> };

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "記事が見つかりません",
    };
  }

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <JsonLd
        data={articleJsonLd({
          headline: post.title,
          description: post.excerpt,
          url: `${getSiteUrl()}/blog/${post.slug}`,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
        })}
      />
      <Button variant="ghost" asChild className="px-0">
        <Link href="/blog">
          <ArrowLeft className="size-4" />
          一覧へ戻る
        </Link>
      </Button>
      <article className="mt-6 space-y-6">
        <Badge variant="warm">{post.category}</Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-[#17110d]">{post.title}</h1>
        <div className="flex items-center gap-2 text-sm text-[#8d7d71]">
          <CalendarDays className="size-4" />
          {formatDateTime(post.publishedAt)}
        </div>
        <Card>
          <CardContent className="space-y-5 p-6 text-base leading-8 text-[#5f5147]">
            <p className="text-[#17110d]">{post.excerpt}</p>
            {post.bodyBlocks.map((block) => (
              <p key={block}>{block}</p>
            ))}
          </CardContent>
        </Card>
      </article>
    </div>
  );
}
