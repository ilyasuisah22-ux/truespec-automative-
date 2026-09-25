import { formatNaira } from "./money";
import type { VehicleRow, VehicleStatus, VehicleImageRow } from "./supabase/types";

/**
 * PUBLIC inventory domain logic.
 *
 * This module is safe to import from client and server public code: it never
 * references financial columns and only works with the public vehicle shape.
 */

export const VEHICLE_STATUSES: VehicleStatus[] = ["available", "on_order", "landed"];

/** Customer-facing labels for the internal status values. */
export const STATUS_LABELS: Record<VehicleStatus, string> = {
  available: "Available",
  on_order: "On Order",
  landed: "Landed",
};

export const STATUS_DESCRIPTIONS: Record<VehicleStatus, string> = {
  available: "In stock and ready for inspection and purchase.",
  on_order: "Purchased and currently in transit to Nigeria.",
  landed: "Cleared and delivered this year.",
};

export function isVehicleStatus(value: unknown): value is VehicleStatus {
  return typeof value === "string" && (VEHICLE_STATUSES as string[]).includes(value);
}

/** URL-safe slug generation for shareable, non-identifying vehicle URLs. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function vehicleTitle(v: Pick<VehicleRow, "year" | "brand" | "model" | "trim">): string {
  return [v.year, v.brand, v.model, v.trim].filter(Boolean).join(" ");
}

export function formatMileage(mileage: number): string {
  return `${new Intl.NumberFormat("en-NG").format(mileage)} km`;
}

/**
 * Renders the customer-facing price. Returns a neutral fallback rather than
 * "₦0" when a price has not been set, so the public site never shows a
 * misleading zero price.
 */
export function displayCustomerPrice(customer_price_kobo: number | null): string {
  if (customer_price_kobo === null || customer_price_kobo === undefined || customer_price_kobo <= 0) {
    return "Price on request";
  }
  return formatNaira(customer_price_kobo);
}

/** Returns the cover image (or the first image) for a public vehicle, if any. */
export function coverImage(v: PublicVehicle) {
  if (!v.images || v.images.length === 0) return undefined;
  return v.images.find((img) => img.is_cover) ?? v.images[0];
}

/** A public vehicle with its images, as returned by the public data layer. */
export interface PublicVehicle {
  id: string;
  slug: string;
  brand: string;
  model: string;
  trim: string | null;
  year: number;
  exterior_color: string;
  interior_color: string;
  mileage: number;
  features: string[];
  status: VehicleStatus;
  customer_price_kobo: number;
  public_arrival_note: string | null;
  images: Pick<VehicleImageRow, "id" | "storage_path" | "display_order" | "is_cover">[];
}
