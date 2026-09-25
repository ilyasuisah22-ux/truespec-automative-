import "server-only";
import { createClient } from "@/lib/supabase/server";
import { rowsOf, rowOf } from "@/lib/supabase/query";
import {
  toPublicVehicles,
  toPublicVehicle,
  type PublicImage,
  type SerializableVehicleRow,
} from "@/lib/serializers/public-vehicle";
import type { PublicVehicle } from "@/lib/inventory";
import { isVehicleStatus } from "@/lib/inventory";
import type { VehicleStatus } from "@/lib/supabase/types";
import { getDemoVehicles, getDemoVehicleBySlug, DEMO_VEHICLES } from "@/lib/demo/demo-data";
import { DEMO_PUBLIC_SETTINGS } from "@/lib/demo/demo-finances";

/**
 * PUBLIC data-access layer.
 *
 * Every function here:
 *  - selects an EXPLICIT list of public columns (never `select('*')`),
 *  - never touches `vehicle_finances`,
 *  - passes rows through the allow-list serializer before returning.
 *
 * When Supabase is not configured the layer falls back to clearly-labelled
 * demonstration data so the showroom remains fully demonstrable locally.
 */

/** Explicit public column list — mirrored by the serializer allow-list. */
const PUBLIC_VEHICLE_COLUMNS =
  "id, slug, brand, model, trim, year, exterior_color, interior_color, mileage, features, status, customer_price_kobo, public_arrival_note";

const PUBLIC_IMAGE_COLUMNS = "id, vehicle_id, storage_path, display_order, is_cover";

export const isSupabaseConfigured = (): boolean =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Demo mode is used when Supabase is absent, or explicitly forced. */
export const isDemoMode = (): boolean => !isSupabaseConfigured() || process.env.DEMO_DATA === "true";

export interface PublicSettings {
  whatsapp_number: string;
  site_tagline: string;
}

export type { VehicleStatus } from "@/lib/supabase/types";

function groupImages(rows: Array<PublicImage & { vehicle_id: string }>) {
  const map = new Map<string, PublicImage[]>();
  for (const row of rows) {
    const list = map.get(row.vehicle_id) ?? [];
    list.push({
      id: row.id,
      storage_path: row.storage_path,
      display_order: row.display_order,
      is_cover: row.is_cover,
    });
    map.set(row.vehicle_id, list);
  }
  return map;
}

export async function getPublicVehicles(status?: VehicleStatus): Promise<PublicVehicle[]> {
  if (isDemoMode()) {
    return getDemoVehicles(status);
  }

  const supabase = await createClient();
  let query = supabase
    .from("vehicles")
    .select(PUBLIC_VEHICLE_COLUMNS)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { rows: rawRows, error } = rowsOf<SerializableVehicleRow>(await query);
  if (error) throw new Error("Unable to load inventory right now.");

  const rows = rawRows.filter((row) => isVehicleStatus(row.status));
  if (rows.length === 0) return [];

  const imageResult = await supabase
    .from("vehicle_images")
    .select(PUBLIC_IMAGE_COLUMNS)
    .in(
      "vehicle_id",
      rows.map((r) => r.id)
    );

  const { rows: imageRows, error: imageError } = rowsOf<PublicImage & { vehicle_id: string }>(
    imageResult
  );

  if (imageError) throw new Error("Unable to load vehicle photographs right now.");

  return toPublicVehicles(rows, groupImages(imageRows));
}

export async function getPublicVehicleBySlug(slug: string): Promise<PublicVehicle | null> {
  if (isDemoMode()) {
    return getDemoVehicleBySlug(slug) ?? null;
  }

  const supabase = await createClient();
  const { row, error } = rowOf<SerializableVehicleRow>(
    await supabase.from("vehicles").select(PUBLIC_VEHICLE_COLUMNS).eq("slug", slug).maybeSingle()
  );

  if (error) throw new Error("Unable to load this vehicle right now.");
  if (!row) return null;

  const imageResult = await supabase
    .from("vehicle_images")
    .select(PUBLIC_IMAGE_COLUMNS)
    .eq("vehicle_id", row.id);

  const { rows: imageRows } = rowsOf<PublicImage>(imageResult);

  return toPublicVehicle(row, imageRows);
}

export async function getPublicVehicleSlugs(): Promise<string[]> {
  if (isDemoMode()) return DEMO_VEHICLES.map((v) => v.slug);

  const supabase = await createClient();
  const { rows } = rowsOf<{ slug: string }>(await supabase.from("vehicles").select("slug"));
  return rows.map((r) => r.slug);
}

/**
 * Reads ONLY the two explicitly public settings columns. The private
 * `default_full_tank_cost_kobo` column is not selected and not granted to
 * anonymous database clients.
 */
export async function getPublicSettings(): Promise<PublicSettings> {
  if (isDemoMode()) return DEMO_PUBLIC_SETTINGS;

  const supabase = await createClient();
  const { row } = rowOf<PublicSettings>(
    await supabase.from("site_settings").select("whatsapp_number, site_tagline").eq("id", 1).maybeSingle()
  );

  return row ?? { whatsapp_number: "", site_tagline: "Premium vehicle sourcing and import." };
}
