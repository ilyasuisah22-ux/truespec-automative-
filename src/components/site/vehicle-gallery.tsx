"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/images";
import type { PublicImage } from "@/lib/serializers/public-vehicle";

/**
 * Accessible vehicle image gallery.
 *
 * Interaction support:
 *  - Thumbnails are real buttons with aria-labels and aria-current state.
 *  - Left/Right arrow keys move between images when focus is inside the gallery.
 *  - Home/End jump to first/last.
 *  - Touch users swipe via native scroll-snap on the thumbnail strip.
 *  - Announced politely via aria-live for screen readers.
 */
export function VehicleGallery({
  images,
  title,
}: {
  images: PublicImage[];
  title: string;
}) {
  const [index, setIndex] = React.useState(0);
  const total = images.length;

  const go = React.useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total]
  );

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

  if (total === 0) {
    return (
      <div className="flex aspect-[3/2] w-full items-center justify-center rounded-lg border border-graphite-700 bg-graphite-850 text-sm text-ink-500">
        No photograph available for this vehicle
      </div>
    );
  }

  const active = images[index];

  return (
    <div
      className="space-y-3"
      role="group"
      aria-roledescription="image gallery"
      aria-label={`${title} photographs`}
      onKeyDown={onKeyDown}
      tabIndex={-1}
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border border-graphite-700 bg-graphite-850">
        <Image
          key={active.id}
          src={resolveImageUrl(active.storage_path)}
          alt={`${title} — photograph ${index + 1} of ${total}`}
          fill
          priority={index === 0}
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous photograph"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md border border-graphite-600 bg-graphite-950/80 text-ink-100 hover:border-gold-400 hover:text-gold-200"
            >
              <ChevronLeft aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next photograph"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md border border-graphite-600 bg-graphite-950/80 text-ink-100 hover:border-gold-400 hover:text-gold-200"
            >
              <ChevronRight aria-hidden />
            </button>
          </>
        ) : null}

        <p className="absolute bottom-3 right-3 rounded-sm bg-graphite-950/80 px-2 py-1 text-xs text-ink-200">
          {index + 1} / {total}
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        Photograph {index + 1} of {total}
      </p>

      {total > 1 ? (
        <ul className="flex snap-x gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <li key={img.id} className="snap-start">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Show photograph ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "relative block h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-colors sm:h-20 sm:w-32",
                  i === index ? "border-gold-400" : "border-graphite-700 hover:border-graphite-500"
                )}
              >
                <Image
                  src={resolveImageUrl(img.storage_path)}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
