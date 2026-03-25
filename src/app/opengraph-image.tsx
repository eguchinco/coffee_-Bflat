import { ImageResponse } from "next/og";
import { SITE } from "@/lib/catalog";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "stretch",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #fffaf4 0%, #f7eadb 55%, #17110d 100%)",
          color: "#17110d",
          padding: 56,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 700 }}>
          <div
            style={{
              display: "inline-flex",
              padding: "10px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.85)",
              fontSize: 24,
              fontWeight: 700,
              width: "fit-content",
            }}
          >
            {SITE.name}
          </div>
          <div style={{ fontSize: 74, fontWeight: 700, lineHeight: 1.02 }}>
            毎日のコーヒーを、
            <br />
            迷わず始める。
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: "#4e4036" }}>
            診断ベースのサブスクEC。初心者でも選びやすい、送料込みの日本国内向け MVP。
          </div>
        </div>

        <div
          style={{
            width: 340,
            borderRadius: 36,
            background: "linear-gradient(180deg, #17110d 0%, #2d221a 100%)",
            padding: 28,
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ fontSize: 18, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Subscription first
          </div>
          <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.1 }}>
            初回
            <br />
            10% OFF
          </div>
          <div style={{ fontSize: 20, lineHeight: 1.5, color: "rgba(255,255,255,0.78)" }}>
            2週間ごと / 1ヶ月ごとの定期便
          </div>
        </div>
      </div>
    ),
    size
  );
}

