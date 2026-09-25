import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Ship, Wallet } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { InventoryCollection } from "@/components/site/inventory-collection";
import { WhatsappCta } from "@/components/site/whatsapp-cta";
import { getPublicSettings } from "@/lib/data/public";
import { DEFAULT_GENERAL_MESSAGE } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Premium Vehicle Import for Nigeria",
  description:
    "Browse TrueSpec Automotive's available, on-order and landed vehicles with transparent doorstep pricing and direct WhatsApp enquiry.",
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
      {/* ---------------- Hero ---------------- */}
      <section className="relative isolate overflow-hidden border-b border-graphite-800">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/demo/g-class-exterior.svg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-graphite-950 via-graphite-950/85 to-graphite-950/40" />
        </div>

        <div className="container-page py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 border border-gold-500/40 bg-gold-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              Sourcing · Inspection · Import
            </p>

            <h1 className="font-display text-4xl leading-[1.05] tracking-wide text-ink-50 sm:text-5xl lg:text-6xl">
              Vehicles sourced
              <br />
              to your specification
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">
              {settings.site_tagline} Browse what is available now, what is on order, and what has
              recently landed — each with a clear doorstep price.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/inventory" size="lg">
                Explore inventory
                <ArrowRight aria-hidden />
              </ButtonLink>
              <WhatsappCta
                whatsappNumber={settings.whatsapp_number}
                message={DEFAULT_GENERAL_MESSAGE}
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Promises ---------------- */}
      <section className="border-b border-graphite-800 bg-graphite-900/40">
        <div className="container-page grid gap-8 py-12 sm:grid-cols-3">
          {PROMISES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4">
              <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-gold-400" />
              <div>
                <p className="font-display tracking-wide text-ink-50">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{body}</p>
              </div>
            </div>
          ))}
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
        <section key={section.status} className="container-page py-16 sm:py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl tracking-wide text-ink-50 sm:text-3xl">
                {section.heading}
              </h2>
              <p className="mt-2 text-sm text-ink-400">{section.copy}</p>
            </div>
            <Link
              href={section.href}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-300 underline-offset-4 hover:underline"
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
