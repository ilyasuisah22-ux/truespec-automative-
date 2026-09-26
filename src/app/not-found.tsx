import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-7xl sm:text-8xl text-gold-400/80 tracking-tight">
        404
      </p>
      <div className="section-hero-divider w-24 my-6" />
      <h1 className="mt-2 font-display text-2xl tracking-wide text-ink-50 sm:text-3xl">
        We could not find that page
      </h1>
      <p className="mt-3 max-w-md text-sm text-ink-400">
        The vehicle may have been sold, or the link may be incorrect. Browse the current
        showroom instead.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/inventory">
          <ArrowLeft aria-hidden className="size-4" />
          Browse inventory
        </ButtonLink>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center px-5 text-sm font-medium text-ink-200 hover:text-gold-200 transition-colors"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
