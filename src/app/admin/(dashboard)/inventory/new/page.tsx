import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { toFormValues } from "@/lib/admin/form-values";
import { getPrivateSettings } from "@/lib/data/admin";
import { isDemoMode } from "@/lib/data/public";
import { ImageManager } from "@/components/admin/image-manager";

export const metadata: Metadata = { title: "Add vehicle", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function NewVehiclePage() {
  const settings = await getPrivateSettings();
  const editable = !isDemoMode();

  return (
    <div className="space-y-7">
      <Link
        href="/admin/inventory"
        className="inline-flex items-center gap-2 text-sm text-ink-300 hover:text-gold-200"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to inventory
      </Link>

      <header>
        <h1 className="font-display text-2xl tracking-wide text-ink-50 sm:text-3xl">Add vehicle</h1>
        <p className="mt-2 text-sm text-ink-400">
          Public details are visible to customers immediately. Financial details stay private and
          are never exposed through the public website or API.
        </p>
      </header>

      <VehicleForm
        mode="create"
        defaults={toFormValues(null)}
        defaultFullTankNaira={settings.default_full_tank_cost_kobo / 100}
        editable={editable}
      />

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-lg tracking-wide text-ink-50">
            Section 2 — Photographs
          </h2>
          <p className="mt-1 text-sm text-ink-400">
            Photographs can be uploaded once the listing has been created and saved.
          </p>
        </div>
        <Alert tone="info">
          Save this vehicle first. The photograph uploader becomes available on the saved listing so
          images are always attached to a real record.
        </Alert>
        <div className="pointer-events-none opacity-60" aria-hidden>
          <ImageManager vehicleId="pending" images={[]} editable={false} />
        </div>
      </section>
    </div>
  );
}
