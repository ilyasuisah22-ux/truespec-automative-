import type { VehicleFormValues } from "@/components/admin/vehicle-form";
import type { AdminVehicle } from "@/lib/data/admin";
import { koboToNaira } from "@/lib/money";

/** Converts a stored vehicle record into form values (naira strings). */
export function toFormValues(item: AdminVehicle | null): VehicleFormValues {
  if (!item) {
    return {
      brand: "",
      model: "",
      trim: "",
      year: String(new Date().getFullYear()),
      exterior_color: "",
      interior_color: "",
      mileage: "",
      features: "",
      status: "available",
      customer_price_naira: "",
      public_arrival_note: "",
      purchase_price_naira: "",
      usa_trucking_cost_naira: "",
      shipping_cost_naira: "",
      clearing_cost_naira: "",
      nigeria_trucking_cost_naira: "",
      full_tank_cost_naira: "",
      internal_notes: "",
      sourcing_contact: "",
    };
  }

  const { vehicle, finance } = item;
  const money = (kobo: number | null | undefined) =>
    kobo === null || kobo === undefined ? "" : String(koboToNaira(kobo));

  return {
    brand: vehicle.brand,
    model: vehicle.model,
    trim: vehicle.trim ?? "",
    year: String(vehicle.year),
    exterior_color: vehicle.exterior_color,
    interior_color: vehicle.interior_color,
    mileage: String(vehicle.mileage),
    features: vehicle.features.join("\n"),
    status: vehicle.status,
    customer_price_naira: money(vehicle.customer_price_kobo),
    public_arrival_note: vehicle.public_arrival_note ?? "",
    purchase_price_naira: money(finance?.purchase_price_kobo),
    usa_trucking_cost_naira: money(finance?.usa_trucking_cost_kobo),
    shipping_cost_naira: money(finance?.shipping_cost_kobo),
    clearing_cost_naira: money(finance?.clearing_cost_kobo),
    nigeria_trucking_cost_naira: money(finance?.nigeria_trucking_cost_kobo),
    full_tank_cost_naira: money(finance?.full_tank_cost_kobo),
    internal_notes: finance?.internal_notes ?? "",
    sourcing_contact: finance?.sourcing_contact ?? "",
  };
}
