/**
 * ============================================================================
 * REMOVE THE MISMATCHED DEMO VEHICLE PHOTOGRAPHY FROM SUPABASE
 *
 *   npm run db:remove-demo-images
 *
 * WHY THIS EXISTS
 * The 16 JPEGs under `public/demo/vehicles/` were named after the demo fleet
 * (e.g. `lexus-rx-exterior.jpg`) but the files inside do not depict those
 * vehicles. Verified by opening every file:
 *
 *   lexus-rx-exterior.jpg        -> a Lamborghini Huracan
 *   mercedes-c300-exterior.jpg   -> a BMW M4
 *   range-rover-sport-exterior   -> an Audi A3 Sportback
 *   land-cruiser-exterior        -> a Ford Expedition
 *   porsche-cayenne-exterior     -> a Porsche Panamera
 *   ...and the "-interior.jpg" files are not interiors at all: three of them
 *   are one shared Audi A3 frame and three more are one shared Range Rover
 *   frame (proven by identical MD5 checksums).
 *
 * So the showroom was advertising a Lamborghini as a Lexus RX 350, an Audi as
 * a Range Rover Sport, and so on. That is a misrepresentation of the goods on
 * a live commercial site, not a cosmetic bug.
 *
 * This script deletes the `vehicle_images` rows that point at those files, for
 * the eight demo vehicle ids ONLY. The vehicles themselves are left in place so
 * the owner can attach real photography through the existing admin upload flow.
 *
 * SAFETY
 *  - Requires SUPABASE_SERVICE_ROLE_KEY (RLS bypass). Read from the local
 *    environment, never logged, never written to disk.
 *  - Scoped strictly to `.in("vehicle_id", demoVehicleIds)`. It cannot touch a
 *    real vehicle's imagery.
 *  - Reversible: re-upload through Admin -> vehicle -> images, or re-run
 *    `npm run db:seed-demo` after `demo-data.ts` is given real image rows.
 * ============================================================================
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { DEMO_VEHICLES } from "@/lib/demo/demo-data";

const ENV_FILES = [".env.local", ".env"];

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
  console.error(`\n[remove-demo-images] ${message}\n`);
  process.exit(1);
}

const env = loadEnv();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) fail("NEXT_PUBLIC_SUPABASE_URL is not set.");
if (!serviceKey) fail("SUPABASE_SERVICE_ROLE_KEY is not set.");

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const demoVehicleIds = DEMO_VEHICLES.map((vehicle) => vehicle.id);

async function main() {
  console.log(`\n[remove-demo-images] target project: ${url}`);

  // Report exactly what is about to go, so the deletion is auditable.
  const { data: before, error: readError } = await supabase
    .from("vehicle_images")
    .select("id, vehicle_id, storage_path")
    .in("vehicle_id", demoVehicleIds);
  if (readError) fail(`Could not read current demo images: ${readError.message}`);

  const rows = before ?? [];
  console.log(`[remove-demo-images]   demo image rows found ..... ${rows.length}`);

  if (rows.length === 0) {
    console.log("[remove-demo-images] Nothing to remove. Already clean.");
    return;
  }

  const { error: deleteError } = await supabase
    .from("vehicle_images")
    .delete()
    .in("vehicle_id", demoVehicleIds);
  if (deleteError) fail(`Could not delete demo images: ${deleteError.message}`);

  // Verify rather than assume.
  const { data: after, error: verifyError } = await supabase
    .from("vehicle_images")
    .select("id")
    .in("vehicle_id", demoVehicleIds);
  if (verifyError) fail(`Could not verify deletion: ${verifyError.message}`);

  const remaining = after?.length ?? 0;
  console.log(`[remove-demo-images]   demo image rows remaining . ${remaining}`);

  if (remaining > 0) {
    fail("Deletion did not take effect. No further changes were made.");
  }

  console.log(
    [
      "",
      "[remove-demo-images] Done. The showroom no longer advertises these vehicles",
      "[remove-demo-images] with photographs of other vehicles.",
      "",
      "[remove-demo-images] The eight demo vehicles remain, now showing the",
      "[remove-demo-images] 'photography pending' state. Attach real photographs via",
      "[remove-demo-images] Admin -> Inventory -> [vehicle] -> Images.",
      "",
    ].join("\n")
  );
}

main().catch((error: unknown) => {
  fail(`unexpected error: ${error instanceof Error ? error.message : String(error)}`);
});