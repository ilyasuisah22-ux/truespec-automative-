/**
 * ============================================================================
 * SEEDABLE PROTOTYPE RECORDS — NOT REAL TRUESPEC AUTOMOTIVE DATA
 * ============================================================================
 *
 * Invented demonstration numbers shared by BOTH the in-app demo fallback and
 * the database seeder (`npm run db:seed-demo`), so the two can never drift.
 *
 * This module deliberately carries NO `server-only` marker, which is what lets
 * build-time tooling import it. That is safe on both sides of the boundary:
 *
 *  - Every value here is invented. No real cost, margin or supplier is
 *    disclosed.
 *  - Nothing here is reachable from the browser bundle: the public data layer
 *    (`lib/data/public.ts`) never imports this module at all.
 *  - The admin-facing wrapper `demo-finances.ts` keeps the `server-only`
 *    marker, so application code can never accidentally route these through a
 *    public surface.
 *
 * Removal before production: `supabase/scripts/remove_demo_data.sql`
 * plus setting DEMO_DATA=false.
 */

/** One row's worth of invented cost data, shaped like `vehicle_finances`. */
export interface DemoFinanceRecord {
  vehicleId: string;
  purchasePriceKobo: number;
  usaTruckingCostKobo: number;
  shippingCostKobo: number;
  clearingCostKobo: number;
  nigeriaTruckingCostKobo: number;
  /** null means "not yet known" so the dashboard can show an incomplete state. */
  fullTankCostKobo: number | null;
  internalNotes: string | null;
  sourcingContact: string | null;
}

/** Naira -> kobo. */
const K = (naira: number) => naira * 100;

export const DEMO_FINANCE_RECORDS: DemoFinanceRecord[] = [
  {
    vehicleId: "d0000000-0000-4000-8000-000000000001",
    purchasePriceKobo: K(52_000_000),
    usaTruckingCostKobo: K(450_000),
    shippingCostKobo: K(4_800_000),
    clearingCostKobo: K(5_200_000),
    nigeriaTruckingCostKobo: K(550_000),
    fullTankCostKobo: K(120_000),
    internalNotes: "DEMO: verified dealer trade-in, comprehensive pre-purchase inspection passed.",
    sourcingContact: "DEMO: Manheim Luxury Division (placeholder)",
  },
  {
    vehicleId: "d0000000-0000-4000-8000-000000000002",
    purchasePriceKobo: K(39_000_000),
    usaTruckingCostKobo: K(400_000),
    shippingCostKobo: K(4_200_000),
    clearingCostKobo: K(4_600_000),
    nigeriaTruckingCostKobo: K(500_000),
    fullTankCostKobo: K(110_000),
    internalNotes: "DEMO: single-owner corporate lease return, spotless maintenance logs.",
    sourcingContact: "DEMO: BMW Financial Services remarketing (placeholder)",
  },
  {
    vehicleId: "d0000000-0000-4000-8000-000000000003",
    purchasePriceKobo: K(44_000_000),
    usaTruckingCostKobo: K(420_000),
    shippingCostKobo: K(4_300_000),
    clearingCostKobo: K(4_800_000),
    nigeriaTruckingCostKobo: K(500_000),
    fullTankCostKobo: K(110_000),
    internalNotes: "DEMO: pristine condition, original paint verified.",
    sourcingContact: "DEMO: Texas wholesale partner (placeholder)",
  },
  {
    vehicleId: "d0000000-0000-4000-8000-000000000004",
    purchasePriceKobo: K(78_000_000),
    usaTruckingCostKobo: K(480_000),
    shippingCostKobo: K(5_400_000),
    clearingCostKobo: K(6_800_000),
    nigeriaTruckingCostKobo: K(600_000),
    fullTankCostKobo: K(130_000),
    internalNotes: "DEMO: dynamic spec with full deployable steps and factory warranty records.",
    sourcingContact: "DEMO: JLR Certified remarketing (placeholder)",
  },
  {
    vehicleId: "d0000000-0000-4000-8000-000000000005",
    purchasePriceKobo: K(110_000_000),
    usaTruckingCostKobo: K(550_000),
    shippingCostKobo: K(6_800_000),
    clearingCostKobo: K(8_500_000),
    nigeriaTruckingCostKobo: K(700_000),
    // Deliberately null so the dashboard demonstrates the incomplete-cost state
    // instead of a misleading zero.
    fullTankCostKobo: null,
    internalNotes: "DEMO: full-tank cost pending final delivery documentation.",
    sourcingContact: "DEMO: Middle East / Gulf export partner (placeholder)",
  },
  {
    vehicleId: "d0000000-0000-4000-8000-000000000006",
    purchasePriceKobo: K(26_000_000),
    usaTruckingCostKobo: K(350_000),
    shippingCostKobo: K(3_400_000),
    clearingCostKobo: K(3_600_000),
    nigeriaTruckingCostKobo: K(450_000),
    fullTankCostKobo: K(100_000),
    internalNotes: "DEMO: AMG Line styling package, low mileage certified.",
    sourcingContact: "DEMO: Florida dealership trade (placeholder)",
  },
  {
    vehicleId: "d0000000-0000-4000-8000-000000000007",
    purchasePriceKobo: K(68_000_000),
    usaTruckingCostKobo: K(460_000),
    shippingCostKobo: K(5_200_000),
    clearingCostKobo: K(6_400_000),
    nigeriaTruckingCostKobo: K(600_000),
    fullTankCostKobo: K(130_000),
    internalNotes: "DEMO: Porsche Sport Chrono pack with adaptive air suspension.",
    sourcingContact: "DEMO: Porsche Centre West consignment (placeholder)",
  },
  {
    vehicleId: "d0000000-0000-4000-8000-000000000008",
    purchasePriceKobo: K(92_000_000),
    usaTruckingCostKobo: K(500_000),
    shippingCostKobo: K(6_000_000),
    clearingCostKobo: K(7_600_000),
    nigeriaTruckingCostKobo: K(650_000),
    fullTankCostKobo: K(140_000),
    internalNotes: "DEMO: rear executive lounge theatre screen specification.",
    sourcingContact: "DEMO: Munich direct allocation (placeholder)",
  },
];

/** Default full-tank cost used by the demo settings (₦110,000). */
export const DEMO_DEFAULT_FULL_TANK_COST_KOBO = 110_000 * 100;

export const DEMO_PUBLIC_SETTINGS = {
  whatsapp_number: "2340000000000", // clearly-marked placeholder, never the client's real number
  site_tagline: "Premium vehicle sourcing, inspection and import for Nigerian buyers.",
};
