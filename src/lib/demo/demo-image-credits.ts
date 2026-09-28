/**
 * ============================================================================
 * PHOTOGRAPHY PROVENANCE — DEMONSTRATION FLEET
 * ============================================================================
 *
 * Every photograph shipped in `public/demo/vehicles/` is a REAL photograph
 * published on Wikimedia Commons under a licence that permits reuse with
 * attribution. Nothing here is vector artwork, a render or a placeholder.
 *
 * This module is the single machine-readable record of where each frame came
 * from, and it is the source of the attribution lines rendered next to the
 * frames on the showroom (`vehicle-card.tsx`, `vehicle-gallery.tsx`) and in the
 * hero (`cinematic-hero.tsx`). The human-readable edition of the same data, with
 * the licence links and the verification notes, is `docs/demo-image-sources.md`.
 *
 * WHAT WAS VERIFIED, AND HOW
 *
 *  1. Licence and author were read from each file's own description page through
 *     the Commons API, not assumed. A file being hosted on Commons does NOT mean
 *     every file there carries the same licence.
 *  2. The photographed vehicle was checked against the listing it illustrates:
 *     make, model, generation, trim, colour and year come from the file title,
 *     its description, or a Commons colour category (`photographed` below).
 *  3. Each file was downloaded, re-encoded and stored locally, so every entry
 *     records the modification in `modified`.
 *  4. No frame is shared between two vehicles: the eight galleries use twenty
 *     distinct files, verified to have twenty distinct checksums.
 *
 * HONEST LIMITS
 *
 *  - Orientation is only stated where the source states it. Where it does not,
 *    `shows` says so and the UI never labels a view.
 *  - Paint names are quoted only when the source states them. Where the source
 *    states a colour family only, the listing uses that plain colour word rather
 *    than inventing a factory paint name.
 *  - These are real vehicles of the same model, generation and configuration as
 *    the listing — not photographs of a specific TrueSpec unit. The listings
 *    keep their "DEMO RECORD" wording for exactly that reason.
 */

export interface DemoImageCredit {
  /** Local public path — exactly the value in `vehicle_images.storage_path`. */
  path: string;
  /** Commons file title, so the source is findable from the filename alone. */
  title: string;
  /** The photographer, as credited on Commons. */
  author: string;
  /** Short licence name, as Commons states it. */
  licence: string;
  /** Canonical licence deed. */
  licenceUrl: string;
  /** Commons file description page — the authoritative licence record. */
  sourceUrl: string;
  /** Date the licence and metadata above were read. */
  accessed: string;
  /** What the source says about the photographed vehicle. */
  photographed: string;
  /** What the frame shows, limited to what the source supports. */
  shows: string;
  /** How the local copy differs from the Commons original. */
  modified: string;
}

/** Resizing/re-encoding applied to every local copy. */
const DERIVATIVE =
  "Resized to fit 1280px on the long edge and re-encoded as progressive JPEG. No crop of our own: only the two Lexus frames use a crop that the source file itself already is.";

const ACCESSED = "2026-09-28";

/**
 * Eight demonstration vehicles, one coherent donor shoot per gallery, so an
 * interior frame can never belong to a different car from the exterior frames
 * beside it. Vehicles whose only available Commons files were of a different
 * model or generation carry no photograph at all and render "Photography
 * pending" instead — no substitution.
 */
export const DEMO_IMAGE_CREDITS: readonly DemoImageCredit[] = [
  /* ------------------------------------------------- Mercedes-Benz GLE 450 */
  {
    path: "/demo/vehicles/mercedes-gle/mercedes-gle-exterior-front.jpg",
    title: "File:2019 Mercedes-Benz GLE 450 AMG Line Premium+ 4MATIC 3.0 Front.jpg",
    author: "Vauxford",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2019_Mercedes-Benz_GLE_450_AMG_Line_Premium%2B_4MATIC_3.0_Front.jpg",
    accessed: ACCESSED,
    photographed:
      "2019 Mercedes-Benz GLE 450 AMG Line Premium+ 4MATIC (W167), blue (Commons colour category: Blue Mercedes-Benz SUVs). Photographed in Weymouth, United Kingdom.",
    shows: "Front three-quarter exterior of the donor GLE 450.",
    modified: DERIVATIVE,
  },
  {
    path: "/demo/vehicles/mercedes-gle/mercedes-gle-exterior-rear.jpg",
    title: "File:2019 Mercedes-Benz GLE 450 AMG Line Premium+ 4MATIC 3.0 Rear.jpg",
    author: "Vauxford",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2019_Mercedes-Benz_GLE_450_AMG_Line_Premium%2B_4MATIC_3.0_Rear.jpg",
    accessed: ACCESSED,
    photographed:
      "Same donor vehicle and same shoot as the front frame above (Weymouth, United Kingdom).",
    shows: "Rear three-quarter exterior of the same donor GLE 450.",
    modified: DERIVATIVE,
  },
  /* ----------------------------------------------------------- BMW X5 G05 */
  {
    path: "/demo/vehicles/bmw-x5/bmw-x5-exterior-01.jpg",
    title: "File:BMW G05 X5 xDrive40i M Sport Mineral White Metallic (1).jpg",
    author: "Damian B Oh",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:BMW_G05_X5_xDrive40i_M_Sport_Mineral_White_Metallic_(1).jpg",
    accessed: ACCESSED,
    photographed:
      "BMW G05 X5 xDrive40i M Sport in Mineral White Metallic (Commons colour category: White BMW SUVs), photographed 25 May 2023 at the BMW Driving Center, Republic of Korea.",
    shows:
      "Exterior, first frame of a single walkaround sequence. The source does not state the camera angle, so no view is claimed here or in the UI.",
    modified: DERIVATIVE,
  },
  {
    path: "/demo/vehicles/bmw-x5/bmw-x5-exterior-02.jpg",
    title: "File:BMW G05 X5 xDrive40i M Sport Mineral White Metallic (4).jpg",
    author: "Damian B Oh",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:BMW_G05_X5_xDrive40i_M_Sport_Mineral_White_Metallic_(4).jpg",
    accessed: ACCESSED,
    photographed: "Same donor vehicle and walkaround as frame 01 (25 May 2023).",
    shows: "Exterior, later frame of the same walkaround; camera angle not stated by the source.",
    modified: DERIVATIVE,
  },
  {
    path: "/demo/vehicles/bmw-x5/bmw-x5-exterior-03.jpg",
    title: "File:BMW G05 X5 xDrive40i M Sport Mineral White Metallic (7).jpg",
    author: "Damian B Oh",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:BMW_G05_X5_xDrive40i_M_Sport_Mineral_White_Metallic_(7).jpg",
    accessed: ACCESSED,
    photographed: "Same donor vehicle and walkaround as frame 01 (25 May 2023).",
    shows: "Exterior, later frame of the same walkaround; camera angle not stated by the source.",
    modified: DERIVATIVE,
  },
  /* ------------------------------------------------------ Lexus RX 350 AL30 */
  {
    path: "/demo/vehicles/lexus-rx/lexus-rx-exterior-front.jpg",
    title: "File:2023 Lexus RX 350 Premium Plus in Matador Red Mica, front left (cropped).jpg",
    author: "Mr.choppers",
    licence: "CC BY-SA 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2023_Lexus_RX_350_Premium_Plus_in_Matador_Red_Mica%2C_front_left_(cropped).jpg",
    accessed: ACCESSED,
    photographed:
      "2023 Lexus RX 350 Premium Plus AWD (AL30 / TALA10) in Matador Red Mica with black leather interior — 2.4-litre turbocharged inline-four, 275hp, 8-speed automatic, per the source description.",
    shows: "Front-left three-quarter exterior.",
    modified: DERIVATIVE,
  },
  {
    path: "/demo/vehicles/lexus-rx/lexus-rx-exterior-rear.jpg",
    title: "File:2023 Lexus RX 350 Premium Plus in Matador Red Mica, rear left (cropped).jpg",
    author: "Mr.choppers",
    licence: "CC BY-SA 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2023_Lexus_RX_350_Premium_Plus_in_Matador_Red_Mica%2C_rear_left_(cropped).jpg",
    accessed: ACCESSED,
    photographed: "Same donor vehicle and same shoot as the front frame above.",
    shows: "Rear-left three-quarter exterior.",
    modified: DERIVATIVE,
  },
  /* ------------------------------------------- Range Rover Sport L461 P400 */
  {
    path: "/demo/vehicles/range-rover-sport/range-rover-sport-exterior-front.jpg",
    title: "File:2023 Range Rover Sport P400 Dynamic SE in Fuji White, front left.jpg",
    author: "Mr.choppers",
    licence: "CC BY-SA 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2023_Range_Rover_Sport_P400_Dynamic_SE_in_Fuji_White%2C_front_left.jpg",
    accessed: ACCESSED,
    photographed:
      "2023 Range Rover Sport P400 Dynamic SE (L461) in Fuji White — 3.0-litre AJ20P6 straight-six mild hybrid, all-wheel drive, 8-speed automatic, per the source description.",
    shows: "Front-left three-quarter exterior.",
    modified: DERIVATIVE,
  },
  {
    path: "/demo/vehicles/range-rover-sport/range-rover-sport-exterior-rear.jpg",
    title: "File:2023 Range Rover Sport P400 Dynamic SE in Fuji White, rear left.jpg",
    author: "Mr.choppers",
    licence: "CC BY-SA 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2023_Range_Rover_Sport_P400_Dynamic_SE_in_Fuji_White%2C_rear_left.jpg",
    accessed: ACCESSED,
    photographed: "Same donor vehicle and same shoot as the front frame above.",
    shows: "Rear-left three-quarter exterior.",
    modified: DERIVATIVE,
  },
  /* --------------------------------------------------- Toyota Land Cruiser */
  {
    path: "/demo/vehicles/toyota-land-cruiser/toyota-land-cruiser-exterior-front.jpg",
    title: "File:2021 Toyota Land Cruiser 300 3.4 ZX (Colombia) front view 01.png",
    author: "Autosdeprimera",
    licence: "CC BY 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by/3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2021_Toyota_Land_Cruiser_300_3.4_ZX_(Colombia)_front_view_01.png",
    accessed: ACCESSED,
    photographed:
      "2021 Toyota Land Cruiser 300 3.4 ZX (J300), silver (Commons colour category: Silver Toyota SUVs), V35A-FTS twin-turbo V6, photographed in Colombia on 15 September 2021.",
    shows: "Front three-quarter exterior, labelled 'front view' by the source.",
    modified: DERIVATIVE,
  },
  {
    path: "/demo/vehicles/toyota-land-cruiser/toyota-land-cruiser-exterior-rear.jpg",
    title: "File:2021 Toyota Land Cruiser 300 3.4 ZX (Colombia) rear view 01.png",
    author: "Autosdeprimera",
    licence: "CC BY 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by/3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2021_Toyota_Land_Cruiser_300_3.4_ZX_(Colombia)_rear_view_01.png",
    accessed: ACCESSED,
    photographed: "Same donor vehicle and same shoot as the front frame above.",
    shows: "Rear three-quarter exterior, labelled 'rear view' by the source.",
    modified: DERIVATIVE,
  },
  {
    path: "/demo/vehicles/toyota-land-cruiser/toyota-land-cruiser-interior.jpg",
    title: "File:2021 Toyota Land Cruiser 300 (Colombia) interior.png",
    author: "Autosdeprimera",
    licence: "CC BY 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by/3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2021_Toyota_Land_Cruiser_300_(Colombia)_interior.png",
    accessed: ACCESSED,
    photographed:
      "Interior of a 2021 Land Cruiser 300 photographed in Colombia (7 August 2021) by the same photographer as the exterior frames above; the source does not state a trim or colour name.",
    shows:
      "Cabin and dashboard. Sample analysis of the frame shows a predominantly dark, low-chroma cabin, which is why the listing's interior colour is stated as black rather than beige.",
    modified: DERIVATIVE,
  },
  /* -------------------------------------------- Mercedes-Benz C 300 d W206 */
  {
    path: "/demo/vehicles/mercedes-c300/mercedes-c300-exterior-front.jpg",
    title: "File:Mercedes-Benz C 300 d AMG Line (W 206) – f 10032024.jpg",
    author: "M 93",
    licence: "CC BY-SA 3.0 DE",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0/de/",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_C_300_d_AMG_Line_(W_206)_%E2%80%93_f_10032024.jpg",
    accessed: ACCESSED,
    photographed:
      "Mercedes-Benz C 300 d AMG Line (W 206), white (Commons colour category: White Mercedes-Benz sedans), photographed 10 March 2024. Commons rates the file a Quality Image.",
    shows: "Front three-quarter exterior ('f' = Front in the source's naming).",
    modified: DERIVATIVE,
  },
  {
    path: "/demo/vehicles/mercedes-c300/mercedes-c300-exterior-rear.jpg",
    title: "File:Mercedes-Benz C 300 d AMG Line (W 206) – h 10032024.jpg",
    author: "M 93",
    licence: "CC BY-SA 3.0 DE",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0/de/",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_C_300_d_AMG_Line_(W_206)_%E2%80%93_h_10032024.jpg",
    accessed: ACCESSED,
    photographed: "Same donor vehicle and same shoot as the front frame above.",
    shows: "Rear three-quarter exterior ('h' = Heck, i.e. rear, in the source's naming).",
    modified: DERIVATIVE,
  },
  {
    path: "/demo/vehicles/mercedes-c300/mercedes-c300-exterior-rear-2.jpg",
    title: "File:Mercedes-Benz C 300 d AMG Line (W 206) – h2 10032024.jpg",
    author: "M 93",
    licence: "CC BY-SA 3.0 DE",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0/de/",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_C_300_d_AMG_Line_(W_206)_%E2%80%93_h2_10032024.jpg",
    accessed: ACCESSED,
    photographed: "Same donor vehicle and same shoot as the front frame above.",
    shows: "Second rear angle of the same donor vehicle.",
    modified: DERIVATIVE,
  },
  /* ------------------------------------------------ BMW 7 Series G70 740d */
  {
    path: "/demo/vehicles/bmw-7-series/bmw-7-series-exterior-front.jpg",
    title: "File:BMW 740d xDrive Excellence (G70) front.jpg",
    author: "Tokumeigakarinoaoshima",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:BMW_740d_xDrive_Excellence_(G70)_front.jpg",
    accessed: ACCESSED,
    photographed:
      "BMW 740d xDrive Excellence (G70), black (Commons colour category: Black BMW sedans), photographed in Osaka on 31 January 2024. The source description states the trim in Japanese: 'フロントから撮影' (photographed from the front).",
    shows: "Front three-quarter exterior, labelled as the front by the source.",
    modified: DERIVATIVE,
  },
  {
    path: "/demo/vehicles/bmw-7-series/bmw-7-series-exterior-rear.jpg",
    title: "File:BMW 740d xDrive Excellence (G70) rear.jpg",
    author: "Tokumeigakarinoaoshima",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:BMW_740d_xDrive_Excellence_(G70)_rear.jpg",
    accessed: ACCESSED,
    photographed:
      "Same donor vehicle, same shoot and same timestamp as the front frame above (31 January 2024, Osaka).",
    shows: "Rear three-quarter exterior, labelled as the rear by the source ('リア').",
    modified: DERIVATIVE,
  },
  /* ------------------------------------------------- Porsche Cayenne 9YA */
  {
    path: "/demo/vehicles/porsche-cayenne/porsche-cayenne-exterior-front.jpg",
    title: "File:2018 Porsche Cayenne S Front.jpg",
    author: "Vauxford",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2018_Porsche_Cayenne_S_Front.jpg",
    accessed: ACCESSED,
    photographed:
      "2018 Porsche Cayenne S (9YA, third generation), photographed in Solihull, United Kingdom. The source states no paint name; every body panel sampled in the frame is dark and low-chroma, which is why the listing's colour is stated as black rather than the light grey it used to claim.",
    shows: "Front three-quarter exterior.",
    modified: DERIVATIVE,
  },
  {
    path: "/demo/vehicles/porsche-cayenne/porsche-cayenne-exterior-rear.jpg",
    title: "File:2018 Porsche Cayenne S Rear.jpg",
    author: "Vauxford",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2018_Porsche_Cayenne_S_Rear.jpg",
    accessed: ACCESSED,
    photographed: "Same donor vehicle and same shoot as the front frame above.",
    shows: "Rear three-quarter exterior.",
    modified: DERIVATIVE,
  },
  {
    path: "/demo/vehicles/porsche-cayenne/porsche-cayenne-interior.jpg",
    title: "File:2018 Porsche Cayenne S Interior.jpg",
    author: "Vauxford",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2018_Porsche_Cayenne_S_Interior.jpg",
    accessed: ACCESSED,
    photographed:
      "Interior of the same donor Cayenne S (same photographer, same shoot). Commons files it under 'Porsche automobile cockpits'.",
    shows:
      "Cabin and dashboard. The frame is predominantly dark with a strong red component, which is consistent with the listing's black-and-red two-tone interior and is why that specification was kept.",
    modified: DERIVATIVE,
  },
];

/** Lookup by local path — the same key the database stores. */
export function demoImageCredit(path: string): DemoImageCredit | undefined {
  return DEMO_IMAGE_CREDITS.find((credit) => credit.path === path);
}

/**
 * One-line attribution for display beside a frame, e.g.
 * "Photograph: Vauxford · CC BY-SA 4.0 · Wikimedia Commons".
 *
 * Returns null for a path we did not source — for example a photograph the
 * owner uploaded through the admin flow. The caller then renders no credit
 * rather than a credit belonging to somebody else's picture.
 */
export function demoImageAttribution(path: string): string | null {
  const credit = demoImageCredit(path);
  if (!credit) return null;
  return `Photograph: ${credit.author} · ${credit.licence} · Wikimedia Commons`;
}

/**
 * True when every credit path has a matching file in `public/demo/vehicles/`.
 *
 * Used by `scripts/verify-demo-photography.ts`, which fails the check rather
 * than letting a listing render a broken image. Kept here (rather than in the
 * script) so the list of expectations lives beside the credits themselves.
 */
export function demoCreditPaths(): readonly string[] {
  return DEMO_IMAGE_CREDITS.map((credit) => credit.path);
}

