"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { authorizeAdmin } from "@/lib/auth/authorize-admin";
import { logAdminActivity } from "@/lib/data/admin";
import { rowsOf } from "@/lib/supabase/query";
import {
  MAX_IMAGES_PER_UPLOAD,
  buildVehicleImagePath,
  validateImageUploads,
} from "@/lib/storage/image-validation";
import { isSupabaseConfigured } from "@/lib/data/public";
import { VEHICLE_IMAGE_BUCKET } from "@/lib/images";

export interface ImageActionState {
  ok?: boolean;
  error?: string;
  message?: string;
  rejected?: Array<{ name: string; reason: string }>;
}

const UUID = /^[0-9a-f-]{36}$/i;
const BUCKET = VEHICLE_IMAGE_BUCKET;

/**
 * Uploads photographs for a vehicle.
 *
 * Security & robustness:
 *  - authorization is re-checked on the server (never trusted from the form),
 *  - the vehicle must exist before anything is uploaded,
 *  - every file's real content type is sniffed from its magic bytes; the
 *    filename extension and browser MIME type are ignored,
 *  - files larger than 5 MB are rejected,
 *  - storage object names are freshly generated UUIDs, so a hostile filename
 *    can never influence the path or overwrite another object,
 *  - at most 10 files per submission, preventing runaway uploads.
 */
export async function uploadVehicleImagesAction(
  _prev: ImageActionState,
  formData: FormData
): Promise<ImageActionState> {
  const auth = await authorizeAdmin();
  if (!auth.ok) return { error: auth.message };
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Demonstration mode: image uploads require a connected Supabase project (Storage bucket `vehicle-images`).",
    };
  }

  const vehicleId = String(formData.get("vehicleId") ?? "");
  if (!UUID.test(vehicleId)) return { error: "Invalid vehicle reference." };

  const files = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length === 0) return { error: "Select at least one photograph to upload." };
  if (files.length > MAX_IMAGES_PER_UPLOAD) {
    return { error: `Upload at most ${MAX_IMAGES_PER_UPLOAD} photographs at a time.` };
  }

  const supabase = createAdminClient();

  const { rows: vehicleRows } = rowsOf<{ id: string }>(
    await supabase.from("vehicles").select("id").eq("id", vehicleId).maybeSingle()
  );
  if (vehicleRows.length === 0) return { error: "That vehicle no longer exists." };

  const { accepted, rejected } = await validateImageUploads(files);
  if (accepted.length === 0) {
    return { error: "None of the selected files are supported images.", rejected };
  }

  const { rows: existing } = rowsOf<{ display_order: number; is_cover: boolean }>(
    await supabase
      .from("vehicle_images")
      .select("display_order, is_cover")
      .eq("vehicle_id", vehicleId)
  );

  let nextOrder = existing.reduce((max, row) => Math.max(max, row.display_order + 1), 0);
  const hasCover = existing.some((row) => row.is_cover);

  const uploaded: Array<{ storage_path: string; display_order: number; is_cover: boolean }> = [];
  const failures: Array<{ name: string; reason: string }> = [];

  for (const item of accepted) {
    const storagePath = buildVehicleImagePath(vehicleId, item.extension);
    const bytes = new Uint8Array(await item.file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, bytes, {
        contentType: item.contentType, // the SNIFFED type, not the claimed one
        upsert: false,
        cacheControl: "31536000",
      });

    if (uploadError) {
      failures.push({ name: item.file.name, reason: "Upload failed — please retry" });
      continue;
    }

    uploaded.push({
      storage_path: storagePath,
      display_order: nextOrder,
      is_cover: !hasCover && uploaded.length === 0,
    });
    nextOrder += 1;
  }

  if (uploaded.length === 0) {
    return { error: "The upload did not complete. No images were added.", rejected: failures };
  }

  const { error: insertError } = await supabase
    .from("vehicle_images")
    .insert(uploaded.map((row) => ({ vehicle_id: vehicleId, ...row })));

  if (insertError) {
    // Roll the storage objects back so imagery cannot exist without a record.
    await supabase.storage
      .from(BUCKET)
      .remove(uploaded.map((row) => row.storage_path));
    console.error("[admin] image record insert failed:", insertError.message);
    return { error: "The images could not be attached to this vehicle. Nothing was saved." };
  }

  await logAdminActivity({
    actorUserId: auth.userId,
    actorEmail: auth.email,
    action: "vehicle.images_upload",
    entityType: "vehicle",
    entityId: vehicleId,
    metadata: { count: uploaded.length },
  });

  revalidatePath(`/admin/inventory/${vehicleId}`);
  revalidatePath("/inventory");

  return {
    ok: true,
    message: `${uploaded.length} photograph${uploaded.length === 1 ? "" : "s"} uploaded.`,
    rejected: [...rejected, ...failures],
  };
}

/** Removes a single photograph and its stored object. */
export async function deleteVehicleImageAction(formData: FormData): Promise<void> {
  const auth = await authorizeAdmin();
  if (!auth.ok || !isSupabaseConfigured()) return;

  const imageId = String(formData.get("imageId") ?? "");
  const vehicleId = String(formData.get("vehicleId") ?? "");
  if (!UUID.test(imageId) || !UUID.test(vehicleId)) return;

  const supabase = createAdminClient();

  const { rows } = rowsOf<{ storage_path: string; is_cover: boolean }>(
    await supabase
      .from("vehicle_images")
      .select("storage_path, is_cover")
      .eq("id", imageId)
      .eq("vehicle_id", vehicleId)
      .maybeSingle()
  );
  const image = rows[0];
  if (!image) return;

  const { error } = await supabase
    .from("vehicle_images")
    .delete()
    .eq("id", imageId)
    .eq("vehicle_id", vehicleId);
  if (error) {
    console.error("[admin] image delete failed:", error.message);
    return;
  }

  if (image.storage_path && !image.storage_path.startsWith("/")) {
    await supabase.storage.from(BUCKET).remove([image.storage_path]);
  }

  // If the cover image was removed, promote the next one so the listing always
  // has a sensible primary photograph.
  if (image.is_cover) {
    const { rows: remaining } = rowsOf<{ id: string }>(
      await supabase
        .from("vehicle_images")
        .select("id")
        .eq("vehicle_id", vehicleId)
        .order("display_order", { ascending: true })
        .limit(1)
    );
    if (remaining[0]) {
      await supabase.from("vehicle_images").update({ is_cover: true }).eq("id", remaining[0].id);
    }
  }

  await logAdminActivity({
    actorUserId: auth.userId,
    actorEmail: auth.email,
    action: "vehicle.image_delete",
    entityType: "vehicle",
    entityId: vehicleId,
  });

  revalidatePath(`/admin/inventory/${vehicleId}`);
}

/** Marks one photograph as the cover image (and clears the flag from others). */
export async function setCoverImageAction(formData: FormData): Promise<void> {
  const auth = await authorizeAdmin();
  if (!auth.ok || !isSupabaseConfigured()) return;

  const imageId = String(formData.get("imageId") ?? "");
  const vehicleId = String(formData.get("vehicleId") ?? "");
  if (!UUID.test(imageId) || !UUID.test(vehicleId)) return;

  const supabase = createAdminClient();

  // Clear first: the partial unique index allows only one cover per vehicle.
  const { error: clearError } = await supabase
    .from("vehicle_images")
    .update({ is_cover: false })
    .eq("vehicle_id", vehicleId);
  if (clearError) {
    console.error("[admin] cover clear failed:", clearError.message);
    return;
  }

  const { error } = await supabase
    .from("vehicle_images")
    .update({ is_cover: true })
    .eq("id", imageId)
    .eq("vehicle_id", vehicleId);
  if (error) {
    console.error("[admin] set cover failed:", error.message);
    return;
  }

  await logAdminActivity({
    actorUserId: auth.userId,
    actorEmail: auth.email,
    action: "vehicle.image_cover",
    entityType: "vehicle",
    entityId: vehicleId,
  });

  revalidatePath(`/admin/inventory/${vehicleId}`);
  revalidatePath("/inventory");
}

/** Reorders a photograph by one position (up/down) within its vehicle. */
export async function reorderVehicleImageAction(formData: FormData): Promise<void> {
  const auth = await authorizeAdmin();
  if (!auth.ok || !isSupabaseConfigured()) return;

  const imageId = String(formData.get("imageId") ?? "");
  const vehicleId = String(formData.get("vehicleId") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (!UUID.test(imageId) || !UUID.test(vehicleId)) return;
  if (direction !== "up" && direction !== "down") return;

  const supabase = createAdminClient();

  const { rows: images, error } = rowsOf<{ id: string; display_order: number }>(
    await supabase
      .from("vehicle_images")
      .select("id, display_order")
      .eq("vehicle_id", vehicleId)
      .order("display_order", { ascending: true })
  );
  if (error) return;

  const index = images.findIndex((img) => img.id === imageId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= images.length) return;

  // Rewrite the whole order explicitly to avoid transient duplicate values.
  const reordered = [...images];
  [reordered[index], reordered[swapWith]] = [reordered[swapWith], reordered[index]];

  for (const [position, image] of reordered.entries()) {
    if (image.display_order === position) continue;
    await supabase
      .from("vehicle_images")
      .update({ display_order: position })
      .eq("id", image.id)
      .eq("vehicle_id", vehicleId);
  }

  revalidatePath(`/admin/inventory/${vehicleId}`);
}

