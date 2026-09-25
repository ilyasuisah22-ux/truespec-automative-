import Image from "next/image";
import Link from "next/link";
import { Fuel, Gauge, Palette } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/site/status-badge";
import { coverImage, type PublicVehicle } from "@/lib/inventory";
import { displayCustomerPrice, formatMileage, vehicleTitle } from "@/lib/inventory";
import { resolveImageUrl } from "@/lib/images";

/** Public inventory card. Shows ONLY customer-facing fields — never financial data. */
export function VehicleCard({ vehicle }: { vehicle: PublicVehicle }) {
  const cover = coverImage(vehicle);
  const href = `/inventory/${vehicle.slug}`;
  const title = vehicleTitle(vehicle);

  return (
    <Card className="group overflow-hidden transition-colors hover:border-gold-500/50">
      <Link
        href={href}
        className="block rounded-t-lg focus-visible:outline-offset-4"
        aria-label={`View details for ${title}`}
      >
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-graphite-850">
          {cover ? (
            <Image
              src={resolveImageUrl(cover.storage_path)}
              alt={`${title} — ${vehicle.exterior_color}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink-500">
              No photograph available
            </div>
          )}

          <div className="absolute left-3 top-3">
            <StatusBadge status={vehicle.status} />
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-4 p-5">
        <div>
          <p className="font-display text-lg tracking-wide text-ink-50">
            <Link href={href} className="hover:text-gold-200">
              {vehicle.brand} {vehicle.model}
            </Link>
          </p>
          <p className="mt-0.5 text-sm text-ink-400">
            {[vehicle.trim, vehicle.year].filter(Boolean).join(" · ")}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-y-2 text-xs text-ink-300">
          <div className="flex items-center gap-1.5">
            <Gauge aria-hidden className="size-3.5 text-ink-500" />
            <dt className="sr-only">Mileage</dt>
            <dd>{formatMileage(vehicle.mileage)}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Palette aria-hidden className="size-3.5 text-ink-500" />
            <dt className="sr-only">Exterior colour</dt>
            <dd className="truncate">{vehicle.exterior_color}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel aria-hidden className="size-3.5 text-ink-500" />
            <dt className="sr-only">Interior</dt>
            <dd className="truncate">{vehicle.interior_color}</dd>
          </div>
        </dl>

        <div className="flex items-end justify-between border-t border-graphite-700 pt-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-widest text-ink-500">Doorstep price</p>
            <p className="font-display text-lg text-gold-300">
              {displayCustomerPrice(vehicle.customer_price_kobo)}
            </p>
          </div>
          <Link
            href={href}
            className="rounded-sm text-sm font-medium text-ink-200 underline-offset-4 hover:text-gold-200 hover:underline"
          >
            View details
          </Link>
        </div>
      </div>
    </Card>
  );
}
