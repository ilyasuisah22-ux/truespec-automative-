import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublicInventorySummary } from "@/lib/data/public";

/**
 * Compact availability strip shown directly beneath the hero.
 *
 * Its whole job is orientation: the visitor learns how the showroom is split
 * and can jump straight to the collection they care about, without scrolling
 * past any informational section. Counts come from a single `status`-only query
 * (`getPublicInventorySummary`) so the strip never blocks the first paint of
 * the vehicle grids below it.
 */
const LINKS = [
  {
    status: "available",
    label: "Available now",
    note: "In Nigeria, ready to inspect",
    href: "/available",
  },
  {
    status: "on_order",
    label: "On order",
    note: "Purchased, in transit to Nigeria",
    href: "/on-order",
  },
  {
    status: "landed",
    label: "Landed this year",
    note: "Cleared and delivered",
    href: "/landed",
  },
] as const;

export async function InventoryQuickNav() {
  const summary = await getPublicInventorySummary();

  return (
    <nav
      aria-label="Browse inventory by status"
      className="border-b border-graphite-800 bg-graphite-900/60"
    >
      <div className="container-page">
        <ul className="grid grid-cols-1 gap-px overflow-hidden sm:grid-cols-3 sm:bg-graphite-800/60 sm:gap-px">
          {LINKS.map(({ status, label, note, href }) => {
            const count = summary.byStatus[status];
            return (
              <li key={status} className="bg-graphite-900/60 sm:bg-graphite-950">
                <Link
                  href={href}
                  className="group flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-graphite-800/60 sm:px-5"
                >
                  <span className="min-w-0">
                    <span className="flex items-baseline gap-2">
                      <span className="font-display text-2xl leading-none tabular-nums text-gold-300">
                        {count}
                      </span>
                      <span className="text-sm font-medium tracking-wide text-ink-50">
                        {label}
                      </span>
                    </span>
                    <span className="mt-1 block truncate text-xs text-ink-500">{note}</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="size-4 shrink-0 text-ink-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gold-300"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
