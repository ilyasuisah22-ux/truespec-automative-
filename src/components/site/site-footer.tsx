import Link from "next/link";
import { Camera, MapPin } from "lucide-react";
import { BrandMark } from "@/components/site/brand-mark";
import { CallCta } from "@/components/site/call-cta";
import { WhatsappCta } from "@/components/site/whatsapp-cta";
import { DEFAULT_GENERAL_MESSAGE, formatPhoneNumber } from "@/lib/whatsapp";

export function SiteFooter({
  whatsappNumber,
  whatsappConfigured,
}: {
  whatsappNumber: string;
  whatsappConfigured: boolean;
}) {
  const year = new Date().getFullYear();
  const phone = formatPhoneNumber(whatsappNumber);

  return (
    <footer className="mt-24 border-t border-graphite-800 bg-graphite-950">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <BrandMark size="md" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-400">
            Vehicle sourcing, inspection and import for Nigerian buyers.
          </p>
          <p className="mt-4 flex items-start gap-2 text-xs text-ink-500">
            <MapPin aria-hidden className="mt-0.5 size-3.5 shrink-0 text-gold-400" />
            Victoria Island, Lagos · Nigeria
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
          {phone ? (
            <p className="font-display text-lg tracking-wide text-ink-50">{phone}</p>
          ) : (
            <p className="text-ink-400">Number not yet configured for this deployment.</p>
          )}
          <p className="mt-3 text-ink-400">
            {whatsappConfigured
              ? "Message us on WhatsApp for availability, inspection bookings and live shipping updates."
              : "WhatsApp is not yet configured for this deployment. Set the business number in Admin → Settings."}
          </p>
          <a
            href="https://instagram.com/truespecbynac"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-ink-300 transition-colors hover:text-gold-200"
            aria-label="TrueSpec Automotive on Instagram"
          >
            <Camera aria-hidden className="size-4" />
            @truespecbynac
          </a>
        </div>

        <div className="text-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-500">
            Talk to us
          </p>
          <p className="mb-4 text-ink-400">
            Prefer to speak to someone? Use WhatsApp for a written trail or call the showroom line.
          </p>
          <div className="flex flex-col gap-2.5">
            <WhatsappCta
              whatsappNumber={whatsappNumber}
              message={DEFAULT_GENERAL_MESSAGE}
              label="Chat on WhatsApp"
              size="md"
              variant="whatsapp"
            />
            <CallCta phoneNumber={whatsappNumber} size="md" variant="outline" />
          </div>
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
