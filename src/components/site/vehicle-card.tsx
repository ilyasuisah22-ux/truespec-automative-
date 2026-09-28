import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gauge, Palette } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/site/status-badge";
import { WhatsappCta } from "@/components/site/whatsapp-cta";
import { CallCta } from "@/components/site/call-cta";
import { coverImage, type PublicVehicle } from "@/lib/inventory";
import { PhotoPending } from "@/components/site/photo-pending";
import { demoImageAttribution } from "@/lib/demo/demo-image-credits";
import { displayCustomerPrice, formatMileage, vehicleTitle } from "@/lib/inventory";
import { resolveImageUrl } from "@/lib/images";
import { vehicleEnquiryMessage } from "@/lib/whatsapp";

/**
 * Public inventory card. Shows ONLY customer-facing fields — never financial
 * data. Enquiry actions reuse the configured business number and pre-fill the
 * WhatsApp message with the exact vehicle description.
 *
 * IMAGERY: a real photograph or an honest "photography pending" tile. There is
 * no illustration fallback any more: the demo fleet's artwork was replaced by
 * licensed photography (see `demo-image-credits.ts`). Where the photograph came
 * from Wikimedia Commons the card carries its attribution, because the licences
 * we rely on (CC BY / CC BY-SA) require it.
 */
export function VehicleCard({
  vehicle,
  whatsappNumber,
}: {
  vehicle: PublicVehicle;
  whatsappNumber: string;
}) {
  const cover = coverImage(vehicle);
  const href = `/inventory/${vehicle.slug}`;
  const title = vehicleTitle(vehicle);
  const attribution = cover ? demoImageAttribution(cover.storage_path) : null;

  return (
    <Card className="vehicle-card-hover flex h-full flex-col overflow-hidden group">
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
            <PhotoPending compact />
          )}

          {attribution ? (
            <p className="absolute inset-x-0 bottom-0 bg-graphite-950/70 px-2 py-1 text-center text-[0.6rem] leading-tight text-ink-400">
              {attribution}
            </p>
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-t from-scrim/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute left-3 top-3">
            <StatusBadge status={vehicle.status} />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="font-display text-lg tracking-wide text-ink-50 transition-colors group-hover:text-gold-300">
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
          <div className="col-span-2 flex items-center gap-1.5">
            <Palette aria-hidden className="size-3.5 text-ink-500" />
            <dt className="sr-only">Interior</dt>
            <dd className="truncate">{vehicle.interior_color}</dd>
          </div>
        </dl>

        <div className="mt-auto flex items-end justify-between border-t border-graphite-700/50 pt-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-widest text-ink-500">
              Doorstep price
            </p>
            <p className="font-display text-lg text-gold-300">
              {displayCustomerPrice(vehicle.customer_price_kobo)}
            </p>
          </div>
          <Link
            href={href}
            aria-label={`View details for ${title}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-ink-300 transition-colors hover:text-gold-300"
          >
            View details
            <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-graphite-700/50 pt-4">
          <div>
            <WhatsappCta
              whatsappNumber={whatsappNumber}
              message={vehicleEnquiryMessage(vehicle)}
              label="WhatsApp"
              aria-label={`Enquire on WhatsApp about the ${title}`}
              size="sm"
              variant="whatsapp"
              className="w-full"
            />
          </div>
          <div>
            <CallCta
              phoneNumber={whatsappNumber}
              subject={title}
              label="Call"
              size="sm"
              variant="outline"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

