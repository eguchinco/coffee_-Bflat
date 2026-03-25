export function JsonLd({ data }: { data: Record<string, unknown> | string }) {
  const value = typeof data === "string" ? data : JSON.stringify(data);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}
