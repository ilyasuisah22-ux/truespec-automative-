import "server-only";
import { cache } from "react";
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

/**
 * True when the connected database actually contains vehicles.
 *
 * A freshly provisioned Supabase project has the schema and its RLS policies
 * applied but an empty `vehicles` table. Without this check that renders the
 * entire showroom as three empty states, because the demo fallback is only
 * reachable through the explicit `DEMO_DATA` switch.
 *
 * Deliberately queries the WHOLE table with LIMIT 1 and never a
 * status-filtered query: a real inventory that simply has no `landed` vehicles
 * must still show a genuinely empty "Landed" section rather than borrowing demo
 * cars. Request-cached, so all readers on a page share one round trip.
 */
const hasLiveInventory = cache(async (): Promise<boolean> => {
  if (isDemoMode()) return false;
  const supabase = await createClient();
  const { rows, error } = await rowsOf<{ id: string }>(
    await supabase.from("vehicles").select("id").limit(1)
  );
  // An unreachable or misconfigured database is treated as "no live inventory"
  // so the showroom still renders instead of failing outright.
  if (error) return false;
  return rows.length > 0;
});

/**
 * The single decision shared by every public and admin reader: are we serving
 * the in-repo demonstration fleet, or live database rows?
 *
 * True when either
 *  - demo mode is explicitly requested (DEMO_DATA=true / no Supabase), or
 *  - Supabase is connected but holds no vehicles yet.
 *
 * Once a real vehicle exists in the database this is false everywhere, and the
 * demo fleet disappears from both the showroom and the owner dashboard without
 * any further change.
 */
export const isShowroomUsingDemoInventory = cache(
  async (): Promise<boolean> => !(await hasLiveInventory())
);

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
  if (await isShowroomUsingDemoInventory()) {
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
  if (await isShowroomUsingDemoInventory()) {
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
  if (await isShowroomUsingDemoInventory()) return DEMO_VEHICLES.map((v) => v.slug);

  const supabase = await createClient();
  const { rows } = rowsOf<{ slug: string }>(await supabase.from("vehicles").select("slug"));
  return rows.map((r) => r.slug);
}

/** Counts of the public showroom, used by the homepage availability strip. */
export interface PublicInventorySummary {
  total: number;
  byStatus: Record<VehicleStatus, number>;
}

function summarise(vehicles: ReadonlyArray<{ status: VehicleStatus }>): PublicInventorySummary {
  const byStatus: Record<VehicleStatus, number> = { available: 0, on_order: 0, landed: 0 };
  for (const vehicle of vehicles) byStatus[vehicle.status] += 1;
  return { total: vehicles.length, byStatus };
}

/**
 * One cheap `status`-only query gives the homepage its availability strip, so
 * the visitor can orient themselves without waiting on three separate
 * collection queries. Request-cached like the other readers.
 */
export const getPublicInventorySummary = cache(async (): Promise<PublicInventorySummary> => {
  if (await isShowroomUsingDemoInventory()) return summarise(DEMO_VEHICLES);

  const supabase = await createClient();
  const { rows, error } = rowsOf<{ status: string }>(await supabase.from("vehicles").select("status"));
  if (error) return summarise([]);

  // `isVehicleStatus` narrows the scalar, not the row, so re-shape explicitly
  // rather than letting an unknown status reach the counters.
  return summarise(rows.flatMap((row) => (isVehicleStatus(row.status) ? [{ status: row.status }] : [])));
});

/**
 * Reads ONLY the two explicitly public settings columns. The private
 * `default_full_tank_cost_kobo` column is not selected and not granted to
 * anonymous database clients.
 *
 * Wrapped in React's `cache()` so the many enquiry CTAs across a single page
 * render (header, hero, footer, every vehicle card) share one database read
 * instead of issuing a request each.
 */
export const getPublicSettings = cache(async (): Promise<PublicSettings> => {
  if (await isShowroomUsingDemoInventory()) return DEMO_PUBLIC_SETTINGS;

  const supabase = await createClient();
  const { row } = rowOf<PublicSettings>(
    await supabase.from("site_settings").select("whatsapp_number, site_tagline").eq("id", 1).maybeSingle()
  );

  // A missing settings row would otherwise leave the enquiry CTAs with no
  // number at all; the demo settings keep them in a clearly-labelled
  // "not configured yet" state instead of silently disappearing.
  return row ?? DEMO_PUBLIC_SETTINGS;
});
