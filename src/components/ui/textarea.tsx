import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-28 w-full rounded-[24px] border border-[#e4d8ca] bg-white px-4 py-3 text-sm text-[#17110d] shadow-sm transition-colors placeholder:text-[#a69a90] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c57f4d]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };

