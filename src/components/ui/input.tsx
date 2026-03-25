import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-full border border-[#e4d8ca] bg-white px-4 text-sm text-[#17110d] shadow-sm transition-colors placeholder:text-[#a69a90] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c57f4d]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        className
      )}
      {...props}
    />
  );
}

export { Input };

