import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import { buildMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = buildMetadata({
  title: {
    default: "Bflat",
    template: "%s | Bflat",
  },
  description:
    "コーヒー初心者でも選びやすい、診断ベースのサブスクECサイト。",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#fbf7f1] text-[#17110d]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
