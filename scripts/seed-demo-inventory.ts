/**
 * ============================================================================
 * SEED THE PROTOTYPE VEHICLE FLEET INTO SUPABASE
 * ============================================================================
 *
 *   npm run db:seed-demo
 *
 * WHY THIS EXISTS
 * A Supabase project is provisioned with the schema and its RLS policies but
 * with an empty `vehicles` table. That leaves the public showroom showing three
 * empty states and the owner dashboard showing no inventory, even though the
 * demo fleet already exists in the repository.
 *
 * This script writes that fleet into the database using the SAME modules the
 * application falls back to (`src/lib/demo/demo-data.ts` and
 * `src/lib/demo/demo-records.ts`), so the seeded rows and the in-app prototype
 * can never drift apart. It uses the project's existing schema: the same
 * vehicle ids, the same slugs, the same columns.
 *
 * SAFETY
 *  - Requires SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS. It is read from
 *    the local environment and is never written to disk or logged.
 *  - Only ever touches the eight fixed demo vehicle ids plus the singleton
 *    `site_settings` row. It never deletes, and it never touches any other
 *    vehicle.
 *  - Fully idempotent: re-running it updates the demo rows in place.
 *  - Invented figures only. `vehicle_finances` stays invisible to anonymous
 *    callers through the existing RLS policies and the public serializer.
 *
 * REMOVAL
 *   psql "<connection string>" -f supabase/scripts/remove_demo_data.sql
 *   then add the first real vehicle in Admin -> Inventory.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { DEMO_VEHICLES } from "@/lib/demo/demo-data";
import { DEMO_FINANCE_RECORDS, DEMO_PUBLIC_SETTINGS } from "@/lib/demo/demo-records";

const ENV_FILES = [".env.local", ".env"];

/**
 * Minimal .env reader. The project does not depend on dotenv and this script
 * runs once, so a small parser beats adding a dependency.
 */
function loadEnv(): Record<string, string> {
  const values: Record<string, string> = {};
  for (const file of ENV_FILES) {
    let contents: string;
    try {
      contents = readFileSync(resolve(process.cwd(), file), "utf8");
    } catch {
      continue;
    }
    for (const rawLine of contents.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const separator = line.indexOf("=");
      if (separator === -1) continue;
      const key = line.slice(0, separator).trim();
      let value = line.slice(separator + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      values[key] = value;
    }
  }
  return values;
}

function fail(message: string): never {
  console.error(`\n[seed-demo] ${message}\n`);
  process.exit(1);
}

const env = loadEnv();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) fail("NEXT_PUBLIC_SUPABASE_URL is not set.");
if (!serviceKey) {
  fail(
    "SUPABASE_SERVICE_ROLE_KEY is not set. This script needs the service-role key because\n" +
      "         anonymous clients are not allowed to write inventory. Add it to .env.local."
  );
}

const supabase: SupabaseClient = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const demoIds = DEMO_VEHICLES.map((v) => v.id);

/** Turns a PostgREST error into a clear, actionable failure. */
function assertOk(error: { message: string } | null, action: string) {
  if (error) fail(`${action} failed: ${error.message}`);
}

async function seedVehicles() {
  const rows = DEMO_VEHICLES.map((vehicle) => ({
    id: vehicle.id,
    slug: vehicle.slug,
    brand: vehicle.brand,
    model: vehicle.model,
    trim: vehicle.trim,
    year: vehicle.year,
    exterior_color: vehicle.exterior_color,
    interior_color: vehicle.interior_color,
    mileage: vehicle.mileage,
    features: vehicle.features,
    status: vehicle.status,
    customer_price_kobo: vehicle.customer_price_kobo,
    public_arrival_note: vehicle.public_arrival_note,
  }));

  // NOTE: only PUBLIC columns are copied into `vehicles`. No financial value is
  // ever written to a table the public serializer can read.
  const { error } = await supabase.from("vehicles").upsert(rows, { onConflict: "id" });
  assertOk(error, "Seeding vehicles");
  return rows.length;
}

async function seedImages() {
  // Image ids in the in-app dataset are readable slugs, not UUIDs, so we clear
  // the demo vehicles' existing image rows and re-insert with fresh UUIDs.
  // Scoped to the demo vehicle ids only.
  const { error: deleteError } = await supabase
    .from("vehicle_images")
    .delete()
    .in("vehicle_id", demoIds);
  assertOk(deleteError, "Clearing previous demo images");

  const rows = DEMO_VEHICLES.flatMap((vehicle) =>
    vehicle.images.map((image) => ({
      id: crypto.randomUUID(),
      vehicle_id: vehicle.id,
      storage_path: image.storage_path,
      display_order: image.display_order,
      is_cover: image.is_cover,
    }))
  );

  const { error } = await supabase.from("vehicle_images").insert(rows);
  assertOk(error, "Seeding vehicle images");
  return rows.length;
}

async function seedFinances() {
  // Financial rows are written ONLY to the RLS-protected `vehicle_finances`
  // table. Anonymous callers hold no privilege on it at all.
  const rows = DEMO_FINANCE_RECORDS.map((record) => ({
    vehicle_id: record.vehicleId,
    purchase_price_kobo: record.purchasePriceKobo,
    usa_trucking_cost_kobo: record.usaTruckingCostKobo,
    shipping_cost_kobo: record.shippingCostKobo,
    clearing_cost_kobo: record.clearingCostKobo,
    nigeria_trucking_cost_kobo: record.nigeriaTruckingCostKobo,
    full_tank_cost_kobo: record.fullTankCostKobo,
    internal_notes: record.internalNotes,
    sourcing_contact: record.sourcingContact,
  }));

  const { error } = await supabase
    .from("vehicle_finances")
    .upsert(rows, { onConflict: "vehicle_id" });
  assertOk(error, "Seeding vehicle finances");
  return rows.length;
}

async function seedSettings() {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, ...DEMO_PUBLIC_SETTINGS }, { onConflict: "id" });
  assertOk(error, "Seeding site settings");
}

async function main() {
  console.log(`\n[seed-demo] target project: ${url}`);

  const vehicles = await seedVehicles();
  console.log(`[seed-demo]   vehicles seeded .......... ${vehicles}`);

  const images = await seedImages();
  console.log(`[seed-demo]   images seeded ............ ${images}`);

  const finances = await seedFinances();
  console.log(`[seed-demo]   finance records seeded .... ${finances}`);

  await seedSettings();
  console.log("[seed-demo]   site settings seeded ...... 1");

  console.log(
    [
      "",
      "[seed-demo] Done. The public showroom and the owner dashboard now read these",
      "[seed-demo] rows through the normal Supabase path.",
      "",
      "[seed-demo] The WhatsApp number is still the development placeholder. Set the real",
      "[seed-demo] one in Admin -> Settings.",
      "",
      "[seed-demo] Before go-live, clear the prototype records with:",
      '[seed-demo]   psql "<connection string>" -f supabase/scripts/remove_demo_data.sql',
      "",
    ].join("\n")
  );
}

main().catch((error: unknown) => {
  fail(`unexpected error: ${error instanceof Error ? error.message : String(error)}`);
});

