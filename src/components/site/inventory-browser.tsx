"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input, Label, Select } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/empty-state";
import { VehicleCard } from "@/components/site/vehicle-card";
import { CarFront } from "lucide-react";
import type { PublicVehicle } from "@/lib/inventory";

type SortKey = "newest" | "price-asc" | "price-desc" | "mileage-asc" | "year-desc";

/**
 * Client-side browser for the currently-loaded inventory set.
 * Search and sorting operate strictly on the real vehicles passed in from the
 * server-rendered data layer — nothing is hardcoded.
 */
export function InventoryBrowser({ vehicles }: { vehicles: PublicVehicle[] }) {
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("newest");

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? vehicles.filter((v) =>
          [v.brand, v.model, v.trim, String(v.year), v.exterior_color, v.interior_color]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(q)
        )
      : [...vehicles];

    switch (sort) {
      case "price-asc":
        return filtered.sort((a, b) => a.customer_price_kobo - b.customer_price_kobo);
      case "price-desc":
        return filtered.sort((a, b) => b.customer_price_kobo - a.customer_price_kobo);
      case "mileage-asc":
        return filtered.sort((a, b) => a.mileage - b.mileage);
      case "year-desc":
        return filtered.sort((a, b) => b.year - a.year);
      default:
        return filtered;
    }
  }, [vehicles, query, sort]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-lg border border-graphite-700 bg-graphite-900 p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label htmlFor="inventory-search">Search inventory</Label>
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-500"
            />
            <Input
              id="inventory-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Brand, model, trim, colour or year"
              className="pl-9 pr-9"
              aria-describedby="inventory-result-count"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-ink-400 hover:text-ink-100"
              >
                <X aria-hidden className="size-4" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="sm:w-56">
          <Label htmlFor="inventory-sort">Sort by</Label>
          <Select
            id="inventory-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="newest">Newest listings</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="mileage-asc">Mileage: lowest first</option>
            <option value="year-desc">Year: newest first</option>
          </Select>
        </div>
      </div>

      <p id="inventory-result-count" role="status" className="text-sm text-ink-400">
        Showing {visible.length} of {vehicles.length}{" "}
        {vehicles.length === 1 ? "vehicle" : "vehicles"}
        {query ? ` matching “${query}”` : ""}.
      </p>

      {visible.length === 0 ? (
        <EmptyState
          icon={<CarFront aria-hidden className="size-8" />}
          title="No vehicles match that search"
          description="Try a different brand, model or colour, or clear the search to see the full showroom."
        />
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((vehicle) => (
            <li key={vehicle.id}>
              <VehicleCard vehicle={vehicle} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
