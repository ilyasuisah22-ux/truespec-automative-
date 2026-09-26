import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { ImageManager } from "@/components/admin/image-manager";
import { StatusChanger } from "@/components/admin/status-changer";
import { toFormValues } from "@/lib/admin/form-values";
import { getAdminVehicle, getPrivateSettings } from "@/lib/data/admin";
import { isDemoMode } from "@/lib/data/public";
import { formatNaira } from "@/lib/money";
import { vehicleTitle } from "@/lib/inventory";

export const metadata: Metadata = { title: "Edit vehicle", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditVehiclePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);

  let item;
  try {
    item = await getAdminVehicle(id);
  } catch {
    return (
      <Alert tone="error" title="Could not load this vehicle">
        The database did not respond. Reload the page, or return to the inventory list.
      </Alert>
    );
  }

  if (!item) notFound();

  const settings = await getPrivateSettings();
  const editable = !isDemoMode();
  const title = vehicleTitle(item.vehicle);

  return (
    <div className="space-y-7">
      <Link
        href="/admin/inventory"
        className="inline-flex items-center gap-2 text-sm text-ink-300 hover:text-gold-200"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to inventory
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-wide text-ink-50 sm:text-3xl">{title}</h1>
          <p className="mt-2 text-xs text-ink-500">
            Slug: {item.vehicle.slug} · Created{" "}
            {new Date(item.vehicle.created_at).toLocaleDateString("en-NG")} · Updated{" "}
            {new Date(item.vehicle.updated_at).toLocaleDateString("en-NG")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusChanger
            vehicleId={item.vehicle.id}
            current={item.vehicle.status}
            editable={editable}
          />
          <ButtonLink
            href={`/inventory/${item.vehicle.slug}`}
            variant="outline"
            size="sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink aria-hidden />
            View public page
          </ButtonLink>
        </div>
      </header>

      {query.created ? <Alert tone="success">The listing was created and saved.</Alert> : null}
      {query.updated ? <Alert tone="success">Your changes were saved.</Alert> : null}

      <Alert tone="info" title="Live financial summary">
        Total landed cost{" "}
        <strong className="text-ink-50">
          {item.landedCost.totalLandedCostKobo === null
            ? "— incomplete cost profile"
            : formatNaira(item.landedCost.totalLandedCostKobo)}
        </strong>{" "}
        · Projected profit{" "}
        <strong className="text-ink-50">
          {item.projectedProfitKobo === null ? "—" : formatNaira(item.projectedProfitKobo)}
        </strong>
        . Both are derived on the server from the stored cost components.
      </Alert>

      <VehicleForm
        mode="edit"
        vehicleId={item.vehicle.id}
        defaults={toFormValues(item)}
        defaultFullTankNaira={settings.default_full_tank_cost_kobo / 100}
        editable={editable}
      />

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-lg tracking-wide text-ink-50">
            Section 2 — Photographs
          </h2>
          <p className="mt-1 text-sm text-ink-400">
            Upload photographs, drag to reorder, choose the cover image, or remove images you no
            longer need.
          </p>
        </div>
        <ImageManager
          vehicleId={item.vehicle.id}
          images={item.images.map((image) => ({
            id: image.id,
            storage_path: image.storage_path,
            display_order: image.display_order,
            is_cover: image.is_cover,
          }))}
          editable={editable}
        />
      </section>
    </div>
  );
}
