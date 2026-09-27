/**
 * Renders every demonstration vehicle's artwork to PNG contact sheets so the
 * artwork can be reviewed by eye.
 *
 * This is a development aid, not part of the application. It renders the same
 * component the site uses through `react-dom/server`, then rasterises the
 * resulting SVG with sharp.
 *
 * Usage: npx tsx scripts/render-artwork-preview.ts
 */
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { DEMO_VEHICLES } from "../src/lib/demo/demo-data";
import { ARTWORK_VIEWS } from "../src/lib/demo/vehicle-artwork";
import { VehicleIllustration } from "../src/components/site/vehicle-illustration";

const OUT_DIR = join(process.cwd(), ".artwork-preview");
const CELL_W = 480;
const CELL_H = 270;
const COLS = 4;

const fileStem = (v: { brand: string; model: string }) =>
  `${v.brand}-${v.model}`.replace(/\s+/g, "_");

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  for (const vehicle of DEMO_VEHICLES) {
    const name = fileStem(vehicle);

    for (const view of ARTWORK_VIEWS) {
      // Render the component, then lift the <svg> out of its wrapper.
      const html = renderToStaticMarkup(
        VehicleIllustration({
          vehicleId: vehicle.id,
          view,
          vehicleName: `${vehicle.brand} ${vehicle.model}`,
        })
      );
      const start = html.indexOf("<svg");
      const end = html.lastIndexOf("</svg>") + 6;
      const svg = html.slice(start, end);

      writeFileSync(join(OUT_DIR, `${name}--${view}.svg`), svg);

      await sharp(Buffer.from(svg))
        .resize(CELL_W, CELL_H, { fit: "cover" })
        .png()
        .toFile(join(OUT_DIR, `${name}--${view}.png`));
    }

    // Contact sheet: this vehicle's four views side by side.
    const tiles = await Promise.all(
      ARTWORK_VIEWS.map((view) =>
        sharp(join(OUT_DIR, `${name}--${view}.png`)).toBuffer()
      )
    );
    await sharp({
      create: {
        width: CELL_W * ARTWORK_VIEWS.length,
        height: CELL_H,
        channels: 3,
        background: "#000",
      },
    })
      .composite(tiles.map((input, i) => ({ input, left: i * CELL_W, top: 0 })))
      .png()
      .toFile(join(OUT_DIR, `SHEET--${name}.png`));
  }

  // Grand sheet: every vehicle's three-quarter view, one grid.
  const threeQuarter = await Promise.all(
    DEMO_VEHICLES.map((v) =>
      sharp(join(OUT_DIR, `${fileStem(v)}--three-quarter.png`)).toBuffer()
    )
  );
  const rows = Math.ceil(DEMO_VEHICLES.length / COLS);
  await sharp({
    create: { width: CELL_W * COLS, height: CELL_H * rows, channels: 3, background: "#000" },
  })
    .composite(
      threeQuarter.map((input, i) => ({
        input,
        left: (i % COLS) * CELL_W,
        top: Math.floor(i / COLS) * CELL_H,
      }))
    )
    .png()
    .toFile(join(OUT_DIR, "ALL-three-quarter.png"));

  console.log(`Rendered ${DEMO_VEHICLES.length} vehicles into ${OUT_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
