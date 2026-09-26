import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Ship, Wallet } from "lucide-react";
import { InventoryCollection } from "@/components/site/inventory-collection";
import { WhatsappCta } from "@/components/site/whatsapp-cta";
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

export default async function HomePage() {
  const settings = await getPublicSettings();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      {/* ---------------- Hero ---------------- */}
      <section className="relative isolate overflow-hidden border-b border-graphite-800">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/demo/g-class-exterior.svg"
            alt="Mercedes-Benz G-Class exterior — representative of TrueSpec's premium imports"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>

        <div className="container-page py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl">
            <p className="mb-6 inline-flex items-center gap-2 border border-gold-500/40 bg-gold-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              Sourcing · Inspection · Import
            </p>

            <h1 className="text-display-hero text-ink-50">
              Drive something
              <br />
              <span className="text-gradient-gold">exceptional</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">
              {settings.site_tagline} Browse available, on-order and landed vehicles — each with a clear doorstep price.
            </p>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/inventory"
                className="btn-premium-primary px-8 py-4 text-base"
              >
                Explore inventory
                <ArrowRight aria-hidden className="size-5" />
              </Link>
              <WhatsappCta
                whatsappNumber={settings.whatsapp_number}
                message={DEFAULT_GENERAL_MESSAGE}
                size="lg"
                label="Chat on WhatsApp"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 md:w-1/2 lg:w-1/3 gold-accent-line" />
      </section>

      {/* ---------------- Trust Pillars ---------------- */}
      <section className="section-spacing border-b border-graphite-800 bg-graphite-900/40">
        <div className="container-page">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="mb-4 inline-flex items-center justify-center gap-2 border border-gold-500/40 bg-gold-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              Our commitment
            </p>
            <h2 className="text-display-section text-ink-50">
              Why TrueSpec Automotive
            </h2>
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
    </>
  );
}
