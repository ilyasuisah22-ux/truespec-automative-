"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { authorizeAdmin } from "@/lib/auth/authorize-admin";
import { vehicleFormSchema, fieldErrors } from "@/lib/validation/schemas";
import { logAdminActivity, getPrivateSettings } from "@/lib/data/admin";
import { rowsOf } from "@/lib/supabase/query";
import { NarrowableResult } from "@/lib/supabase/query";
import { uniqueSlug } from "@/lib/storage/image-validation";
import { isSupabaseConfigured } from "@/lib/data/public";
import type { VehicleRow, VehicleStatus } from "@/lib/supabase/types";

export interface VehicleActionState {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

const DEMO_WRITE_MESSAGE =
  "Demonstration mode: Supabase is not connected, so changes are not persisted. Follow the README to connect your Supabase project, then reload this page to manage live inventory.";

function revalidateInventory() {
  revalidatePath("/admin");
  revalidatePath("/admin/inventory");
  revalidatePath("/inventory");
  revalidatePath("/available");
  revalidatePath("/on-order");
  revalidatePath("/landed");
}

/** Reads and validates the submitted form, mapping it to DB-ready values. */
async function parseForm(formData: FormData) {
  const parsed = vehicleFormSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false as const, fieldErrors: fieldErrors(parsed.error) };
  }

  const data = parsed.data;

  // Full-tank cost: if the owner left it blank we apply the CURRENT configured
  // default and SNAPSHOT it into the row. Changing the global default later
  // therefore never rewrites this vehicle's historical cost profile.
  let fullTankKobo = data.full_tank_cost_naira;
  if (fullTankKobo === null) {
    const settings = await getPrivateSettings();
    fullTankKobo = settings.default_full_tank_cost_kobo;
  }

  return {
    ok: true as const,
    data,
    vehicle: {
      brand: data.brand,
      model: data.model,
      trim: data.trim,
      year: data.year,
      exterior_color: data.exterior_color,
      interior_color: data.interior_color,
      mileage: data.mileage,
      features: data.features,
      status: data.status,
      // NOTE: the customer price is only trusted as a SOURCE INPUT.
      // Landed cost and profit are always derived on the server from the cost
      // components; the browser never submits a total that we store.
      customer_price_kobo: data.customer_price_naira ?? 0,
      public_arrival_note: data.public_arrival_note,
    },
    finance: {
      purchase_price_kobo: data.purchase_price_naira,
      usa_trucking_cost_kobo: data.usa_trucking_cost_naira,
      shipping_cost_kobo: data.shipping_cost_naira,
      clearing_cost_kobo: data.clearing_cost_naira,
      nigeria_trucking_cost_kobo: data.nigeria_trucking_cost_naira,
      full_tank_cost_kobo: fullTankKobo,
      internal_notes: data.internal_notes,
      sourcing_contact: data.sourcing_contact,
    },
  };
}

export async function createVehicleAction(
  _prev: VehicleActionState,
  formData: FormData
): Promise<VehicleActionState> {
  const auth = await authorizeAdmin();
  if (!auth.ok) {
    return { error: `${auth.message}` };
  }
  if (!isSupabaseConfigured()) {
    return { error: DEMO_WRITE_MESSAGE };
  }

  const parsed = await parseForm(formData);
  if (!parsed.ok) return { fieldErrors: parsed.fieldErrors };

  const supabase = createAdminClient();

  // --- Duplicate-submission / duplicate-record protection -------------------
  // A resubmitted form (double click, refresh, network retry) for the same
  // vehicle details is rejected instead of creating a second record.
  // Note: select columns below are a subset of VehicleRow columns; the type
  // narrowing below uses a type assertion because explicit-column selects
  // cannot match the full row interface per our security model. The runtime
  // data still passes through the serializer / assertNoPrivateFields guard.
  const { rows: existing, error: existingError } = rowsOf<VehicleRow>(
    (await supabase
      .from("vehicles")
      .select("id, slug, brand, model, trim, year")
      .eq("brand", parsed.vehicle.brand)
      .eq("model", parsed.vehicle.model)
      .eq("year", parsed.vehicle.year)) as unknown as NarrowableResult<VehicleRow>
  );

  if (existingError) {
    return { error: "Could not verify existing inventory. Please retry." };
  }

  const duplicate = existing.find(
    (row) => (row.trim ?? "") === (parsed.vehicle.trim ?? "")
  );
  if (duplicate) {
    return {
      error:
        "A vehicle with the same brand, model, trim and year already exists. Edit that listing instead of creating a duplicate.",
    };
  }

  const slug = uniqueSlug(
    [parsed.vehicle.year, parsed.vehicle.brand, parsed.vehicle.model, parsed.vehicle.trim],
    existing.map((row) => row.slug)
  );

  const { data: inserted, error: insertError } = await supabase
    .from("vehicles")
    .insert({ ...parsed.vehicle, slug })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("[admin] create vehicle failed:", insertError?.message);
    return { error: "Unable to save this vehicle. No changes were made." };
  }

  const { error: financeError } = await supabase
    .from("vehicle_finances")
    .insert({ vehicle_id: inserted.id, ...parsed.finance });

  if (financeError) {
    // Roll back the partial record so inventory and finances never diverge.
    await supabase.from("vehicles").delete().eq("id", inserted.id);
    console.error("[admin] create vehicle finances failed:", financeError.message);
    return { error: "Unable to save the financial details. No vehicle was created." };
  }

  await logAdminActivity({
    actorUserId: auth.userId,
    actorEmail: auth.email,
    action: "vehicle.create",
    entityType: "vehicle",
    entityId: inserted.id,
    metadata: { status: parsed.vehicle.status },
  });

  revalidateInventory();
  redirect(`/admin/inventory/${inserted.id}?created=1`);
}


export async function updateVehicleAction(
  _prev: VehicleActionState,
  formData: FormData
): Promise<VehicleActionState> {
  const auth = await authorizeAdmin();
  if (!auth.ok) {
    return { error: `${auth.message}` };
  }
  if (!isSupabaseConfigured()) {
    return { error: DEMO_WRITE_MESSAGE };
  }

  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return { error: "Invalid vehicle reference." };
  }

  const parsed = await parseForm(formData);
  if (!parsed.ok) return { fieldErrors: parsed.fieldErrors };

  const supabase = createAdminClient();

  const { error: updateError } = await supabase
    .from("vehicles")
    .update(parsed.vehicle)
    .eq("id", id);

  if (updateError) {
    console.error("[admin] update vehicle failed:", updateError.message);
    return { error: "Unable to save changes. Nothing was updated." };
  }

  const { error: financeError } = await supabase
    .from("vehicle_finances")
    .upsert({ vehicle_id: id, ...parsed.finance }, { onConflict: "vehicle_id" });

  if (financeError) {
    console.error("[admin] update finances failed:", financeError.message);
    return {
      error:
        "The vehicle details were saved, but the financial details could not be updated. Please retry saving the financial section.",
    };
  }

  await logAdminActivity({
    actorUserId: auth.userId,
    actorEmail: auth.email,
    action: "vehicle.update",
    entityType: "vehicle",
    entityId: id,
    metadata: { status: parsed.vehicle.status },
  });

  revalidateInventory();
  revalidatePath(`/admin/inventory/${id}`);
  redirect(`/admin/inventory/${id}?updated=1`);
}


export async function setVehicleStatusAction(formData: FormData): Promise<void> {
  const auth = await authorizeAdmin();
  if (!auth.ok || !isSupabaseConfigured()) return;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  if (!["available", "on_order", "landed"].includes(status)) return;

  const supabase = createAdminClient();
  const { error } = await supabase.from("vehicles").update({ status: status as VehicleStatus }).eq("id", id);

  if (error) {
    console.error("[admin] status change failed:", error.message);
    return;
  }

  await logAdminActivity({
    actorUserId: auth.userId,
    actorEmail: auth.email,
    action: "vehicle.status_change",
    entityType: "vehicle",
    entityId: id,
    metadata: { status },
  });

  revalidateInventory();
  revalidatePath(`/admin/inventory/${id}`);
}

/**
 * Deletes a vehicle. Related financial rows and image records are removed by
 * ON DELETE CASCADE; stored objects are removed explicitly first so no orphaned
 * imagery is left in the bucket.
 */
export async function deleteVehicleAction(formData: FormData): Promise<void> {
  const auth = await authorizeAdmin();
  if (!auth.ok || !isSupabaseConfigured()) return;

  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;

  const supabase = createAdminClient();

  const { rows: images } = rowsOf<{ storage_path: string }>(
    await supabase.from("vehicle_images").select("storage_path").eq("vehicle_id", id)
  );

  const objectPaths = images
    .map((img) => img.storage_path)
    .filter((path) => path && !path.startsWith("/") && !path.startsWith("http"));

  if (objectPaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("vehicle-images")
      .remove(objectPaths);
    if (storageError) {
      // Non-fatal: the database rows still cascade. Log for follow-up cleanup.
      console.error("[admin] storage cleanup failed:", storageError.message);
    }
  }

  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) {
    console.error("[admin] delete vehicle failed:", error.message);
    return;
  }

  await logAdminActivity({
    actorUserId: auth.userId,
    actorEmail: auth.email,
    action: "vehicle.delete",
    entityType: "vehicle",
    entityId: id,
  });

  revalidateInventory();
  redirect("/admin/inventory?deleted=1");
}
