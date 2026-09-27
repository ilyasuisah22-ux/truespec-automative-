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
import { WhatsappCta } from "@/components/site/whatsapp-cta";
import { CallCta } from "@/components/site/call-cta";
import { getPublicSettings } from "@/lib/data/public";
import { DEFAULT_GENERAL_MESSAGE } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "TrueSpec Automotive — Premium Vehicle Import for Nigeria",
  description:
    "Browse TrueSpec Automotive's curated inventory of available, on-order and landed vehicles with transparent doorstep pricing and direct WhatsApp enquiry.",
  openGraph: {
    title: "TrueSpec Automotive — Premium Vehicle Import",
    description: "Transparent doorstep pricing on sourced and imported vehicles.",
    type: "website",
  },
};

/**
 * Hero frames.
 *
 * The `<h1>` copy is intentionally constant across frames so the page has one
 * stable, indexable headline; only the supporting line, eyebrow and featured
 * vehicle rotate. Photography is the demonstration fleet under
 * `/public/demo/vehicles/`.
 */
const HERO_SLIDES: HeroSlide[] = [
  {
    src: "/demo/vehicles/bmw-x5-exterior.jpg",
    eyebrow: "German engineering · Verified history",
    headline: "Drive something",
    headlineAccent: "exceptional",
    body: "Verified, cleared and ready for inspection in Lagos. Every unit is priced fully landed, so the figure you see is the figure you pay.",
    featured: "BMW X5 xDrive40i M Sport",
  },
  {
    src: "/demo/vehicles/mercedes-gle-exterior.jpg",
    eyebrow: "Sourcing · Inspection · Import",
    headline: "Drive something",
    headlineAccent: "exceptional",
    body: "Direct UK and Gulf stock with documented history. We handle purchase, shipping, clearing and doorstep delivery from end to end.",
    featured: "Mercedes-Benz GLE 450",
  },
  {
    src: "/demo/vehicles/range-rover-sport-exterior.jpg",
    eyebrow: "UK · USA · Gulf sourcing",
    headline: "Drive something",
    headlineAccent: "exceptional",
    body: "Name the exact vehicle you want and we source it — inspected before purchase, photographed honestly and shipped with a written cost breakdown.",
    featured: "Range Rover Sport P400",
  },
  {
    src: "/demo/vehicles/lexus-rx-exterior.jpg",
    eyebrow: "Japanese reliability · Premium comfort",
    headline: "Drive something",
    headlineAccent: "exceptional",
    body: "From allocation to keys in hand, one team owns your order. Track every milestone and receive your vehicle on a full tank.",
    featured: "Lexus RX 350 F SPORT",
  },
  {
    src: "/demo/vehicles/porsche-cayenne-exterior.jpg",
    eyebrow: "A showroom, not a marketplace",
    headline: "Drive something",
    headlineAccent: "exceptional",
    body: "Performance SUVs with full service history. Inspected before shipping, delivered with transparent pricing.",
    featured: "Porsche Cayenne",
  },
  {
    src: "/demo/vehicles/land-cruiser-exterior.jpg",
    eyebrow: "Built for Africa · Legendary durability",
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
    body: "Each unit is reviewed and documented before it is committed to shipping.",
  },
  {
    icon: Ship,
    title: "Tracked import process",
    body: "Follow your vehicle from purchase through shipping, clearing and delivery.",
  },
  {
    icon: Wallet,
    title: "One doorstep price",
    body: "The price you see includes the full landed cost — no hidden add-ons.",
  },
];

const PROCESS = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: "Tell us the vehicle",
    body: "Send the make, model, year and any must-have specification. We confirm realistic market pricing before you commit.",
  },
  {
    icon: FileCheck2,
    step: "02",
    title: "We source and inspect",
    body: "We bid, buy and inspect on your behalf, then send you the photographs and history before shipping.",
  },
  {
    icon: Ship,
    step: "03",
    title: "Shipping and clearing",
    body: "Booked, shipped and cleared. You receive milestone updates rather than having to chase them.",
  },
  {
    icon: KeyRound,
    step: "04",
    title: "Delivered on a full tank",
    body: "Handed over at the showroom or delivered to your door, cleaned, fuelled and ready to drive.",
  },
];


export default async function HomePage() {
  const settings = await getPublicSettings();

  return (
    <>
      <CinematicHero slides={HERO_SLIDES} whatsappNumber={settings.whatsapp_number} />

      {/* ---------------- Trust Pillars ---------------- */}
      <section className="section-spacing border-b border-graphite-800 bg-graphite-900/40">
        <div className="container-page">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="mb-4 inline-flex items-center justify-center gap-2 border border-gold-500/40 bg-gold-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              <BadgeCheck aria-hidden className="size-3.5" />
              Our commitment
            </p>
            <h2 className="text-display-section text-ink-50">
              Why TrueSpec Automotive
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-ink-400 sm:text-base">
              {settings.site_tagline}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {PROMISES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="group relative p-6 rounded-xl border border-graphite-700 bg-graphite-900/60 card-premium-hover"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex gap-4">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-gold-400/10 rounded-lg group-hover:bg-gold-400/20 transition-colors" />
                    <Icon aria-hidden className="relative size-6 shrink-0 text-gold-400 group-hover:text-gold-300 transition-colors" />
                  </div>
                  <div>
                    <p className="font-display tracking-wide text-ink-50">{title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-400">{body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="section-spacing border-b border-graphite-800">
        <div className="container-page">
          <div className="mb-14 max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-gold-400">
              How it works
            </p>
            <h2 className="text-display-section text-ink-50">Four steps, one team</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-400 sm:text-base">
              You never deal with an auction, a freight forwarder and a clearing agent separately. We
              hold the whole chain.
            </p>
          </div>

          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map(({ icon: Icon, step, title, body }) => (
              <li
                key={step}
                className="group relative overflow-hidden rounded-xl border border-graphite-700 bg-graphite-900/60 p-6 card-premium-hover"
              >
                <span
                  aria-hidden
                  className="absolute right-4 top-3 font-display text-4xl leading-none text-graphite-700 transition-colors group-hover:text-gold-500/40"
                >
                  {step}
                </span>
                <div className="relative">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-gold-400/10 text-gold-400 transition-colors group-hover:bg-gold-400/20">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-base tracking-wide text-ink-50">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-400">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- Collections ---------------- */}
      {(
        [
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
        ] as const
      ).map((section) => (
        <section key={section.status} className="container-page section-spacing">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-display-subsection text-ink-50">
                {section.heading}
              </h2>
              <p className="mt-3 text-sm text-ink-400">{section.copy}</p>
            </div>
            <Link
              href={section.href}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-300 underline-offset-4 hover:text-gold-200 transition-colors"
            >
              View all
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>

          <InventoryCollection status={section.status} />
        </section>
      ))}

      {/* ---------------- Talk to us ---------------- */}
      <section className="container-page pb-8">
        <div className="relative overflow-hidden rounded-2xl border border-graphite-700 bg-graphite-900/60 px-6 py-14 text-center sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gold-400/5 blur-3xl"
          />
          <div className="relative mx-auto max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-gold-400">
              Talk to us
            </p>
            <h2 className="text-display-section text-ink-50">
              Not sure what to buy yet?
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-ink-300 sm:text-base">
              Tell us your budget and how you intend to use the vehicle. We will shortlist two or
              three realistic options, price each one fully landed, and let you decide.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
