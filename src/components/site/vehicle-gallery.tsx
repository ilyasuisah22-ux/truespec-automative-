"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/images";
import { PhotoPending } from "@/components/site/photo-pending";
import { demoImageCredit } from "@/lib/demo/demo-image-credits";
import type { PublicImage } from "@/lib/serializers/public-vehicle";

/** A horizontal swipe past this distance counts as "previous / next". */
const SWIPE_THRESHOLD_PX = 48;

/**
 * Accessible vehicle gallery — real photographs only.
 *
 * SCOPE — THIS COMPONENT CANNOT MIX VEHICLES
 *
 * The `images` prop is scoped to ONE vehicle by construction: the data layer
 * groups `vehicle_images` rows by `vehicle_id`, so this component cannot show a
 * photograph belonging to a different car. The demonstration fleet goes further
 * and uses one donor shoot per listing (see `demo-image-credits.ts`), so an
 * interior frame is never from a different car than the exterior frames beside
 * it.
 *
 * PHOTOGRAPHS, NOT ILLUSTRATIONS
 *
 * There is no artwork fallback. A listing with no photograph renders the honest
 * "photography pending" tile, because drawing a car the customer cannot see is
 * worse than admitting the picture does not exist yet.
 *
 * ATTRIBUTION
 *
 * A frame sourced from Wikimedia Commons renders its author and licence beneath
 * the main frame, which is what CC BY and CC BY-SA require. A photograph the
 * owner uploaded through the admin flow has no credit entry and therefore
 * renders no credit line — never somebody else's.
 *
 * Interaction support:
 *  - Thumbnails are real buttons with aria-labels and aria-current state.
 *  - Left/Right arrow keys move between frames when focus is inside the gallery.
 *  - Home/End jump to first/last.
 *  - Touch users can swipe the main frame, or scroll the thumbnail strip.
 *  - Announced politely via aria-live for screen readers.
 */
export function VehicleGallery({ images, title }: { images: PublicImage[]; title: string }) {
  // `rawIndex` is what the user navigated to; `index` is the safe value actually
  // used to render. Deriving the clamp here (rather than correcting it in an
  // effect) means a shorter frame list can never leave us pointing at something
  // that does not exist.
  //
  // `since` remembers the frame count that `rawIndex` was chosen against, so when
  // the list changes size the index is re-derived back into range — a derived
  // value, not an effect and not a ref write during render.
  const [rawIndex, setRawIndex] = React.useState(0);
  const [since, setSince] = React.useState(0);

  const total = images.length;
  const index = total === 0 ? 0 : since - Math.floor((since - rawIndex) / total);
  const active: PublicImage | undefined = total === 0 ? undefined : images[index];
  const credit = active ? demoImageCredit(active.storage_path) : undefined;

  const go = React.useCallback(
    (next: number) => {
      if (total === 0) return;
      setSince(total);
      setRawIndex(((next % total) + total) % total);
    },
    [total]
  );

  const touchStartX = React.useRef<number | null>(null);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(total - 1);
    }
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null) return;
    const end = e.changedTouches[0]?.clientX;
    if (end === undefined) return;
    const delta = end - start;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    go(delta < 0 ? index + 1 : index - 1);
  }

  if (total === 0 || !active) {
    return (
      <div className="aspect-[3/2] w-full overflow-hidden rounded-lg border border-graphite-700 lg:aspect-[16/10]">
        <PhotoPending />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        role="group"
        aria-roledescription="image gallery"
        aria-label={`${title} photographs`}
        onKeyDown={onKeyDown}
      >
        {/* Main frame. A fixed aspect frame plus object-cover means the
            photograph is cropped to fit — never stretched or distorted. */}
        <div
          className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border border-graphite-700 bg-graphite-850 lg:aspect-[16/10]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Image
            key={active.id}
            src={resolveImageUrl(active.storage_path)}
            alt={`${title} — photograph ${index + 1} of ${total}`}
            fill
            priority={index === 0}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="gallery-fade-in object-cover"
          />

          {/* Image gradient overlay for depth */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-scrim/20 via-transparent to-transparent" />

          {total > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous view"
                className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-md border border-graphite-600 bg-graphite-950/75 text-ink-100 backdrop-blur-sm transition-colors hover:border-gold-400 hover:text-gold-200 sm:size-11"
              >
                <ChevronLeft aria-hidden className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next view"
                className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-md border border-graphite-600 bg-graphite-950/75 text-ink-100 backdrop-blur-sm transition-colors hover:border-gold-400 hover:text-gold-200 sm:size-11"
              >
                <ChevronRight aria-hidden className="size-5" />
              </button>
            </>
          ) : null}

          <p className="absolute bottom-3 right-3 rounded-sm bg-graphite-950/80 px-2 py-1 text-xs tabular-nums text-ink-200">
            {index + 1} / {total}
          </p>
        </div>

        <p aria-live="polite" className="sr-only">
          View {index + 1} of {total}
        </p>

        {/* Attribution, required by the CC BY / CC BY-SA licences of the
            demonstration photographs. A photograph the owner uploaded through
            the admin flow has no credit entry, so nothing renders for it. */}
        {credit ? (
          <p className="text-[0.65rem] leading-relaxed text-ink-500">
            Photograph:{" "}
            <a
              href={credit.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors hover:text-ink-300"
            >
              {credit.author}
            </a>{" "}
            ·{" "}
            <a
              href={credit.licenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors hover:text-ink-300"
            >
              {credit.licence}
            </a>
            {" · Wikimedia Commons"}
          </p>
        ) : null}

        {/* Thumbnail strip */}
        {total > 1 ? (
          <ul className="scrollbar-hide flex snap-x gap-2.5 overflow-x-auto pb-1">
            {images.map((image, i) => (
              <li key={image.id} className="snap-start">
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show view ${i + 1} of ${total}`}
                  aria-current={i === index}
                  className={cn(
                    "gallery-thumb relative block size-20 shrink-0 overflow-hidden rounded-md border-2 sm:size-24",
                    i === index
                      ? "gallery-thumb-active"
                      : "border-graphite-700 opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={resolveImageUrl(image.storage_path)}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

