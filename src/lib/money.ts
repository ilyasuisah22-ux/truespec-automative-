/**
 * Money helpers.
 *
 * All monetary amounts are stored and calculated as INTEGER KOBO
 * (1 Naira = 100 kobo) to avoid floating-point rounding errors in
 * financial calculations. Never perform financial math using
 * ordinary floating point Naira values.
 */

/** Format an integer kobo amount as a Nigerian Naira display string, e.g. "₦12,500,000". */
export function formatNaira(kobo: number): string {
  const naira = kobo / 100;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(naira);
}

/** Convert a Naira decimal input (string or number) into integer kobo. Throws on invalid input. */
export function nairaToKobo(input: string | number): number {
  const value = typeof input === "string" ? Number(input.replace(/,/g, "")) : input;
  if (!Number.isFinite(value) || value < 0) {
    throw new Error("Invalid amount: must be a non-negative finite number");
  }
  return Math.round(value * 100);
}

/** Convert integer kobo back into a plain Naira decimal number, for form inputs. */
export function koboToNaira(kobo: number): number {
  return kobo / 100;
}

export interface LandedCostComponents {
  purchasePriceKobo: number;
  usaTruckingCostKobo: number;
  shippingCostKobo: number;
  clearingCostKobo: number;
  nigeriaTruckingCostKobo: number;
  fullTankCostKobo: number | null; // null = missing / incomplete
}

export interface LandedCostResult {
  /** True when every required cost component is present (fullTankCostKobo not null). */
  isComplete: boolean;
  totalLandedCostKobo: number | null;
}

/**
 * Server-side authoritative landed cost calculation.
 * Total Landed Cost = Purchase Price + USA Trucking + Shipping + Clearing + Nigeria Trucking + Full-Tank Cost
 *
 * Returns isComplete=false and totalLandedCostKobo=null when a required component
 * (currently full-tank cost) is missing, rather than silently treating it as zero.
 */
export function calculateLandedCost(components: LandedCostComponents): LandedCostResult {
  const { fullTankCostKobo } = components;
  if (fullTankCostKobo === null || fullTankCostKobo === undefined) {
    return { isComplete: false, totalLandedCostKobo: null };
  }
  const total =
    components.purchasePriceKobo +
    components.usaTruckingCostKobo +
    components.shippingCostKobo +
    components.clearingCostKobo +
    components.nigeriaTruckingCostKobo +
    fullTankCostKobo;
  return { isComplete: true, totalLandedCostKobo: total };
}

export interface ProjectedProfitResult {
  isComplete: boolean;
  projectedProfitKobo: number | null;
}

/**
 * Projected Profit = Customer-Facing Doorstep Price - Total Landed Cost.
 * Returns isComplete=false when landed cost cannot be determined.
 */
export function calculateProjectedProfit(
  customerPriceKobo: number,
  landedCost: LandedCostResult
): ProjectedProfitResult {
  if (!landedCost.isComplete || landedCost.totalLandedCostKobo === null) {
    return { isComplete: false, projectedProfitKobo: null };
  }
  return {
    isComplete: true,
    projectedProfitKobo: customerPriceKobo - landedCost.totalLandedCostKobo,
  };
}

/** Validate a kobo amount is a non-negative safe integer within a sensible ceiling (₦1 billion). */
export function isValidKoboAmount(kobo: unknown): kobo is number {
  return (
    typeof kobo === "number" &&
    Number.isInteger(kobo) &&
    kobo >= 0 &&
    kobo <= 100_000_000_000 // ₦1,000,000,000.00 ceiling
  );
}
