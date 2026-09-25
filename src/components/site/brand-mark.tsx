import { cn } from "@/lib/utils";

/**
 * Temporary text-based brand treatment.
 *
 * The client has not supplied an official logo file. This is deliberately a
 * typographic wordmark — NOT a fabricated version of TrueSpec's real logo —
 * and is designed to be swapped for the official asset when Umar provides it.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("flex flex-col leading-none", className)}>
      <span className="font-display text-lg font-600 uppercase tracking-[0.18em] text-ink-50 sm:text-xl">
        True<span className="text-gold-400">Spec</span>
      </span>
      <span className="mt-1 font-sans text-[0.6rem] uppercase tracking-[0.34em] text-ink-400">
        Automotive
      </span>
    </span>
  );
}
