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
    vehicleId: DEMO_VEHICLE_IDS.mercedesGle,
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
    vehicleId: DEMO_VEHICLE_IDS.bmwX5,
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
    vehicleId: DEMO_VEHICLE_IDS.lexusRx,
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
    vehicleId: DEMO_VEHICLE_IDS.rangeRoverSport,
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
    vehicleId: DEMO_VEHICLE_IDS.landCruiser,
    purchasePriceKobo: K(110_000_000),
    usaTruckingCostKobo: K(550_000),
    shippingCostKobo: K(6_800_000),
    clearingCostKobo: K(8_500_000),
    nigeriaTruckingCostKobo: K(700_000),
    // Deliberately missing so dashboard demonstrates the incomplete cost state gracefully
    fullTankCostKobo: null,
    internalNotes: "DEMO: full-tank cost pending final delivery documentation.",
    sourcingContact: "DEMO: Middle East / Gulf export partner (placeholder)",
  },
  {
    vehicleId: DEMO_VEHICLE_IDS.mercedesC300,
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
    vehicleId: DEMO_VEHICLE_IDS.porscheCayenne,
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
    vehicleId: DEMO_VEHICLE_IDS.bmw7Series,
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

export function getDemoFinance(vehicleId: string): DemoFinance | undefined {
  return DEMO_FINANCES.find((f) => f.vehicleId === vehicleId);
}

/** Default full-tank cost used by the demo settings (₦110,000). */
export const DEMO_DEFAULT_FULL_TANK_COST_KOBO = 110_000 * 100;

export const DEMO_PUBLIC_SETTINGS = {
  whatsapp_number: "2340000000000", // clearly-marked placeholder, never the client's real number
  site_tagline: "Premium vehicle sourcing, inspection and import for Nigerian buyers.",
};

