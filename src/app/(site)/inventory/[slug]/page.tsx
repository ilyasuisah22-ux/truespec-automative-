import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, Gauge, Info, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/site/status-badge";
import { VehicleGallery } from "@/components/site/vehicle-gallery";
import { WhatsappCta } from "@/components/site/whatsapp-cta";
import { getPublicSettings, getPublicVehicleBySlug, getPublicVehicleSlugs } from "@/lib/data/public";
import {
  coverImage,
  displayCustomerPrice,
  formatMileage,
  vehicleTitle,
} from "@/lib/inventory";
import { buildWhatsappLink, vehicleEnquiryMessage } from "@/lib/whatsapp";
import { resolveImageUrl } from "@/lib/images";

interface PageProps {
  // Next.js 16: route params are async
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPublicVehicleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getPublicVehicleBySlug(slug);
  if (!vehicle) return { title: "Vehicle not found" };

  const title = vehicleTitle(vehicle);
  const cover = coverImage(vehicle);

  return {
    title,
    description: `${title} — ${formatMileage(vehicle.mileage)}, ${vehicle.exterior_color} exterior, ${vehicle.interior_color} interior. Doorstep price from TrueSpec Automotive.`,
    openGraph: {
      title: `${title} — TrueSpec Automotive`,
      description: `${vehicle.exterior_color} exterior · ${vehicle.interior_color} interior · ${formatMileage(vehicle.mileage)}`,
      images: cover ? [{ url: resolveImageUrl(cover.storage_path) }] : undefined,
      type: "website",
    },
    alternates: { canonical: `/inventory/${vehicle.slug}` },
  };
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [vehicle, settings] = await Promise.all([
    getPublicVehicleBySlug(slug),
    getPublicSettings(),
  ]);

  if (!vehicle) notFound();

  const title = vehicleTitle(vehicle);
  const enquiry = buildWhatsappLink(settings.whatsapp_number, vehicleEnquiryMessage(vehicle));

  const specs = [
    { icon: CalendarDays, label: "Year", value: String(vehicle.year) },
    { icon: Gauge, label: "Mileage", value: formatMileage(vehicle.mileage) },
    { icon: Palette, label: "Exterior", value: vehicle.exterior_color },
    { icon: Palette, label: "Interior", value: vehicle.interior_color },
  ];

  return (
    <div className="container-page py-10 sm:py-14">
      <Link
        href="/inventory"
        className="mb-8 inline-flex items-center gap-2 text-sm text-ink-300 hover:text-gold-200"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to inventory
      </Link>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <VehicleGallery images={vehicle.images} title={title} />

        <div className="space-y-6">
          <div>
            <StatusBadge status={vehicle.status} />
            <h1 className="mt-4 font-display text-3xl tracking-wide text-ink-50">{title}</h1>
            {vehicle.trim ? <p className="mt-1 text-sm text-ink-400">{vehicle.trim}</p> : null}
          </div>

          <Card>
            <CardContent className="space-y-4">
              <div>
                <p className="text-[0.65rem] uppercase tracking-widest text-ink-500">
                  Doorstep price
                </p>
                <p className="font-display text-3xl text-gold-300">
                  {displayCustomerPrice(vehicle.customer_price_kobo)}
                </p>
                <p className="mt-1.5 text-xs text-ink-500">
                  Fully landed price. No additional import or clearing charges are added.
                </p>
              </div>

              <div className="border-t border-graphite-700 pt-4">
                <WhatsappCta
                  whatsappNumber={settings.whatsapp_number}
                  message={vehicleEnquiryMessage(vehicle)}
                  label="Enquire about this vehicle"
                  size="lg"
                  className="w-full"
                />
                {enquiry.href ? (
                  <p className="mt-2 text-xs text-ink-500">
                    Opens WhatsApp with a message naming this vehicle.
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {vehicle.public_arrival_note ? (
            <Card>
              <CardHeader className="flex items-center gap-2">
                <Info aria-hidden className="size-4 text-gold-400" />
                <CardTitle className="text-sm">Arrival note</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-ink-300">{vehicle.public_arrival_note}</p>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Specification</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label}>
                    <dt className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-widest text-ink-500">
                      <Icon aria-hidden className="size-3.5" />
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm text-ink-100">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      {vehicle.features.length > 0 ? (
        <section className="mt-12 max-w-3xl">
          <h2 className="font-display text-xl tracking-wide text-ink-50">
            Notable features and options
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {vehicle.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-300">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-gold-400" />
                {feature}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
