"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/images";
import { PhotoPending } from "@/components/site/photo-pending";
import {
  IllustrativeNotice,
  VehicleIllustration,
} from "@/components/site/vehicle-illustration";
import { ARTWORK_VIEWS, hasVehicleArtwork } from "@/lib/demo/vehicle-artwork";
import type { PublicImage } from "@/lib/serializers/public-vehicle";

type ArtworkViewName = (typeof ARTWORK_VIEWS)[number];

/** A horizontal swipe past this distance counts as "previous / next". */
const SWIPE_THRESHOLD_PX = 48;

/**
 * Premium accessible vehicle gallery.
 *
 * SCOPE â€” THIS COMPONENT CANNOT MIX VEHICLES
 *
 * The `images` prop is scoped to ONE vehicle by construction: the data layer
 * groups `vehicle_images` rows by `vehicle_id`, so this component cannot show a
 * photograph belonging to a different car. Illustrative artwork is resolved
 * from the SAME `vehicleId`, and only the eight demonstration vehicles are
 * registered, so artwork can never leak onto a real customer car.
 *
 * REAL PHOTOGRAPHY ALWAYS WINS
 *
 * When a vehicle has uploaded images, those are used and the artwork is never
 * consulted. Artwork is a fallback for the demonstration fleet only.
 *
 * Interaction support:
 *  - Thumbnails are real buttons with aria-labels and aria-current state.
 *  - Left/Right arrow keys move between frames when focus is inside the gallery.
 *  - Home/End jump to first/last.
 *  - Touch users can swipe the main frame, or scroll the thumbnail strip.
 *  - Announced politely via aria-live for screen readers.
 */
export function VehicleGallery({
  images,
  title,
  vehicleId,
}: {
  images: PublicImage[];
  title: string;
  /** Scopes the illustrative fallback to this exact vehicle. */
  vehicleId: string;
}) {
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

  // Real photographs if they exist, otherwise this vehicle's own illustrations.
  const useArtwork = images.length === 0 && hasVehicleArtwork(vehicleId);
  const frames: readonly (string | PublicImage)[] = useArtwork ? ARTWORK_VIEWS : images;

  const total = frames.length;
  const index = total === 0 ? 0 : since - Math.floor((since - rawIndex) / total);

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

  if (total === 0) {
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
        aria-label={`${title} ${useArtwork ? "illustrations" : "photographs"}`}
        onKeyDown={onKeyDown}
      >
        {/* Main frame. A fixed aspect frame plus object-cover / slice means the
            image is cropped to fit â€” never stretched or distorted. */}
        <div
          className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border border-graphite-700 bg-graphite-850 lg:aspect-[16/10]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {useArtwork ? (
            <VehicleIllustration
              key={`${vehicleId}-${frames[index]}`}
              vehicleId={vehicleId}
              view={frames[index] as ArtworkViewName}
              vehicleName={title}
              showCaption
            />
          ) : (
            <Image
              key={(images[index] as PublicImage).id}
              src={resolveImageUrl((images[index] as PublicImage).storage_path)}
              alt={`${title} â€” photograph ${index + 1} of ${total}`}
              fill
              priority={index === 0}
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="gallery-fade-in object-cover"
            />
          )}

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

        {/* Thumbnail strip */}
        {total > 1 ? (
          <ul className="scrollbar-hide flex snap-x gap-2.5 overflow-x-auto pb-1">
            {frames.map((frame, i) => (
              <li key={String(frame)} className="snap-start">
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
                  {useArtwork ? (
                    <VehicleIllustration
                      vehicleId={vehicleId}
                      view={frame as ArtworkViewName}
                      vehicleName={title}
                      showBadge={false}
                    />
                  ) : (
                    <Image
                      src={resolveImageUrl((frame as PublicImage).storage_path)}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {useArtwork ? <IllustrativeNotice /> : null}
    </div>
  );
}
