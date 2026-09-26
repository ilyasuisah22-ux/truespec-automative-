import { CarFront } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { InventoryTable, type InventoryTableRow } from "@/components/admin/inventory-table";
import { getAdminInventory } from "@/lib/data/admin";
import { isDemoMode } from "@/lib/data/public";
import { vehicleTitle } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const { deleted } = await searchParams;

  let inventory;
  try {
    inventory = await getAdminInventory();
  } catch {
    return (
      <Alert tone="error" title="Could not load inventory">
        The database did not respond. Reload the page, and if the problem continues verify your
        Supabase configuration.
      </Alert>
    );
  }

  const rows: InventoryTableRow[] = inventory.map((item) => ({
    id: item.vehicle.id,
    slug: item.vehicle.slug,
    title: vehicleTitle(item.vehicle),
    status: item.vehicle.status,
    customerPriceKobo: item.vehicle.customer_price_kobo,
    landedCostKobo: item.landedCost.totalLandedCostKobo,
    profitKobo: item.projectedProfitKobo,
  }));

  const canEdit = !isDemoMode();

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-wide text-ink-50 sm:text-3xl">Inventory</h1>
          <p className="mt-2 text-sm text-ink-400">
            Every listing with its customer price, total landed cost and projected profit.
          </p>
        </div>
        <ButtonLink href="/admin/inventory/new">Add vehicle</ButtonLink>
      </header>

      {deleted ? (
        <Alert tone="success">The listing and its related records were deleted.</Alert>
      ) : null}

      {rows.length === 0 ? (
        <EmptyState
          icon={<CarFront aria-hidden className="size-8" />}
          title="No inventory yet"
          description="Create your first listing to start managing vehicles and their financial records."
          action={<ButtonLink href="/admin/inventory/new">Add your first vehicle</ButtonLink>}
        />
      ) : (
        <InventoryTable rows={rows} editable={canEdit} />
      )}
    </div>
  );
}
