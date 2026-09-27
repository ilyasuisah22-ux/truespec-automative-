import { CarFront } from "lucide-react";
import { VehicleCard } from "@/components/site/vehicle-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { getPublicSettings, getPublicVehicles } from "@/lib/data/public";
import { STATUS_LABELS } from "@/lib/inventory";
import type { VehicleStatus } from "@/lib/supabase/types";

/**
 * Server component that renders a database-backed collection of vehicles.
 *
 * Handles the three explicit async states required by the brief: empty state,
 * error state (with retry guidance) and the populated success state.
 *
 * `getPublicSettings` is request-cached, so fetching it here (rather than
 * threading `whatsappNumber` down through every caller) costs nothing extra.
 */
export async function InventoryCollection({
  status,
  emptyTitle,
  emptyDescription,
}: {
  status?: VehicleStatus;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  let vehicles;
  let whatsappNumber = "";
  try {
    const [rows, settings] = await Promise.all([getPublicVehicles(status), getPublicSettings()]);
    vehicles = rows;
    whatsappNumber = settings.whatsapp_number;
  } catch {
    return (
      <Alert tone="error" title="We could not load this collection">
        The inventory service did not respond. Please retry in a moment — if the problem persists,
        contact us on WhatsApp.
      </Alert>
    );
  }

  if (vehicles.length === 0) {
    const label = status ? STATUS_LABELS[status] : "inventory";
    return (
      <EmptyState
        icon={<CarFront aria-hidden className="size-8" />}
        title={emptyTitle ?? `No ${label.toLowerCase()} vehicles right now`}
        description={
          emptyDescription ??
          "New units are added regularly. Check back soon or send us a WhatsApp message with the exact vehicle you are looking for."
        }
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <li key={vehicle.id}>
          <VehicleCard vehicle={vehicle} whatsappNumber={whatsappNumber} />
        </li>
      ))}
    </ul>
  );
}
