import type { VehicleStatus } from "@/lib/supabase/types";

/*
 * Current inventory distribution.
 *
 * Every number here is a live count from the dashboard metrics. There is
 * deliberately no time series, growth percentage or sales trend: the
 * application has no such history, and inventing one would put fiction in
 * front of the business owner. This shows the one thing the data genuinely
 * supports - how the fleet is distributed right now.
 *
 * A donut (rather than an axis chart) is the honest form for a single
 * point-in-time split, and it stays legible on a phone.
 */

const RADIUS = 54;
const STROKE = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const SEGMENTS: Array<{ status: VehicleStatus; label: string; stroke: string; dot: string }> = [
  { status: "available", label: "Available", stroke: "stroke-status-available", dot: "bg-status-available" },
  { status: "on_order", label: "On order", stroke: "stroke-status-onorder", dot: "bg-status-onorder" },
  { status: "landed", label: "Landed", stroke: "stroke-status-landed", dot: "bg-status-landed" },
];

export function InventoryDonut({
  byStatus,
  total,
}: {
  byStatus: Record<VehicleStatus, number>;
  total: number;
}) {
  const summary = SEGMENTS.map((s) => `${s.label}: ${byStatus[s.status] ?? 0}`).join(", ");

  // Running total drawn so far, so each arc is offset and the segments never overlap.
  let drawn = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
      <div className="relative shrink-0">
        <svg
          viewBox="0 0 128 128"
          className="size-40 -rotate-90 sm:size-44"
          role="img"
          aria-label={`Inventory distribution. ${summary}. ${total} vehicles in total.`}
        >
          <circle cx="64" cy="64" r={RADIUS} fill="none" strokeWidth={STROKE} className="stroke-graphite-800" />
          {total > 0
            ? SEGMENTS.map((segment) => {
                const count = byStatus[segment.status] ?? 0;
                if (count === 0) return null;
                const length = (count / total) * CIRCUMFERENCE;
                const offset = -(drawn / total) * CIRCUMFERENCE;
                drawn += count;
                return (
                  <circle
                    key={segment.status}
                    cx="64"
                    cy="64"
                    r={RADIUS}
                    fill="none"
                    strokeWidth={STROKE}
                    className={segment.stroke}
                    strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                    strokeDashoffset={offset}
                  />
                );
              })
            : null}
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl tabular-nums text-ink-50">{total}</span>
          <span className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-500">
            {total === 1 ? "vehicle" : "vehicles"}
          </span>
        </div>
      </div>

      <ul className="w-full space-y-3">
        {SEGMENTS.map((segment) => {
          const count = byStatus[segment.status] ?? 0;
          const pct = total === 0 ? 0 : Math.round((count / total) * 100);
          return (
            <li key={segment.status} className="flex items-center gap-3">
              <span
                aria-hidden
                className={`size-2.5 shrink-0 rounded-full border border-graphite-600 ${segment.dot}`}
              />
              <span className="flex-1 text-sm text-ink-300">{segment.label}</span>
              <span className="text-sm font-medium tabular-nums text-ink-100">{count}</span>
              <span className="w-10 text-right text-xs tabular-nums text-ink-500">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
