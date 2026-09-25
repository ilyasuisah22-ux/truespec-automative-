import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider",
  {
    variants: {
      tone: {
        neutral: "border-graphite-600 bg-graphite-800 text-ink-200",
        available: "border-status-available/40 bg-status-available/10 text-status-available",
        on_order: "border-status-onorder/40 bg-status-onorder/10 text-status-onorder",
        landed: "border-status-landed/40 bg-status-landed/10 text-status-landed",
        gold: "border-gold-500/40 bg-gold-500/10 text-gold-300",
        danger: "border-danger/40 bg-danger/10 text-danger",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { badgeVariants };
