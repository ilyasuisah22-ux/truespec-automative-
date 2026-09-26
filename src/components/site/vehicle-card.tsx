import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gauge, Palette } from "lucide-react";
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
    <Card className="vehicle-card-hover overflow-hidden group">
      <Link
        href={href}
        className="block focus-visible:outline-offset-4"
        aria-label={`View details for ${title}`}
      >
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-graphite-850">
          {cover ? (
            <Image
              src={resolveImageUrl(cover.storage_path)}
              alt={`${title} — ${vehicle.exterior_color}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="vehicle-card-image object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink-500">
              No photograph available
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute left-3 top-3">
            <StatusBadge status={vehicle.status} />
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-4 p-5">
        <div>
          <p className="font-display text-lg tracking-wide text-ink-50 group-hover:text-gold-200 transition-colors">
            <Link href={href}>
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
          <div className="flex items-center gap-1.5 col-span-2">
            <Palette aria-hidden className="size-3.5 text-ink-500" />
            <dt className="sr-only">Interior</dt>
            <dd className="truncate">{vehicle.interior_color}</dd>
          </div>
        </dl>

        <div className="flex items-end justify-between border-t border-graphite-700/50 pt-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-widest text-ink-500">
              Doorstep price
            </p>
            <p className="font-display text-lg text-gold-300">
              {displayCustomerPrice(vehicle.customer_price_kobo)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-300 group-hover:text-gold-200 group-hover:underline">
            View details
            <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Card>
  );
}
