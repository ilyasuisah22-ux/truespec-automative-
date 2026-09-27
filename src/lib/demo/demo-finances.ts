import "server-only";
import { DEMO_VEHICLE_IDS } from "./demo-data";
import {
  DEMO_DEFAULT_FULL_TANK_COST_KOBO,
  DEMO_FINANCE_RECORDS,
  DEMO_PUBLIC_SETTINGS,
  type DemoFinanceRecord,
} from "./demo-records";

/**
 * ============================================================================
 * DEMONSTRATION FINANCIAL DATA -- server-only, never sent to the browser
 * ============================================================================
 *
 * These numbers are invented for the audition demo. They must never be
 * presented as TrueSpec Automotive's real costs or profit, and they must never
 * be included in a public API response.
 *
 * `server-only` guarantees a build error if a Client Component ever imports
 * this module.
 *
 * The literal values live in `demo-records.ts` so the database seeder
 * (`npm run db:seed-demo`) can reuse exactly the same records instead of a
 * hand-maintained SQL copy that could drift. This module remains the only
 * app-facing entry point, and it stays `server-only`.
 */

export type DemoFinance = DemoFinanceRecord;

export const DEMO_FINANCES: DemoFinance[] = DEMO_FINANCE_RECORDS;

export function getDemoFinance(vehicleId: string): DemoFinance | undefined {
  return DEMO_FINANCES.find((f) => f.vehicleId === vehicleId);
}

/**
 * Compile-time guarantee that every cost record points at one of the declared
 * demo vehicle ids, so the fleet and its finances cannot drift apart.
 */
const KNOWN_DEMO_VEHICLE_IDS: ReadonlySet<string> = new Set(Object.values(DEMO_VEHICLE_IDS));
for (const record of DEMO_FINANCES) {
  if (!KNOWN_DEMO_VEHICLE_IDS.has(record.vehicleId)) {
    throw new Error(
      `DEMO finance record references an unknown vehicle id: ${record.vehicleId}. ` +
        "Add it to DEMO_VEHICLE_IDS or remove the record."
    );
  }
}

export { DEMO_DEFAULT_FULL_TANK_COST_KOBO, DEMO_PUBLIC_SETTINGS };
