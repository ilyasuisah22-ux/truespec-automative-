import "server-only";
import type { VehicleRow, VehicleImageRow, VehicleStatus } from "@/lib/supabase/types";
import type { PublicVehicle } from "@/lib/inventory";

/**
 * ============================================================================
 * PUBLIC VEHICLE SERIALIZER — EXPLICIT ALLOW-LIST
 * ============================================================================
 *
 * This is a hard security boundary. It is the ONLY place where a database
 * vehicle row is converted into a response that may reach an anonymous user.
 *
 * Rules enforced here:
 *  1. The output object is CONSTRUCTED field-by-field from an explicit
 *     allow-list. We never spread a database row and we never delete
 *     properties from a full record.
 *  2. `vehicle_finances` data (purchase price, trucking, shipping, clearing,
 *     landed cost, profit, internal notes, sourcing contacts) is NEVER read
 *     into this file and can never be emitted, even by accident.
 *  3. Adding a new column to `vehicles` in the database does NOT make it
 *     public. A developer must consciously add it below.
 *
 * `PUBLIC_VEHICLE_FIELDS` documents the allow-list and is asserted in tests.
 */

export const PUBLIC_VEHICLE_FIELDS = [
  "id",
  "slug",
  "brand",
  "model",
  "trim",
  "year",
  "exterior_color",
  "interior_color",
  "mileage",
  "features",
  "status",
  "customer_price_kobo",
  "public_arrival_note",
  "images",
] as const;

/** Field names that must never appear in a public payload. Asserted in tests. */
export const FORBIDDEN_PUBLIC_FIELDS = [
  "purchase_price_kobo",
  "usa_trucking_cost_kobo",
  "shipping_cost_kobo",
  "clearing_cost_kobo",
  "nigeria_trucking_cost_kobo",
  "full_tank_cost_kobo",
  "internal_notes",
  "sourcing_contact",
  "landed_cost_kobo",
  "total_landed_cost_kobo",
  "projected_profit_kobo",
  "profit_kobo",
  "admin_users",
  "actor_user_id",
] as const;

export type PublicImage = Pick<VehicleImageRow, "id" | "storage_path" | "display_order" | "is_cover">;

/** The exact subset of `vehicles` columns the public serializer is allowed to read. */
export type SerializableVehicleRow = Pick<
  VehicleRow,
  | "id"
  | "slug"
  | "brand"
  | "model"
  | "trim"
  | "year"
  | "exterior_color"
  | "interior_color"
  | "mileage"
  | "features"
  | "status"
  | "customer_price_kobo"
  | "public_arrival_note"
>;

/**
 * Maps a raw vehicle row + its public images into the explicit public DTO.
 * Only the allow-listed keys are read from `row`.
 */
export function toPublicVehicle(
  row: SerializableVehicleRow,
  images: PublicImage[] = []
): PublicVehicle {
  return {
    // --- allow-listed public fields only ---
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    trim: row.trim,
    year: row.year,
    exterior_color: row.exterior_color,
    interior_color: row.interior_color,
    mileage: row.mileage,
    features: Array.isArray(row.features) ? [...row.features] : [],
    status: row.status as VehicleStatus,
    customer_price_kobo: row.customer_price_kobo,
    public_arrival_note: row.public_arrival_note,
    images: (images ?? [])
      .map((img) => ({
        id: img.id,
        storage_path: img.storage_path,
        display_order: img.display_order,
        is_cover: img.is_cover,
      }))
      .sort((a, b) => {
        if (a.is_cover !== b.is_cover) return a.is_cover ? -1 : 1;
        return a.display_order - b.display_order;
      }),
  };
}

export function toPublicVehicles(
  rows: SerializableVehicleRow[],
  imagesByVehicle: Map<string, PublicImage[]> = new Map()
): PublicVehicle[] {
  return rows.map((row) => toPublicVehicle(row, imagesByVehicle.get(row.id) ?? []));
}

/**
 * Defensive runtime check used by tests and by API handlers before writing a
 * response: throws if any forbidden key is present anywhere in the payload.
 */
export function assertNoPrivateFields(payload: unknown, path = "$"): void {
  if (payload === null || payload === undefined) return;
  if (Array.isArray(payload)) {
    payload.forEach((item, i) => assertNoPrivateFields(item, `${path}[${i}]`));
    return;
  }
  if (typeof payload !== "object") return;

  for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
    if ((FORBIDDEN_PUBLIC_FIELDS as readonly string[]).includes(key)) {
      throw new Error(`Private field "${key}" detected in public payload at ${path}.${key}`);
    }
    assertNoPrivateFields(value, `${path}.${key}`);
  }
}
