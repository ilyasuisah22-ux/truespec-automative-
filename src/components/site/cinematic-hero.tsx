"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { DEFAULT_GENERAL_MESSAGE, buildWhatsappLink } from "@/lib/whatsapp";

export interface HeroSlide {
  /** Public image path (currently `/demo/vehicles/*.jpg`). */
  src: string;
  eyebrow: string;
  /** Rendered on line one of the headline. */
  headline: string;
  /** Rendered on line two in the metallic gold gradient. */
  headlineAccent: string;
  body: string;
  /** Vehicle the slide showcases — surfaced as a pill so it reads as a listing. */
  featured?: string;
}

const ROTATION_MS = 6500;

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
 * - Frames crossfade behind a copy block with an 18s Ken Burns drift, so stills
 *   feel filmed rather than pasted.
 * - Rotation is driven by `setInterval` and paused while the document is
 *   hidden, so a backgrounded tab never accumulates work.
 * - The first frame is server-rendered, so the hero is complete without JS.
 * - `prefers-reduced-motion: reduce` disables both the rotation and the drift
 *   and leaves a single static frame with working frame controls.
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
      <div className="absolute inset-0 -z-10">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            aria-hidden
            className={cn(
              "absolute inset-0 transition-opacity duration-[1400ms] ease-out",
              i === index ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={slide.src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={cn(
                "object-cover object-center",
                i === index && !reducedMotion ? "ken-burns" : undefined
              )}
            />
          </div>
        ))}

        {/* Two-stage grading so copy stays legible over any frame: a flat
            scrim normalises the photograph's brightness, the theme-coloured
            wash lifts the background behind the copy, and the bottom scrim
            keeps the frame controls readable. */}
        <div className="absolute inset-0 bg-scrim/35" />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 scrim-gradient opacity-60" />
      </div>

      <div className="container-page relative flex min-h-[36rem] flex-col justify-center py-20 sm:py-28 lg:min-h-[42rem] lg:py-32">
        <div key={active.src} className="max-w-3xl hero-copy-rise">
          <p className="mb-6 inline-flex items-center gap-2 border border-gold-500/40 bg-gold-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            <span aria-hidden className="size-1.5 rounded-full bg-gold-400" />
            {active.eyebrow}
          </p>

          <h1 id="hero-heading" className="text-display-hero text-ink-50">
            {active.headline}
            <br />
            <span className="text-gradient-gold">{active.headlineAccent}</span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">
            {active.body}
          </p>

          {active.featured ? (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-graphite-700 bg-graphite-900/70 px-4 py-1.5 text-xs uppercase tracking-widest text-ink-300 backdrop-blur">
              Featured
              <span className="text-gold-300">{active.featured}</span>
            </p>
          ) : null}

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="/inventory" className="btn-premium-primary px-8 py-4 text-base">
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
                className="px-8"
              >
                <MessageCircle aria-hidden />
                Chat on WhatsApp
              </ButtonLink>
            ) : (
              <ButtonLink href="/inventory" variant="outline" size="lg" className="px-8">
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
            className="mt-14 flex flex-wrap items-center gap-2.5"
          >
            {slides.map((slide, i) => (
              <button
                key={slide.src}
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
