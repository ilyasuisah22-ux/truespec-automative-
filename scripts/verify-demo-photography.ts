/**
 * ============================================================================
 * VERIFY THE DEMONSTRATION PHOTOGRAPHY
 * ============================================================================
 *
 *   npx tsx scripts/verify-demo-photography.ts
 *
 * WHY THIS EXISTS
 *
 * The demonstration showroom now shows real, licensed photographs. Two ways it
 * can silently go wrong are (a) a listing referencing a file that is not on
 * disk, and (b) the same photograph being reused for two different vehicles —
 * which is exactly how the withdrawn image set went wrong in the first place.
 *
 * This script fails loudly on:
 *   - a credit entry with no matching file in `public/demo/vehicles/`
 *   - a file in `public/demo/vehicles/` that no credit describes
 *   - a demo listing image with no credit record
 *   - a demo listing with no photograph at all (warned, not failed: "photography
 *     pending" is a legitimate state, but it should be deliberate)
 *   - two files sharing a checksum (the same photograph used twice)
 *   - a file that is not a decodable JPEG of adequate resolution
 *
 * It reads local files only: no network access, no Supabase, no credentials.
 */
import { createHash } from "node:crypto";
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import sharp from "sharp";
import { DEMO_VEHICLES } from "../src/lib/demo/demo-data";
import { DEMO_IMAGE_CREDITS, demoImageCredit } from "../src/lib/demo/demo-image-credits";

const PUBLIC_ROOT = resolve(process.cwd(), "public");
const VEHICLE_ROOT = join(PUBLIC_ROOT, "demo", "vehicles");

/** Minimum long edge, so a listing never renders a thumbnail as its cover. */
const MIN_LONG_EDGE = 1000;

const problems: string[] = [];
const warnings: string[] = [];

function diskPaths(): string[] {
  const found: string[] = [];
  for (const dir of readdirSync(VEHICLE_ROOT)) {
    const absolute = join(VEHICLE_ROOT, dir);
    if (!statSync(absolute).isDirectory()) continue;
    for (const file of readdirSync(absolute)) {
      found.push(`/demo/vehicles/${dir}/${file}`);
    }
  }
  return found.sort();
}

async function main() {
  const onDisk = diskPaths();

  /* 1. Every credit points at a real file. */
  for (const credit of DEMO_IMAGE_CREDITS) {
    if (!onDisk.includes(credit.path)) {
      problems.push(`credit has no file on disk: ${credit.path}`);
    }
  }

  /* 2. Every file is described by a credit — no unattributed photograph can
        sit in the public directory. */
  for (const path of onDisk) {
    if (!demoImageCredit(path)) {
      problems.push(`file on disk has no credit record: ${path}`);
    }
  }

  /* 3. Every listing image is credited, and files are valid photographs. */
  const checksums = new Map<string, string>();
  let attached = 0;

  for (const vehicle of DEMO_VEHICLES) {
    if (vehicle.images.length === 0) {
      warnings.push(`${vehicle.slug} has no photograph (renders "Photography pending")`);
      continue;
    }
    if (!vehicle.images.some((image) => image.is_cover)) {
      problems.push(`${vehicle.slug} has photographs but no cover image`);
    }

    for (const image of vehicle.images) {
      attached += 1;
      if (!demoImageCredit(image.storage_path)) {
        problems.push(`${vehicle.slug} uses an uncredited photograph: ${image.storage_path}`);
        continue;
      }

      const absolute = join(PUBLIC_ROOT, image.storage_path);
      let buffer: Buffer;
      try {
        buffer = readFileSync(absolute);
      } catch {
        problems.push(`${vehicle.slug} references a missing file: ${image.storage_path}`);
        continue;
      }

      const sha = createHash("sha256").update(buffer).digest("hex");
      const previous = checksums.get(sha);
      if (previous) {
        problems.push(`the same photograph is used twice: ${previous} and ${image.storage_path}`);
      } else {
        checksums.set(sha, image.storage_path);
      }

      try {
        const meta = await sharp(absolute).metadata();
        const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);
        if (meta.format !== "jpeg") {
          problems.push(`${image.storage_path} is ${meta.format}, expected jpeg`);
        }
        if (longEdge < MIN_LONG_EDGE) {
          problems.push(
            `${image.storage_path} is only ${meta.width}x${meta.height}; long edge must be >= ${MIN_LONG_EDGE}px`
          );
        }
      } catch (error) {
        problems.push(`${image.storage_path} is not decodable: ${(error as Error).message}`);
      }
    }
  }

  /* Report. */
  console.log(
    `[verify-demo-photography] ${DEMO_IMAGE_CREDITS.length} credits, ` +
      `${onDisk.length} files on disk, ${attached} frames attached to listings.`
  );
  console.log(
    `  vehicle root: ${relative(process.cwd(), VEHICLE_ROOT).split("\\").join("/")}`
  );
  for (const warning of warnings) console.log(`  WARN  ${warning}`);
  for (const problem of problems) console.log(`  FAIL  ${problem}`);

  if (problems.length > 0) {
    console.error(`\n[verify-demo-photography] ${problems.length} problem(s). Nothing was changed.\n`);
    process.exit(1);
  }

  console.log("[verify-demo-photography] OK: every photo is licensed, credited, unique and present.\n");
}

main().catch((error) => {
  console.error(`[verify-demo-photography] ${(error as Error).message}`);
  process.exit(1);
});
