import type { Metadata } from "next";
import { Alert } from "@/components/ui/alert";
import { InventoryBrowser } from "@/components/site/inventory-browser";
import { getPublicVehicles } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Inventory",
  description:
    "Browse every TrueSpec Automotive listing — available, on order and landed vehicles with transparent doorstep pricing.",
};

export const revalidate = 60;

export default async function InventoryPage() {
  let vehicles;
  try {
    vehicles = await getPublicVehicles();
  } catch {
    return (
      <div className="container-page py-16">
        <Alert tone="error" title="Inventory is temporarily unavailable">
          We could not reach the inventory service. Please retry shortly.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container-page py-14 sm:py-20">
      <header className="mb-10 max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold-400">
          Showroom
        </p>
        <h1 className="font-display text-3xl tracking-wide text-ink-50 sm:text-4xl">
          Full inventory
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-400 sm:text-base">
          Every vehicle currently listed by TrueSpec Automotive, across available, on-order and
          landed status.
        </p>
      </header>

      <InventoryBrowser vehicles={vehicles} />
    </div>
  );
}
