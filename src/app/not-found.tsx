import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-6xl text-gold-400">404</p>
      <h1 className="mt-4 font-display text-2xl tracking-wide text-ink-50">
        We could not find that page
      </h1>
      <p className="mt-3 max-w-md text-sm text-ink-400">
        The vehicle may have been sold, or the link may be incorrect. Browse the current showroom
        instead.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/inventory">Browse inventory</ButtonLink>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center px-5 text-sm text-ink-200 hover:text-gold-200"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
