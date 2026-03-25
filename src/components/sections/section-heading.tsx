import { Badge } from "@/components/ui/badge";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl space-y-4">
      <Badge variant="warm">{eyebrow}</Badge>
      <h2 className="text-3xl font-semibold tracking-tight text-[#17110d] sm:text-4xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-8 text-[#6f6156]">{description}</p>
    </div>
  );
}

