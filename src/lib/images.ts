/**
 * Resolves a stored image path into a displayable URL.
 *
 * Two kinds of path are supported:
 *  - Local public assets (start with "/"), used by the demonstration artwork.
 *  - Supabase Storage object paths, served from the public `vehicle-images`
 *    bucket. Only the PUBLIC bucket URL is used; no signed/private URLs and no
 *    service-role keys ever appear here.
 */
export const VEHICLE_IMAGE_BUCKET = "vehicle-images";

export function resolveImageUrl(storagePath: string): string {
  if (!storagePath) return "";
  if (storagePath.startsWith("/") || storagePath.startsWith("http")) return storagePath;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "";
  return `${base}/storage/v1/object/public/${VEHICLE_IMAGE_BUCKET}/${storagePath}`;
}
