import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  FileCheck2,
  KeyRound,
  ShieldCheck,
  Ship,
  Wallet,
} from "lucide-react";
import { CinematicHero, type HeroSlide } from "@/components/site/cinematic-hero";
import { InventoryCollection } from "@/components/site/inventory-collection";
import { InventoryQuickNav } from "@/components/site/inventory-quick-nav";
import { WhatsappCta } from "@/components/site/whatsapp-cta";
import { CallCta } from "@/components/site/call-cta";
import { getPublicSettings } from "@/lib/data/public";
import { DEMO_VEHICLE_IDS } from "@/lib/demo/demo-data";
import { DEFAULT_GENERAL_MESSAGE } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "TrueSpec Automotive â€” Premium Vehicle Import for Nigeria",
  description:
    "Browse TrueSpec Automotive's curated inventory of available, on-order and landed vehicles with transparent doorstep pricing and direct WhatsApp enquiry.",
  openGraph: {
    title: "TrueSpec Automotive â€” Premium Vehicle Import",
    description: "Transparent doorstep pricing on sourced and imported vehicles.",
    type: "website",
  },
};

/**
 * Hero frames.
 *
 * The `<h1>` copy is intentionally constant across frames so the page has one
 * stable, indexable headline; only the supporting line, eyebrow and featured
 * vehicle rotate.
 *
 * Each slide names a VEHICLE ID, not an image path. The hero renders that
 * vehicle's own illustrative artwork, so the frame and the "Featured" label are
 * derived from the same record and can never drift out of sync — the previous
 * implementation paired hand-written labels with hand-written image paths, which
 * is exactly how a slide ends up announcing a BMW over a Mercedes.
 */
const HERO_SLIDES: HeroSlide[] = [
  {
    vehicleId: DEMO_VEHICLE_IDS.bmwX5,
    eyebrow: "German engineering Â· Verified history",
    headline: "Drive something",
    headlineAccent: "exceptional",
    body: "Verified, cleared and ready for inspection in Lagos. Every unit is priced fully landed, so the figure you see is the figure you pay.",
    featured: "BMW X5 xDrive40i M Sport",
  },
  {
    vehicleId: DEMO_VEHICLE_IDS.mercedesGle,
    eyebrow: "Sourcing Â· Inspection Â· Import",
    headline: "Drive something",
    headlineAccent: "exceptional",
    body: "Direct UK and Gulf stock with documented history. We handle purchase, shipping, clearing and doorstep delivery from end to end.",
    featured: "Mercedes-Benz GLE 450",
  },
  {
    vehicleId: DEMO_VEHICLE_IDS.rangeRoverSport,
    eyebrow: "UK Â· USA Â· Gulf sourcing",
    headline: "Drive something",
    headlineAccent: "exceptional",
    body: "Name the exact vehicle you want and we source it â€” inspected before purchase, photographed honestly and shipped with a written cost breakdown.",
    featured: "Range Rover Sport P400",
  },
  {
    vehicleId: DEMO_VEHICLE_IDS.lexusRx,
    eyebrow: "Japanese reliability Â· Premium comfort",
    headline: "Drive something",
    headlineAccent: "exceptional",
    body: "From allocation to keys in hand, one team owns your order. Track every milestone and receive your vehicle on a full tank.",
    featured: "Lexus RX 350 F SPORT",
  },
  {
    vehicleId: DEMO_VEHICLE_IDS.porscheCayenne,
    eyebrow: "A showroom, not a marketplace",
    headline: "Drive something",
    headlineAccent: "exceptional",
    body: "Performance SUVs with full service history. Inspected before shipping, delivered with transparent pricing.",
    featured: "Porsche Cayenne",
  },
  {
    vehicleId: DEMO_VEHICLE_IDS.landCruiser,
    eyebrow: "Built for Africa Â· Legendary durability",
    headline: "Drive something",
    headlineAccent: "exceptional",
    body: "The definitive African SUV, sourced from GCC markets with full service records and ready for Nigerian roads.",
    featured: "Toyota Land Cruiser VXR",
  },
];

const PROMISES = [
  {
    icon: ShieldCheck,
    title: "Inspected before purchase",
    body: "Reviewed and documented before it is committed to shipping.",
  },
  {
    icon: Ship,
    title: "Tracked import process",
    body: "Purchase, shipping, clearing and delivery, with updates at each stage.",
  },
  {
    icon: Wallet,
    title: "One doorstep price",
    body: "The price shown is the full landed cost. No hidden add-ons.",
  },
];

const PROCESS = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: "Tell us the vehicle",
    body: "Send the make, model and year. We confirm realistic pricing first.",
  },
  {
    icon: FileCheck2,
    step: "02",
    title: "We source and inspect",
    body: "We buy it, inspect it and send you the photographs before shipping.",
  },
  {
    icon: Ship,
    step: "03",
    title: "Shipping and clearing",
    body: "Booked, shipped and cleared, with milestone updates as it happens.",
  },
  {
    icon: KeyRound,
    step: "04",
    title: "Delivered",
    body: "Handed over or delivered to your door, cleaned and fuelled.",
  },
];

const COLLECTIONS = [
  {
    status: "available",
    heading: "Available now",
    copy: "In Nigeria and ready for inspection.",
    href: "/available",
  },
  {
    status: "on_order",
    heading: "On order",
    copy: "Purchased and in transit to Nigeria.",
    href: "/on-order",
  },
  {
    status: "landed",
    heading: "Landed this year",
    copy: "Recently cleared and delivered.",
    href: "/landed",
  },
] as const;


export default async function HomePage() {
  const settings = await getPublicSettings();

  return (
    <>
      <CinematicHero slides={HERO_SLIDES} whatsappNumber={settings.whatsapp_number} />
      {/* ---------------- Quick availability / navigation ---------------- */}
      <InventoryQuickNav />

      {/* ---------------- The showroom ----------------
          The vehicle grids are the point of this page, so they sit immediately
          below the hero. Everything informational is pushed underneath them. */}
      {COLLECTIONS.map((collection) => (
        <section key={collection.status} className="container-page py-10 sm:py-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-display-subsection text-ink-50">{collection.heading}</h2>
              <p className="mt-2 text-sm text-ink-400">{collection.copy}</p>
            </div>
            <Link
              href={collection.href}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-300 underline-offset-4 transition-colors hover:text-gold-200"
            >
              View all
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>

          <InventoryCollection status={collection.status} />
        </section>
      ))}


      {/* ---------------- Trust Pillars ----------------
          Compact: three short commitment cards, no editorial space. */}
      <section className="border-b border-graphite-800 bg-graphite-900/40 py-12 sm:py-14">
        <div className="container-page">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <p className="mb-3 inline-flex items-center justify-center gap-2 border border-gold-500/40 bg-gold-500/10 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-300">
              <BadgeCheck aria-hidden className="size-3.5" />
              Our commitment
            </p>
            <h2 className="text-display-subsection text-ink-50">Why TrueSpec Automotive</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-400">{settings.site_tagline}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {PROMISES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="group relative rounded-lg border border-graphite-700 bg-graphite-900/60 p-5 card-premium-hover"
              >
                <div className="relative flex gap-3.5">
                  <Icon
                    aria-hidden
                    className="size-5 shrink-0 text-gold-400 transition-colors group-hover:text-gold-300"
                  />
                  <div>
                    <p className="font-display text-sm tracking-wide text-ink-50">{title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- How it works ----------------
          Compact: a single heading row plus four tight step cards. */}
      <section className="border-b border-graphite-800 py-12 sm:py-14">
        <div className="container-page">
          <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-display-subsection text-ink-50">How it works</h2>
            <p className="text-sm text-ink-400">
              One team holds the whole chain â€” sourcing, shipping, clearing and delivery.
            </p>
          </div>

          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map(({ icon: Icon, step, title, body }) => (
              <li
                key={step}
                className="group relative rounded-lg border border-graphite-700 bg-graphite-900/60 p-5 card-premium-hover"
              >
                <div className="relative flex items-center gap-3">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-gold-400/10 text-gold-400 transition-colors group-hover:bg-gold-400/20">
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <span aria-hidden className="font-display text-sm leading-none text-graphite-600">
                    {step}
                  </span>
                </div>
                <h3 className="mt-3.5 font-display text-sm tracking-wide text-ink-50">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- Talk to us ---------------- */}
      <section className="container-page pb-8">
        <div className="relative overflow-hidden rounded-xl border border-graphite-700 bg-graphite-900/60 px-6 py-10 text-center sm:px-12 sm:py-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gold-400/5 blur-3xl"
          />
          <div className="relative mx-auto max-w-2xl">
            <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-gold-400">
              Talk to us
            </p>
            <h2 className="text-display-subsection text-ink-50">Not sure what to buy yet?</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">
              Tell us your budget and how you will use the vehicle. We shortlist realistic options,
              price each one fully landed, and let you decide.
            </p>

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <WhatsappCta
                whatsappNumber={settings.whatsapp_number}
                message={DEFAULT_GENERAL_MESSAGE}
                label="Chat on WhatsApp"
                size="lg"
                variant="whatsapp"
                className="w-full sm:w-auto"
              />
              <CallCta
                phoneNumber={settings.whatsapp_number}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              />
              <Link
                href="/inventory"
                className="btn-premium-outline h-12 w-full rounded-md px-6 text-base sm:w-auto"
              >
                Browse inventory
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
