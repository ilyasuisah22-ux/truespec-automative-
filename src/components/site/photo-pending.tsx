import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Honest empty state for a vehicle that has no photography yet.
 *
 * This exists because a vehicle listing must never be illustrated with an image
 * of a *different* vehicle. A "photography pending" panel is truthful and looks
 * deliberate; substituting someone else's photograph is neither. Real imagery
 * attaches per vehicle through the admin upload flow.
 *
 * Every colour comes from the shared palette tokens, so the panel reads
 * correctly in the dark showroom, the light showroom, and the admin dashboard
 * without a single theme prop.
 */
export function PhotoPending({
  className,
  label = "Photography pending",
  detail = "Images of this vehicle will appear here once they have been uploaded.",
  compact = false,
}: {
  className?: string;
  label?: string;
  detail?: string;
  /** Compact drops the supporting line — used inside inventory cards. */
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center",
        // Diagonal hatch reads as "intentionally empty" rather than broken.
        "bg-graphite-850 text-ink-400",
        className
      )}
    >
      <span
        aria-hidden
        className="flex size-11 items-center justify-center rounded-full border border-graphite-600 bg-graphite-800"
      >
        <Camera className="size-5 text-gold-400/80" />
      </span>

      <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-300">{label}</p>

      {compact ? null : (
        <p className="max-w-xs text-xs leading-relaxed text-ink-500">{detail}</p>
      )}
    </div>
  );
}
