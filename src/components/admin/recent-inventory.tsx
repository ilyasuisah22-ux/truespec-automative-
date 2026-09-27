import Link from "next/link";
import { formatNaira } from "@/lib/money";
import { formatMileage, vehicleTitle } from "@/lib/inventory";
import type { AdminVehicle } from "@/lib/data/admin";

/**
 * Recent inventory, built from real vehicle records.
 *
 * Shows ONLY public-safe fields. Purchase cost, USA trucking, shipping,
 * clearing, Nigeria trucking, landed cost, projected profit, sourcing contact
 * and internal notes are never passed in, so this component is structurally
 * incapable of rendering them. Price shown is the public customer price.
 */
export function RecentInventory({ vehicles }: { vehicles: AdminVehicle[] }) {
  const recent = [...vehicles]
    .sort((a, b) => (b.vehicle.created_at ?? "").localeCompare(a.vehicle.created_at ?? ""))
    .slice(0, 4);

  if (recent.length === 0) return null;

  return (
    <ul className="divide-y divide-graphite-800">
      {recent.map((item) => (
        <li key={item.vehicle.id}>
          <Link
            href={`/admin/inventory/${item.vehicle.id}`}
            className="-mx-2 flex items-center gap-4 rounded-md px-2 py-3 transition-colors hover:bg-graphite-850"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink-50">
                {vehicleTitle(item.vehicle)}
              </p>
              <p className="truncate text-xs text-ink-500">
                {item.vehicle.year} &middot; {formatMileage(item.vehicle.mileage)} &middot;{" "}
                {item.vehicle.exterior_color}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm tabular-nums text-gold-300">
                {formatNaira(item.vehicle.customer_price_kobo)}
              </p>
              <p className="text-xs capitalize text-ink-500">
                {item.vehicle.status.replace("_", " ")}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
