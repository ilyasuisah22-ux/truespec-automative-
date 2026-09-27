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

export interface CallLink {
  /** `tel:` URL, or null when no usable number is configured. */
  href: string | null;
  /** Pretty, human-readable version of the number for button labels. */
  display: string | null;
  isPlaceholder: boolean;
}

/**
 * Human-readable rendering of a configured business number.
 *
 * Nigerian numbers are stored in international form without a leading "+"
 * (e.g. `2348012345678`), so we format that specific shape and fall back to a
 * simple grouped rendering for anything else.
 */
export function formatPhoneNumber(raw: string | null | undefined): string | null {
  const digits = normaliseWhatsappNumber(raw);
  if (!digits) return null;

  if (digits.length === 13 && digits.startsWith("234")) {
    const local = digits.slice(3); // 10 digits, e.g. 8012345678
    return `+234 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
  }

  if (digits.length > 6) {
    return `+${digits.slice(0, 3)} ${digits.slice(3).replace(/(\d{3})(?=\d)/g, "$1 ").trim()}`;
  }

  return `+${digits}`;
}

/**
 * Builds a telephone link.
 *
 * The public site only has ONE configured business number (the WhatsApp line),
 * so that same number powers the "Call" action. Like `buildWhatsappLink`, this
 * returns href=null for the development placeholder so we never dial — or
 * display — a number that looks real but is not.
 */
export function buildCallLink(rawNumber: string | null | undefined): CallLink {
  const number = normaliseWhatsappNumber(rawNumber);
  const placeholder = IS_PLACEHOLDER_NUMBER(number);
  if (!number || placeholder) {
    return { href: null, display: null, isPlaceholder: true };
  }
  return {
    href: `tel:+${number}`,
    display: formatPhoneNumber(number),
    isPlaceholder: false,
  };
}

/** Short label for a Call button, e.g. "Call +234 801 234 5678". */
export function callActionLabel(rawNumber: string | null | undefined, fallback = "Call us"): string {
  const { display } = buildCallLink(rawNumber);
  return display ? `Call ${display}` : fallback;
}
