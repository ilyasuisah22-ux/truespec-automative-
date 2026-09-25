/**
 * Generates original SVG placeholder artwork for the DEMO inventory.
 *
 * We deliberately do NOT download or scrape third-party vehicle photography:
 * those images are copyrighted and using them would misrepresent them as
 * TrueSpec Automotive stock. These generated placeholders are clearly marked
 * as demo imagery and can be replaced by the client's real photographs via
 * the admin upload flow.
 *
 * Run: node scripts/generate-demo-images.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "demo");
mkdirSync(outDir, { recursive: true });

/** Angular SUV-ish silhouette so the placeholder reads as a vehicle, not a box. */
function silhouette(fill) {
  return `
  <g transform="translate(0,40)" fill="${fill}">
    <path d="M120 300 C120 268 138 252 168 246 L214 190 C226 172 246 162 268 162 L392 162 C414 162 434 172 446 190 L492 246 C522 252 540 268 540 300 L540 314 C540 322 534 328 526 328 L510 328 C506 348 488 362 466 362 C444 362 426 348 422 328 L238 328 C234 348 216 362 194 362 C172 362 154 348 150 328 L134 328 C126 328 120 322 120 314 Z" />
    <rect x="226" y="182" width="76" height="46" rx="6" fill="rgba(255,255,255,0.18)" />
    <rect x="314" y="182" width="76" height="46" rx="6" fill="rgba(255,255,255,0.18)" />
  </g>
  <circle cx="194" cy="330" r="34" fill="#0b0d0f" />
  <circle cx="466" cy="330" r="34" fill="#0b0d0f" />
  <circle cx="194" cy="330" r="16" fill="#4a5361" />
  <circle cx="466" cy="330" r="16" fill="#4a5361" />`;
}

function svg({ label, variant, seed }) {
  const accents = ["#d9a94a", "#6b93c9", "#3fa96b", "#e3c06d"];
  const accent = accents[seed % accents.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 440" width="660" height="440" role="img" aria-label="Demonstration vehicle photograph placeholder for ${label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#171b21" />
      <stop offset="55%" stop-color="#12151a" />
      <stop offset="100%" stop-color="#0b0d0f" />
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#242a33" />
      <stop offset="100%" stop-color="#0b0d0f" />
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.35" r="0.7">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.16" />
      <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="660" height="440" fill="url(#bg)" />
  <rect width="660" height="440" fill="url(#glow)" />
  <rect y="352" width="660" height="88" fill="url(#floor)" />
  <g opacity="0.9">${silhouette(accent)}</g>
  <g font-family="Oswald, Arial Narrow, sans-serif" fill="#f7f8f9">
    <text x="36" y="70" font-size="30" letter-spacing="2">TRUESPEC</text>
    <text x="36" y="102" font-size="15" letter-spacing="6" fill="${accent}">AUTOMOTIVE</text>
    <text x="36" y="150" font-size="17" fill="#b3bac4">${label}</text>
  </g>
  <g font-family="Inter, Arial, sans-serif">
    <rect x="36" y="386" width="196" height="30" rx="4" fill="#d9a94a" opacity="0.14" stroke="#d9a94a" stroke-opacity="0.5" />
    <text x="50" y="406" font-size="13" letter-spacing="1.5" fill="#e3c06d">DEMONSTRATION IMAGE</text>
    <text x="624" y="406" font-size="12" text-anchor="end" fill="#6b7480">${variant}</text>
  </g>
</svg>`;
}

const subjects = [
  { slug: "ml350", label: "Mercedes-Benz ML 350" },
  { slug: "bmw-x5", label: "BMW X5 xDrive40i" },
  { slug: "land-cruiser", label: "Toyota Land Cruiser" },
  { slug: "g-class", label: "Mercedes-Benz G-Class G63" },
];

const variants = ["exterior", "interior", "detail"];

let count = 0;
for (const [i, subject] of subjects.entries()) {
  for (const [j, variant] of variants.entries()) {
    const file = join(outDir, `${subject.slug}-${variant}.svg`);
    writeFileSync(file, svg({ label: subject.label, variant, seed: i + j }), "utf8");
    count += 1;
  }
}

console.log(`Generated ${count} demo placeholder images in public/demo`);
