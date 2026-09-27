import Link from "next/link";
import {
  AlertTriangle,
  CarFront,
  CircleDollarSign,
  Images,
  Package,
  PlusCircle,
  Settings,
  Ship,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { InventoryDonut } from "@/components/admin/inventory-donut";
import { RecentInventory } from "@/components/admin/recent-inventory";
import { getAdminInventory, getDashboardMetrics } from "@/lib/data/admin";
import { formatNaira } from "@/lib/money";

export const dynamic = "force-dynamic";

/** Real, working admin destinations only. */
const QUICK_ACTIONS = [
  { href: "/admin/inventory/new", label: "Add vehicle", icon: PlusCircle },
  { href: "/admin/inventory", label: "Manage inventory", icon: CarFront },
  { href: "/admin/inventory", label: "Vehicle images", icon: Images },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export default async function AdminOverviewPage() {
  let metrics;
  let inventory;
  try {
    [metrics, inventory] = await Promise.all([getDashboardMetrics(), getAdminInventory()]);
  } catch {
    return (
      <Alert tone="error" title="Could not load dashboard metrics">
        The database did not respond. Please reload the page, and if the problem persists check your
        Supabase configuration and connection.
      </Alert>
    );
  }

  const cards = [
    { label: "Total inventory", value: metrics.totalVehicles, icon: CarFront, hint: "All listings" },
    {
      label: "Available",
      value: metrics.byStatus.available,
      icon: Package,
      hint: "In stock in Nigeria",
    },
    { label: "On order", value: metrics.byStatus.on_order, icon: Ship, hint: "In transit" },
    {
      label: "Landed",
      value: metrics.byStatus.landed,
      icon: CarFront,
      hint: "Cleared and delivered",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-wide text-ink-50 sm:text-3xl">Overview</h1>
          <p className="mt-2 text-sm text-ink-400">
            Inventory and profitability at a glance. Financial figures are calculated on the server
            from stored cost components.
          </p>
        </div>
        <ButtonLink href="/admin/inventory/new">Add vehicle</ButtonLink>
      </header>

      {metrics.totalVehicles === 0 ? (
        <EmptyState
          icon={<CarFront aria-hidden className="size-8" />}
          title="No vehicles recorded yet"
          description="Create your first listing to see inventory counts and profit projections here."
          action={<ButtonLink href="/admin/inventory/new">Create a listing</ButtonLink>}
        />
      ) : (
        <>
          <section aria-labelledby="inventory-counts">
            <h2 id="inventory-counts" className="sr-only">
              Inventory counts
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map(({ label, value, icon: Icon, hint }) => (
                <li key={label}>
                  <Card>
                    <CardContent>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[0.65rem] uppercase tracking-widest text-ink-500">
                            {label}
                          </p>
                          <p className="mt-2 font-display text-3xl text-ink-50">{value}</p>
                          <p className="mt-1 text-xs text-ink-500">{hint}</p>
                        </div>
                        <Icon aria-hidden className="size-5 text-gold-400" />
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="distribution" className="grid gap-4 lg:grid-cols-5">
            <h2 id="distribution" className="sr-only">
              Inventory distribution
            </h2>

            <Card className="lg:col-span-3">
              <CardHeader className="flex items-center gap-2">
                <CarFront aria-hidden className="size-4 text-gold-400" />
                <CardTitle className="text-sm">Current distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <InventoryDonut byStatus={metrics.byStatus} total={metrics.totalVehicles} />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm">Quick actions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  {QUICK_ACTIONS.map(({ href, label, icon: Icon }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="flex items-center gap-2.5 rounded-md border border-graphite-700 px-3 py-2.5 text-sm text-ink-200 transition-colors hover:border-gold-400/60 hover:bg-graphite-850 hover:text-gold-200"
                      >
                        <Icon aria-hidden className="size-4 shrink-0" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="financials" className="grid gap-4 lg:grid-cols-2">
            <h2 id="financials" className="sr-only">
              Financial summary
            </h2>

            <Card>
              <CardHeader className="flex items-center gap-2">
                <CircleDollarSign aria-hidden className="size-4 text-gold-400" />
                <CardTitle className="text-sm">Total landed cost</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-display text-3xl text-ink-50">
                  {formatNaira(metrics.totalLandedCostKobo)}
                </p>
                <p className="mt-2 text-xs text-ink-500">
                  Sum of purchase, USA trucking, shipping, clearing, Nigeria trucking and full-tank
                  costs across complete records.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center gap-2">
                <TrendingUp aria-hidden className="size-4 text-gold-400" />
                <CardTitle className="text-sm">Total projected profit</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={
                    metrics.totalProjectedProfitKobo >= 0
                      ? "font-display text-3xl text-status-available"
                      : "font-display text-3xl text-danger"
                  }
                >
                  {formatNaira(metrics.totalProjectedProfitKobo)}
                </p>
                <p className="mt-2 text-xs text-ink-500">
                  Customer doorstep price minus total landed cost, for the same complete records.
                </p>
              </CardContent>
            </Card>
          </section>

          {metrics.incompleteCostCount > 0 ? (
            <Alert tone="warning" title="Some vehicles have an incomplete cost profile">
              <p className="flex items-start gap-2">
                <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />
                <span>
                  {metrics.incompleteCostCount}{" "}
                  {metrics.incompleteCostCount === 1 ? "vehicle is" : "vehicles are"} excluded from
                  the totals above because a required cost (for example full-tank cost) has not been
                  recorded. Missing values are never treated as zero.{" "}
                  <Link href="/admin/inventory" className="text-gold-200 underline">
                    Review inventory
                  </Link>
                  .
                </span>
              </p>
            </Alert>
          ) : null}

          <section aria-labelledby="recent-inventory">
            <div className="mb-4 flex items-end justify-between gap-4">
              <h2 id="recent-inventory" className="font-display text-lg tracking-wide text-ink-50">
                Recent inventory
              </h2>
              <Link
                href="/admin/inventory"
                className="text-xs font-medium text-gold-300 hover:text-gold-200"
              >
                View all
              </Link>
            </div>
            <Card>
              <CardContent className="py-1">
                <RecentInventory vehicles={inventory} />
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
