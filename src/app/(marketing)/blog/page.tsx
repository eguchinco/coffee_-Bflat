import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBlogPosts } from "@/lib/blog";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "ブログ",
  description: "コーヒーの基礎、サブスクの考え方、運用メモ。",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Button variant="ghost" asChild className="px-0">
        <Link href="/">
          <ArrowLeft className="size-4" />
          ホームへ戻る
        </Link>
      </Button>
      <div className="mt-6 space-y-4">
        <Badge variant="warm">Blog</Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-[#17110d]">コーヒーの基礎と運用メモ</h1>
        <p className="max-w-2xl text-base leading-8 text-[#6f6156]">
          microCMS が入る前でも読めるように、ローカルの下書き記事をフォールバックにしています。
        </p>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {posts.map((post) => (
          <Card key={post.slug}>
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#a67a57]">
                <CalendarDays className="size-4" />
                {formatDateTime(post.publishedAt)}
              </div>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-7 text-[#6f6156]">{post.excerpt}</p>
              <Button asChild variant="outline">
                <Link href={`/blog/${post.slug}`}>読む</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

