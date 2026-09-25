import type { VehicleRow } from "./supabase/types";

/**
 * WhatsApp deep-link builder.
 *
 * The business number is configured by the owner in admin Settings and read
 * from the public settings record. Until a real number is configured we use a
 * clearly identified DEVELOPMENT PLACEHOLDER and never present it as the
 * client's real number.
 */

/** Send this to https://wa.me/<number> — digits only, with country code, no "+". */
export const DEVELOPMENT_WHATSAPP_PLACEHOLDER = "2340000000000";

export const IS_PLACEHOLDER_NUMBER = (number: string | null | undefined) =>
  !number || number === DEVELOPMENT_WHATSAPP_PLACEHOLDER;

export function normaliseWhatsappNumber(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 8) return null;
  return digits;
}

export const DEFAULT_GENERAL_MESSAGE =
  "Hello TrueSpec Automotive, I am interested in your vehicle inventory.";

export function vehicleEnquiryMessage(
  v: Pick<VehicleRow, "year" | "brand" | "model" | "trim">
): string {
  const description = [v.year, v.brand, v.model, v.trim].filter(Boolean).join(" ");
  return `Hello TrueSpec Automotive, I am interested in the ${description}. Please share more details.`;
}

export interface WhatsappLink {
  /** Fully-formed wa.me URL, or null when no valid number is configured. */
  href: string | null;
  message: string;
  isPlaceholder: boolean;
}

/**
 * Builds a WhatsApp link with a correctly URL-encoded pre-filled message.
 * Returns href=null when the configured number is missing/invalid so callers
 * can render a clearly-worded development notice instead of a broken link.
 */
export function buildWhatsappLink(
  rawNumber: string | null | undefined,
  message: string
): WhatsappLink {
  const number = normaliseWhatsappNumber(rawNumber);
  const placeholder = IS_PLACEHOLDER_NUMBER(number);
  if (!number) {
    return { href: null, message, isPlaceholder: true };
  }
  return {
    href: `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
    message,
    isPlaceholder: placeholder,
  };
}
