import "server-only";
import { DEMO_VEHICLE_IDS } from "./demo-data";

/**
 * ============================================================================
 * DEMONSTRATION FINANCIAL DATA — server-only, never sent to the browser as-is
 * ============================================================================
 *
 * These numbers are invented for the audition demo. They must never be
 * presented as TrueSpec Automotive's real costs or profit, and they must never
 * be included in a public API response.
 *
 * `server-only` guarantees a build error if a Client Component ever imports
 * this module.
 */

export interface DemoFinance {
  vehicleId: string;
  purchasePriceKobo: number;
  usaTruckingCostKobo: number;
  shippingCostKobo: number;
  clearingCostKobo: number;
  nigeriaTruckingCostKobo: number;
  fullTankCostKobo: number | null;
  internalNotes: string | null;
  sourcingContact: string | null;
}

const K = (naira: number) => naira * 100;

export const DEMO_FINANCES: DemoFinance[] = [
  {
    vehicleId: DEMO_VEHICLE_IDS.ml350,
    purchasePriceKobo: K(13_500_000),
    usaTruckingCostKobo: K(320_000),
    shippingCostKobo: K(3_150_000),
    clearingCostKobo: K(2_400_000),
    nigeriaTruckingCostKobo: K(450_000),
    fullTankCostKobo: K(110_000),
    internalNotes: "DEMO: auction lot, minor bumper scuff noted on inspection.",
    sourcingContact: "DEMO: Copart agent (placeholder)",
  },
  {
    vehicleId: DEMO_VEHICLE_IDS.bmwX5,
    purchasePriceKobo: K(31_000_000),
    usaTruckingCostKobo: K(380_000),
    shippingCostKobo: K(4_050_000),
    clearingCostKobo: K(3_100_000),
    nigeriaTruckingCostKobo: K(500_000),
    fullTankCostKobo: K(110_000),
    internalNotes: "DEMO: single-owner lease return.",
    sourcingContact: "DEMO: Manheim buyer (placeholder)",
  },
  {
    vehicleId: DEMO_VEHICLE_IDS.landCruiser,
    purchasePriceKobo: K(63_000_000),
    usaTruckingCostKobo: K(420_000),
    shippingCostKobo: K(5_600_000),
    clearingCostKobo: K(6_200_000),
    nigeriaTruckingCostKobo: K(600_000),
    // Deliberately missing so the dashboard demonstrates the
    // "incomplete cost" state instead of a misleading zero.
    fullTankCostKobo: null,
    internalNotes: "DEMO: full-tank cost not yet recorded for this unit.",
    sourcingContact: "DEMO: dealer trade-in (placeholder)",
  },
  {
    vehicleId: DEMO_VEHICLE_IDS.gClass,
    purchasePriceKobo: K(78_000_000),
    usaTruckingCostKobo: K(450_000),
    shippingCostKobo: K(6_150_000),
    clearingCostKobo: K(7_400_000),
    nigeriaTruckingCostKobo: K(650_000),
    fullTankCostKobo: K(130_000),
    internalNotes: "DEMO: arrived with aftermarket exhaust, verified.",
    sourcingContact: "DEMO: private seller (placeholder)",
  },
];

export function getDemoFinance(vehicleId: string): DemoFinance | undefined {
  return DEMO_FINANCES.find((f) => f.vehicleId === vehicleId);
}

/** Default full-tank cost used by the demo settings (₦110,000). */
export const DEMO_DEFAULT_FULL_TANK_COST_KOBO = 110_000 * 100;

export const DEMO_PUBLIC_SETTINGS = {
  whatsapp_number: "2340000000000", // clearly-marked placeholder, never the client's real number
  site_tagline: "Premium vehicle sourcing, inspection and import for Nigerian buyers.",
};
