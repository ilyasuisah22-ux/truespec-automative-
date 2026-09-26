import { cn } from "@/lib/utils";

/**
 * Premium brand mark.
 * Uses the condensed industrial display typography (Oswald) with gold accent.
 * Ready to swap for official logo when provided.
 */
export function BrandMark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "text-base sm:text-lg",
    md: "text-lg sm:text-xl",
    lg: "text-xl sm:text-2xl lg:text-3xl",
  };

  return (
    <span className={cn("flex flex-col leading-none", sizeClasses[size], className)}>
      <span className="font-display font-600 uppercase tracking-[0.18em] text-ink-50">
        True<span className="text-gold-400">Spec</span>
      </span>
      <span className="mt-1 font-sans text-[0.6rem] uppercase tracking-[0.34em] text-ink-400">
        Automotive
      </span>
    </span>
  );
}
