import Link from "next/link";
import Image from "next/image";
import { formatNaira } from "@/lib/money";
import { formatMileage, vehicleTitle } from "@/lib/inventory";
import { PhotoPending } from "@/components/site/photo-pending";
import { resolveImageUrl } from "@/lib/images";
import type { AdminVehicle } from "@/lib/data/admin";

/**
 * Recent inventory, built from real vehicle records.
 *
 * Shows ONLY public-safe fields. Purchase cost, USA trucking, shipping,
 * clearing, Nigeria trucking, landed cost, projected profit, sourcing contact
 * and internal notes are never passed in, so this component is structurally
 * incapable of rendering them. Price shown is the public customer price.
 *
 * Imagery mirrors the public showroom exactly: a real photograph is shown when
 * one exists, otherwise an honest "photography pending" tile. A thumbnail is
 * never borrowed from a different vehicle, and never an illustration.
 */
export function RecentInventory({ vehicles }: { vehicles: AdminVehicle[] }) {
  const recent = [...vehicles]
    .sort((a, b) => (b.vehicle.created_at ?? "").localeCompare(a.vehicle.created_at ?? ""))
    .slice(0, 4);

  if (recent.length === 0) return null;

  return (
    <ul className="divide-y divide-graphite-800">
      {recent.map((item) => {
        const title = vehicleTitle(item.vehicle);
        // `images` is a sibling of `vehicle` on AdminVehicle, not a field on the
        // row itself — the data layer attaches it when assembling the record.
        const cover = item.images?.find((img) => img.is_cover) ?? item.images?.[0];

        return (
          <li key={item.vehicle.id}>
            <Link
              href={`/admin/inventory/${item.vehicle.id}`}
              className="-mx-2 flex items-center gap-4 rounded-md px-2 py-3 transition-colors hover:bg-graphite-850"
            >
              <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-graphite-700 bg-graphite-850">
                {cover ? (
                  <Image
                    src={resolveImageUrl(cover.storage_path)}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <PhotoPending compact />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-50">{title}</p>
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
        );
      })}
    </ul>
  );
}
