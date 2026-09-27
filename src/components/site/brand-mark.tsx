import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Official TrueSpec Automotive logo lockup.
 *
 * The brand ships as two ink variants derived from the same artwork — white ink
 * for dark surfaces and black ink for light surfaces — rather than a single
 * recolourable SVG. `surface="adaptive"` renders both and swaps them with CSS
 * (see `.theme-dark-only` / `.theme-light-only` in globals.css) so the logo
 * follows the visitor's theme without any JavaScript.
 *
 * `surface="dark"` pins the white-ink lockup. Prefer the default adaptive mode
 * anywhere the theme can change — including the owner dashboard, which follows
 * its own light/dark setting, since a pinned white lockup would be invisible on
 * a light header.
 */

export const TRUESPEC_LOGO = {
  /** White ink — for dark graphite surfaces. */
  onDark: "/truespec-logo-white.png",
  /** Black ink — for paper-white surfaces. */
  onLight: "/truespec-logo-black.png",
} as const;

/** Intrinsic size of both PNG lockups, used to reserve layout space. */
const LOGO_WIDTH = 432;
const LOGO_HEIGHT = 195;

const SIZE_CLASSES = {
  sm: "w-[104px]",
  md: "w-[126px]",
  lg: "w-[150px]",
} as const;

export type BrandMarkSize = keyof typeof SIZE_CLASSES;

export function BrandMark({
  className,
  size = "md",
  surface = "adaptive",
  priority = false,
}: {
  className?: string;
  size?: BrandMarkSize;
  surface?: "adaptive" | "dark";
  /** Set on above-the-fold lockups (header, hero) to avoid a lazy-load flash. */
  priority?: boolean;
}) {
  const widthClass = SIZE_CLASSES[size];
  const imgClassName = cn("h-auto shrink-0", widthClass);
  const imageProps = {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
    priority,
    sizes: "160px",
  } as const;

  return (
    <span
      className={cn("inline-flex items-center", className)}
      role="img"
      aria-label="TrueSpec Automotive"
    >
      {surface === "dark" ? (
        <Image
          {...imageProps}
          src={TRUESPEC_LOGO.onDark}
          alt=""
          aria-hidden
          className={imgClassName}
        />
      ) : (
        <>
          <Image
            {...imageProps}
            src={TRUESPEC_LOGO.onDark}
            alt=""
            aria-hidden
            className={cn("theme-dark-only", imgClassName)}
          />
          <Image
            {...imageProps}
            src={TRUESPEC_LOGO.onLight}
            alt=""
            aria-hidden
            className={cn("theme-light-only", imgClassName)}
          />
        </>
      )}
    </span>
  );
}

