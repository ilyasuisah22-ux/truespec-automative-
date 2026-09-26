import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { rowsOf, rowOf } from "@/lib/supabase/query";
import { isDemoMode } from "@/lib/data/public";
import { DEMO_VEHICLES } from "@/lib/demo/demo-data";
import {
  DEMO_FINANCES,
  DEMO_DEFAULT_FULL_TANK_COST_KOBO,
  DEMO_PUBLIC_SETTINGS,
} from "@/lib/demo/demo-finances";
import { calculateLandedCost, calculateProjectedProfit, type LandedCostResult } from "@/lib/money";
import type {
  VehicleRow,
  VehicleFinanceRow,
  VehicleImageRow,
  VehicleStatus,
} from "@/lib/supabase/types";

/**
 * ============================================================================
 * ADMIN data-access layer — PRIVATE FINANCIAL DATA
 * ============================================================================
 *
 * Every exported function here reads or writes confidential financial
 * information and therefore:
 *   - is marked `server-only` (a Client Component import becomes a build error),
 *   - uses the service-role client (bypasses RLS) ONLY after the caller has run
 *     `requireAdmin()`.
 *
 * Callers in Server Actions / route handlers MUST call requireAdmin() first.
 * These functions do not re-check authorization themselves so they stay
 * composable, but they must never be reachable from a public route.
 */

/** Explicit column lists — never `select('*')`. */
const ADMIN_VEHICLE_COLUMNS =
  "id, slug, brand, model, trim, year, exterior_color, interior_color, mileage, features, status, customer_price_kobo, public_arrival_note, created_at, updated_at";

const FINANCE_COLUMNS =
  "vehicle_id, purchase_price_kobo, usa_trucking_cost_kobo, shipping_cost_kobo, clearing_cost_kobo, nigeria_trucking_cost_kobo, full_tank_cost_kobo, internal_notes, sourcing_contact, created_at, updated_at";

const IMAGE_COLUMNS = "id, vehicle_id, storage_path, display_order, is_cover, created_at";

export interface AdminVehicle {
  vehicle: VehicleRow;
  finance: VehicleFinanceRow | null;
  images: VehicleImageRow[];
  landedCost: LandedCostResult;
  projectedProfitKobo: number | null;
}

export interface DashboardMetrics {
  totalVehicles: number;
  byStatus: Record<VehicleStatus, number>;
  totalLandedCostKobo: number;
  totalProjectedProfitKobo: number;
  /** Vehicles excluded from the totals because a required cost is missing. */
  incompleteCostCount: number;
  isDemo: boolean;
}

function buildAdminVehicle(
  vehicle: VehicleRow,
  finance: VehicleFinanceRow | null,
  images: VehicleImageRow[]
): AdminVehicle {
  const landedCost: LandedCostResult = finance
    ? calculateLandedCost({
        purchasePriceKobo: finance.purchase_price_kobo,
        usaTruckingCostKobo: finance.usa_trucking_cost_kobo,
        shippingCostKobo: finance.shipping_cost_kobo,
        clearingCostKobo: finance.clearing_cost_kobo,
        nigeriaTruckingCostKobo: finance.nigeria_trucking_cost_kobo,
        fullTankCostKobo: finance.full_tank_cost_kobo,
      })
    : { isComplete: false, totalLandedCostKobo: null };

  const profit = calculateProjectedProfit(vehicle.customer_price_kobo, landedCost);

  return {
    vehicle,
    finance,
    images: [...images].sort((a, b) =>
      a.is_cover === b.is_cover ? a.display_order - b.display_order : a.is_cover ? -1 : 1
    ),
    landedCost,
    projectedProfitKobo: profit.projectedProfitKobo,
  };
}


/** Demo-mode inventory assembled from the in-repo demonstration dataset. */
function demoAdminVehicles(): AdminVehicle[] {
  return DEMO_VEHICLES.map((v, index) => {
    const finance = DEMO_FINANCES.find((f) => f.vehicleId === v.id);
    const createdAt = new Date(Date.now() - index * 86_400_000).toISOString();

    const vehicleRow: VehicleRow = {
      id: v.id,
      slug: v.slug,
      brand: v.brand,
      model: v.model,
      trim: v.trim,
      year: v.year,
      exterior_color: v.exterior_color,
      interior_color: v.interior_color,
      mileage: v.mileage,
      features: v.features,
      status: v.status,
      customer_price_kobo: v.customer_price_kobo,
      public_arrival_note: v.public_arrival_note,
      created_at: createdAt,
      updated_at: createdAt,
    };

    const financeRow: VehicleFinanceRow | null = finance
      ? {
          vehicle_id: finance.vehicleId,
          purchase_price_kobo: finance.purchasePriceKobo,
          usa_trucking_cost_kobo: finance.usaTruckingCostKobo,
          shipping_cost_kobo: finance.shippingCostKobo,
          clearing_cost_kobo: finance.clearingCostKobo,
          nigeria_trucking_cost_kobo: finance.nigeriaTruckingCostKobo,
          full_tank_cost_kobo: finance.fullTankCostKobo,
          internal_notes: finance.internalNotes,
          sourcing_contact: finance.sourcingContact,
          created_at: createdAt,
          updated_at: createdAt,
        }
      : null;

    const imageRows: VehicleImageRow[] = v.images.map((img) => ({
      id: img.id,
      vehicle_id: v.id,
      storage_path: img.storage_path,
      display_order: img.display_order,
      is_cover: img.is_cover,
      created_at: createdAt,
    }));

    return buildAdminVehicle(vehicleRow, financeRow, imageRows);
  });
}

export async function getAdminInventory(): Promise<AdminVehicle[]> {
  if (isDemoMode()) return demoAdminVehicles();

  const supabase = createAdminClient();
  const { rows: vehicles, error } = rowsOf<VehicleRow>(
    await supabase
      .from("vehicles")
      .select(ADMIN_VEHICLE_COLUMNS)
      .order("created_at", { ascending: false })
  );
  if (error) throw new Error("Unable to load inventory records.");

  const [financeResult, imageResult] = await Promise.all([
    supabase.from("vehicle_finances").select(FINANCE_COLUMNS),
    supabase.from("vehicle_images").select(IMAGE_COLUMNS),
  ]);

  const { rows: finances } = rowsOf<VehicleFinanceRow>(financeResult);
  const { rows: images } = rowsOf<VehicleImageRow>(imageResult);

  return vehicles.map((vehicle) =>
    buildAdminVehicle(
      vehicle,
      finances.find((f) => f.vehicle_id === vehicle.id) ?? null,
      images.filter((i) => i.vehicle_id === vehicle.id)
    )
  );
}

export async function getAdminVehicle(id: string): Promise<AdminVehicle | null> {
  if (isDemoMode()) {
    return demoAdminVehicles().find((v) => v.vehicle.id === id) ?? null;
  }

  const supabase = createAdminClient();
  const { row: vehicle, error } = rowOf<VehicleRow>(
    await supabase.from("vehicles").select(ADMIN_VEHICLE_COLUMNS).eq("id", id).maybeSingle()
  );
  if (error) throw new Error("Unable to load this vehicle record.");
  if (!vehicle) return null;

  const [financeResult, imageResult] = await Promise.all([
    supabase.from("vehicle_finances").select(FINANCE_COLUMNS).eq("vehicle_id", id).maybeSingle(),
    supabase.from("vehicle_images").select(IMAGE_COLUMNS).eq("vehicle_id", id),
  ]);

  const { row: finance } = rowOf<VehicleFinanceRow>(financeResult);
  const { rows: images } = rowsOf<VehicleImageRow>(imageResult);

  return buildAdminVehicle(vehicle, finance, images);
}


/**
 * Dashboard metrics. Calculated ONLY in this server-side, admin-authorized
 * context — financial aggregates are never exposed through a public API.
 *
 * Vehicles with an incomplete cost profile (e.g. full-tank cost not yet
 * recorded) are EXCLUDED from the totals and reported separately, so the
 * dashboard never implies a misleading figure.
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const inventory = await getAdminInventory();

  const metrics: DashboardMetrics = {
    totalVehicles: inventory.length,
    byStatus: { available: 0, on_order: 0, landed: 0 },
    totalLandedCostKobo: 0,
    totalProjectedProfitKobo: 0,
    incompleteCostCount: 0,
    isDemo: isDemoMode(),
  };

  for (const item of inventory) {
    metrics.byStatus[item.vehicle.status] += 1;
    if (item.landedCost.isComplete && item.landedCost.totalLandedCostKobo !== null) {
      metrics.totalLandedCostKobo += item.landedCost.totalLandedCostKobo;
      metrics.totalProjectedProfitKobo += item.projectedProfitKobo ?? 0;
    } else {
      metrics.incompleteCostCount += 1;
    }
  }

  return metrics;
}

export interface PrivateSettings {
  whatsapp_number: string;
  site_tagline: string;
  default_full_tank_cost_kobo: number;
}

/** Reads the FULL settings row, including the private default full-tank cost. */
export async function getPrivateSettings(): Promise<PrivateSettings> {
  if (isDemoMode()) {
    return {
      ...DEMO_PUBLIC_SETTINGS,
      default_full_tank_cost_kobo: DEMO_DEFAULT_FULL_TANK_COST_KOBO,
    };
  }

  const supabase = createAdminClient();
  const { row } = rowOf<PrivateSettings>(
    await supabase
      .from("site_settings")
      .select("whatsapp_number, site_tagline, default_full_tank_cost_kobo")
      .eq("id", 1)
      .maybeSingle()
  );

  return (
    row ?? {
      whatsapp_number: "",
      site_tagline: "",
      default_full_tank_cost_kobo: 11_000_000,
    }
  );
}

/**
 * Appends an audit-trail entry. Never logs credentials, tokens, or full
 * financial request bodies — only WHAT changed, on WHICH entity, by WHOM.
 */
export async function logAdminActivity(input: {
  actorUserId: string;
  actorEmail?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  if (isDemoMode()) {
    console.info(
      `[audit:demo] ${input.action} ${input.entityType} ${input.entityId ?? "-"} by ${
        input.actorEmail ?? input.actorUserId
      }`
    );
    return;
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("admin_activity_logs").insert({
    actor_user_id: input.actorUserId,
    action: input.action.slice(0, 80),
    entity_type: input.entityType.slice(0, 60),
    entity_id: input.entityId ?? null,
    metadata: (input.metadata ?? {}) as Record<string, string>,
  });

  // Auditing must never break the business operation, but it must be visible.
  if (error) console.error("[audit] failed to write activity log:", error.message);
}

/** Confirms the request-scoped session user (used for display and auditing). */
export async function getSessionUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
