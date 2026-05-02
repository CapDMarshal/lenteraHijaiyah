import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl border border-stone-200 bg-white p-5 shadow-sm", className)}
      {...props}
    />
  );
}

export function InkCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-stone-900 bg-white p-5 shadow-[4px_4px_0_#d96852]",
        className,
      )}
      {...props}
    />
  );
}
