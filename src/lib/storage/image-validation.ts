import "server-only";
import { slugify } from "@/lib/inventory";

/**
 * Image upload validation.
 *
 * We do NOT trust the filename extension or the browser-supplied MIME type.
 * Instead we sniff the file's magic bytes and only accept real JPEG, PNG, WebP
 * or AVIF payloads. Anything else is rejected before it reaches storage.
 */

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB, matches the bucket limit
export const MAX_IMAGES_PER_UPLOAD = 10;

export type DetectedImageType = "image/jpeg" | "image/png" | "image/webp" | "image/avif";

function startsWith(bytes: Uint8Array, signature: number[]): boolean {
  if (bytes.length < signature.length) return false;
  return signature.every((byte, i) => bytes[i] === byte);
}

/** Sniffs the real content type from the file header. Returns null if unsupported. */
export function detectImageType(bytes: Uint8Array): DetectedImageType | null {
  // JPEG: FF D8 FF
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  // WebP: "RIFF" .... "WEBP"
  if (
    startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    bytes.length >= 12 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  // AVIF: "ftyp" box with "avif" brand at offset 4
  if (
    bytes.length >= 12 &&
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70 &&
    bytes[8] === 0x61 &&
    bytes[9] === 0x76 &&
    bytes[10] === 0x69 &&
    bytes[11] === 0x66
  ) {
    return "image/avif";
  }
  return null;
}

export interface ValidatedImage {
  file: File;
  contentType: DetectedImageType;
  extension: string;
}

const EXTENSION_BY_TYPE: Record<DetectedImageType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export interface ImageValidationResult {
  accepted: ValidatedImage[];
  rejected: Array<{ name: string; reason: string }>;
}

/** Validates every uploaded file, returning accepted files and per-file reasons. */
export async function validateImageUploads(files: File[]): Promise<ImageValidationResult> {
  const accepted: ValidatedImage[] = [];
  const rejected: Array<{ name: string; reason: string }> = [];

  for (const file of files) {
    const name = file.name || "unnamed file";

    if (file.size === 0) {
      rejected.push({ name, reason: "File is empty" });
      continue;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      rejected.push({ name, reason: "Larger than the 5 MB limit" });
      continue;
    }

    const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    const detected = detectImageType(header);

    if (!detected) {
      rejected.push({
        name,
        reason: "Not a supported image (JPEG, PNG, WebP or AVIF required)",
      });
      continue;
    }

    accepted.push({ file, contentType: detected, extension: EXTENSION_BY_TYPE[detected] });
  }

  return { accepted, rejected };
}

/** Object path inside the bucket. Never contains financial data or client names. */
export function buildVehicleImagePath(vehicleId: string, extension: string): string {
  return `vehicles/${vehicleId}/${crypto.randomUUID()}.${extension}`;
}

/**
 * Produces a slug that is unique across existing slugs, so creating a second
 * similar listing cannot silently overwrite or duplicate the first.
 */
export function uniqueSlug(
  parts: Array<string | number | null | undefined>,
  existingSlugs: string[]
): string {
  const base = slugify(parts.filter(Boolean).join(" ")) || "vehicle";
  if (!existingSlugs.includes(base)) return base;
  let suffix = 2;
  while (existingSlugs.includes(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}
