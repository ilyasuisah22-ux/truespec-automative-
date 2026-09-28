"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { DEMO_VEHICLES } from "@/lib/demo/demo-data";
import { coverImage } from "@/lib/inventory";
import { resolveImageUrl } from "@/lib/images";
import { DEFAULT_GENERAL_MESSAGE, buildWhatsappLink } from "@/lib/whatsapp";

export interface HeroSlide {
  /**
   * Vehicle this slide showcases, as a demonstration vehicle id. The hero draws
   * that vehicle's own real photograph (its gallery cover image), so the frame
   * and the `featured` label are derived from the SAME record and can never
   * disagree. A slide whose vehicle has no photograph renders a plain panel,
   * never an illustration or another car's picture.
   */
  vehicleId: string;
  eyebrow: string;
  /** Rendered on line one of the headline. */
  headline: string;
  /** Rendered on line two in the metallic gold gradient. */
  headlineAccent: string;
  body: string;
  /** Vehicle the slide showcases — surfaced as a pill so it reads as a listing. */
  featured?: string;
}

/**
 * Time each frame is held before the hero advances.
 *
 * 2 seconds, as specified. The crossfade itself is 1000ms, so frames overlap
 * slightly and the sequence reads as continuous motion rather than a hard cut.
 */
const ROTATION_MS = 2000;

/*
 * `prefers-reduced-motion` is an external, media-query-backed store, so it is
 * read with `useSyncExternalStore` rather than copied into state in an effect.
 * Server rendering always reports "no preference": the hero's first frame is
 * fully usable either way, and motion only begins after the client takes over.
 */
function subscribeToMotionPreference(onChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => undefined;
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function readMotionPreference() {
  if (typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readMotionPreferenceOnServer() {
  return false;
}

/**
 * Cinematic showroom hero.
 *
 * - Frames are each slide's own real photograph and rotate every 2 seconds,
 *   crossfading behind a copy block with an 18s Ken Burns drift, so stills
 *   feel filmed rather than pasted.
 * - Rotation is driven by `setInterval` and paused while the document is
 *   hidden, so a backgrounded tab never accumulates work.
 * - The first frame is server-rendered, so the hero is complete without JS.
 * - `prefers-reduced-motion: reduce` disables both the rotation and the drift
 *   and leaves a single static frame with working frame controls.
 * - Attributions for the Commons photographs appear as a permanent one-line
 *   credit, as the CC BY / CC BY-SA licences require.
 */
export function CinematicHero({
  slides,
  whatsappNumber,
}: {
  slides: HeroSlide[];
  whatsappNumber: string;
}) {
  const reducedMotion = React.useSyncExternalStore(
    subscribeToMotionPreference,
    readMotionPreference,
    readMotionPreferenceOnServer
  );
  const [index, setIndex] = React.useState(0);
  // Pausing on hover/focus stops the frame from changing out from under a
  // visitor who is reading or tabbing through the hero CTAs.
  const [paused, setPaused] = React.useState(false);
  const total = slides.length;

  const go = React.useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total]
  );

  React.useEffect(() => {
    if (reducedMotion || paused || total < 2) return;

    let timer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      if (timer !== undefined) return;
      timer = setInterval(() => setIndex((current) => (current + 1) % total), ROTATION_MS);
    };

    const stop = () => {
      if (timer === undefined) return;
      clearInterval(timer);
      timer = undefined;
    };

    const onVisibilityChange = () => (document.hidden ? stop() : start());

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [reducedMotion, paused, total]);

  const active = slides[index] ?? slides[0];
  const enquiry = buildWhatsappLink(whatsappNumber, DEFAULT_GENERAL_MESSAGE);
  const whatsappReady = Boolean(enquiry.href) && !enquiry.isPlaceholder;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden border-b border-graphite-800 bg-graphite-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden sm:hidden">
        {slides.map((slide, i) => {
          const mRecord = DEMO_VEHICLES.find((v) => v.id === slide.vehicleId);
          const mPhoto = mRecord ? coverImage(mRecord) : undefined;
          return (
            <div
              key={slide.vehicleId}
              aria-hidden={i === index ? undefined : true}
              className={cn(
                "absolute inset-0 bg-graphite-950 transition-opacity duration-1000",
                i === index ? "opacity-100" : "opacity-0"
              )}
            >
              {mPhoto ? (
                <Image
                  src={resolveImageUrl(mPhoto.storage_path)}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              ) : null}
            </div>
          );
        })}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-graphite-950 via-graphite-950/60 to-transparent"
        />
      </div>
      <div className="absolute inset-0 -z-10 hidden overflow-hidden sm:block">
        {slides.map((slide, i) => {
          /* The frame is the SLIDE'S OWN vehicle photograph — the demo
             record's cover image, keyed by vehicle id — so the copy can never
             claim one marque while showing another. A slide with no photograph
             renders a plain panel: never an illustration, never another car's
             picture. */
          const record = DEMO_VEHICLES.find((v) => v.id === slide.vehicleId);
          const photo = record ? coverImage(record) : undefined;
          return (
            <div
              key={slide.vehicleId}
              aria-hidden
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-out",
                i === index ? "opacity-100" : "opacity-0"
              )}
            >
              <div
                className={cn(
                  "relative h-full w-full",
                  i === index && !reducedMotion ? "ken-burns" : undefined
                )}
              >
                {photo ? (
                  <Image
                    src={photo.storage_path}
                    alt=""
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className="object-cover object-center sm:object-[center_35%]"
                  />
                ) : null}
              </div>
            </div>
          );
        })}

        {/* Two-stage grading so copy stays legible over any frame: a flat
            scrim normalises the photograph's brightness, the theme-coloured
            wash lifts the background behind the copy, and the bottom scrim
            keeps the frame controls readable. */}
        <div className="absolute inset-0 bg-scrim/30" />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 scrim-gradient opacity-60" />
      </div>

      {/* Compact footprint: the hero sets the tone and hands the visitor to the
          showroom. On a 900px-tall laptop the availability strip below is already
          peeking into the first screen, so cars are never more than one scroll
          away. Foreground copy and controls remain stationary while slides
          crossfade in the background. */}
      <div className="container-page relative flex flex-col justify-center py-10 sm:min-h-[24rem] sm:py-16 lg:min-h-[27rem] lg:py-20">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 border border-gold-500/40 bg-gold-500/10 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-300">
            <span aria-hidden className="size-1.5 rounded-full bg-gold-400" />
            <span key={`eyebrow-${active.vehicleId}`} className="transition-opacity duration-300">
              {active.eyebrow}
            </span>
          </p>

          <h1 id="hero-heading" className="text-display-hero text-ink-50">
            {active.headline}
            <br />
            <span className="text-gradient-gold">{active.headlineAccent}</span>
          </h1>

          <p
            key={`body-${active.vehicleId}`}
            className="mt-5 max-w-xl text-sm leading-relaxed text-ink-300 sm:text-base lg:text-lg transition-opacity duration-300"
          >
            {active.body}
          </p>

          {active.featured ? (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-graphite-700 bg-graphite-900/70 px-4 py-1.5 text-xs uppercase tracking-widest text-ink-300 backdrop-blur">
              Featured
              <span key={`featured-${active.vehicleId}`} className="text-gold-300 font-medium">
                {active.featured}
              </span>
            </p>
          ) : null}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/inventory" className="btn-premium-primary px-7 py-3.5 text-base">
              Explore inventory
              <ArrowRight aria-hidden className="size-5" />
            </Link>

            {whatsappReady ? (
              <ButtonLink
                href={enquiry.href as string}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
                className="px-7"
              >
                <MessageCircle aria-hidden />
                Chat on WhatsApp
              </ButtonLink>
            ) : (
              <ButtonLink href="/inventory" variant="outline" size="lg" className="px-7">
                <MessageCircle aria-hidden />
                Browse and enquire
              </ButtonLink>
            )}
          </div>
        </div>

        {total > 1 ? (
          <div
            role="group"
            aria-roledescription="carousel pagination"
            aria-label="Featured vehicles"
            className="mt-8 flex flex-wrap items-center gap-2.5"
          >
            {slides.map((slide, i) => (
              <button
                key={slide.vehicleId}
                type="button"
                aria-current={i === index ? "true" : undefined}
                aria-label={`Show ${slide.featured ?? `slide ${i + 1}`}`}
                onClick={() => go(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index
                    ? "w-12 bg-gold-400"
                    : "w-6 bg-ink-500/50 hover:bg-ink-400/70"
                )}
              />
            ))}
            <span aria-hidden className="ml-2 text-xs tabular-nums text-ink-500">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
        ) : null}
      </div>

      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 gold-accent-line md:w-1/2 lg:w-1/3"
      />
    </section>
  );
}



