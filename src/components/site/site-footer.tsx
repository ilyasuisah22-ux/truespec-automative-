import Link from "next/link";
import { BrandMark } from "@/components/site/brand-mark";

export function SiteFooter({ whatsappConfigured }: { whatsappConfigured: boolean }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-graphite-800 bg-graphite-950">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
            Vehicle sourcing, inspection and import for Nigerian buyers.
          </p>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-500">
            Showroom
          </p>
          <ul className="space-y-2">
            <li>
              <Link href="/inventory" className="text-ink-300 hover:text-gold-200">
                All inventory
              </Link>
            </li>
            <li>
              <Link href="/available" className="text-ink-300 hover:text-gold-200">
                Available now
              </Link>
            </li>
            <li>
              <Link href="/on-order" className="text-ink-300 hover:text-gold-200">
                On order
              </Link>
            </li>
            <li>
              <Link href="/landed" className="text-ink-300 hover:text-gold-200">
                Landed this year
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-500">
            Contact
          </p>
          <p className="text-ink-300">
            {whatsappConfigured
              ? "Message us on WhatsApp for availability and inspection bookings."
              : "WhatsApp number not yet configured for this deployment."}
          </p>
          <p className="mt-4 text-ink-400">
            Instagram:{" "}
            <span className="text-ink-300" aria-label="TrueSpec Automotive on Instagram">
              @truespecbynac
            </span>
          </p>
        </div>
      </div>

      <div className="border-t border-graphite-800">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} TrueSpec Automotive. All rights reserved.</p>
          <p>
            Demonstration build — inventory, pricing and imagery shown are illustrative sample data.
          </p>
        </div>
      </div>
    </footer>
  );
}
