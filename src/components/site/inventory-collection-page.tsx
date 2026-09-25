import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { InventoryCollection } from "@/components/site/inventory-collection";
import { STATUS_DESCRIPTIONS, STATUS_LABELS } from "@/lib/inventory";

const CONFIG = {
  available: {
    title: "Available vehicles",
    heading: "Available now",
    blurb: STATUS_DESCRIPTIONS.available,
    empty: "No vehicles are marked available at the moment.",
  },
  on_order: {
    title: "Vehicles on order",
    heading: "On order",
    blurb: STATUS_DESCRIPTIONS.on_order,
    empty: "No vehicles are currently on order.",
  },
  landed: {
    title: "Landed vehicles",
    heading: "Landed this year",
    blurb: STATUS_DESCRIPTIONS.landed,
    empty: "No vehicles have been marked landed yet this year.",
  },
} as const;

type CollectionKey = keyof typeof CONFIG;

export function collectionMetadata(key: CollectionKey): Metadata {
  return {
    title: CONFIG[key].title,
    description: `${CONFIG[key].blurb} View ${CONFIG[key].title.toLowerCase()} from TrueSpec Automotive.`,
  };
}

/**
 * Shared server page for the three inventory collections.
 * Each collection is fetched from the database through the public data layer.
 */
export function InventoryCollectionPage({ collection }: { collection: CollectionKey }) {
  const config = CONFIG[collection];

  return (
    <div className="container-page py-14 sm:py-20">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 text-xs text-ink-500">
          <li>
            <Link href="/" className="hover:text-gold-200">
              Home
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3.5" />
          </li>
          <li>
            <Link href="/inventory" className="hover:text-gold-200">
              Inventory
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3.5" />
          </li>
          <li aria-current="page" className="text-ink-300">
            {STATUS_LABELS[collection]}
          </li>
        </ol>
      </nav>

      <header className="mb-10 max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold-400">
          Collection
        </p>
        <h1 className="font-display text-3xl tracking-wide text-ink-50 sm:text-4xl">
          {config.heading}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-400 sm:text-base">{config.blurb}</p>
      </header>

      <InventoryCollection
        status={collection}
        emptyTitle={config.empty}
        emptyDescription="New units are added regularly. Send us a WhatsApp message with the exact vehicle you are looking for and we will source it."
      />
    </div>
  );
}
