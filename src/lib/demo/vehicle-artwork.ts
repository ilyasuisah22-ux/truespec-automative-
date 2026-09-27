import { DEMO_VEHICLE_IDS } from "@/lib/demo/demo-data";

/**
 * ============================================================================
 * DEMONSTRATION ARTWORK â€” ILLUSTRATIVE VECTOR RENDERS, NOT PHOTOGRAPHY
 * ============================================================================
 *
 * WHY THIS EXISTS
 *
 * The photographs previously shipped in `public/demo/vehicles/` did not depict
 * the vehicles they were named after (`lexus-rx-exterior.jpg` was a
 * Lamborghini, `mercedes-c300-exterior.jpg` a BMW M4, and so on â€” see the
 * comments in `demo-data.ts`). They were withdrawn rather than relabelled.
 *
 * A showroom still needs *something* to look at, and this file is that
 * something: original, hand-authored vector illustrations, drawn from scratch
 * as SVG path data. Nothing is scraped, no stock library is used, no competitor
 * asset is copied, and no image has been renamed to pretend to be another car.
 *
 * WHAT THESE ARE NOT
 *
 * They are NOT photographs of real cars, and they are NOT renders of the
 * specific vehicle a customer is buying. Every surface that displays one also
 * shows an `ILLUSTRATIVE` disclosure (see `vehicle-illustration.tsx`), and the
 * detail page states plainly that real photography has not been uploaded yet.
 *
 * HOW TO REPLACE THEM WITH REAL PHOTOGRAPHY
 *
 * Upload real photos per vehicle through `Admin -> Inventory -> [vehicle] ->
 * Images`. This registry is only consulted for a vehicle that has NO stored
 * images, so real photography always takes precedence automatically. A real
 * customer vehicle that is not in this registry simply shows "Photography
 * pending" â€” it is never given a stand-in illustration.
 *
 * WHY A PER-VEHICLE REGISTRY INSTEAD OF ONE GENERIC CAR
 *
 * Each record declares its own body archetype, so a Land Cruiser renders as an
 * upright, boxy off-roader while a Range Rover Sport renders as a low, wide
 * coupÃ© SUV. Reusing one silhouette for every listing would be a different
 * kind of dishonesty, and would make the demo useless for reviewing layout.
 */

/** Body archetypes, each a genuinely different silhouette. */
export type VehicleArchetype =
  /** CoupÃ©-roof SUV â€” sloped tailgate, fastback rear glass. */
  | "suv-coupe"
  /** BMW-style "Sport Activity Vehicle" â€” upright, tall greenhouse. */
  | "sav"
  /** Crossover with a rising beltline and short overhangs. */
  | "crossover"
  /** Very low, very wide performance SUV with a dropped roof. */
  | "wide-sport-suv"
  /** Body-on-frame off-roader â€” boxy, flat roof, upright screen. */
  | "ladder-suv"
  /** Long, low, formal luxury saloon with an extended rear door. */
  | "luxury-sedan"
  /** Short, tightly-wrapped executive saloon. */
  | "compact-sedan";

/** The four views every illustrated vehicle is drawn in. */
export type ArtworkView = "three-quarter" | "profile" | "front" | "cabin";

/** Named paint, taken verbatim from each record's `exterior_color`. */
export interface VehiclePaint {
  /** The record's `exterior_color` string, shown in the disclosure tooltip. */
  readonly name: string;
  /** Base metallic body colour. */
  readonly body: string;
  /** Upper highlight, for the metallic sheen gradient. */
  readonly highlight: string;
  /** Lower shade, for the body underside and arch shading. */
  readonly shade: string;
  /** Cabin glass tint. */
  readonly glass: string;
  /** Alloy wheel centre finish. */
  readonly wheel: string;
}

export interface VehicleArtwork {
  /** Wheel/tyre radius, in viewBox units. */
  readonly wheelRadius: number;
  /** Front and rear axle centres, in viewBox units. */
  readonly axles: readonly [front: number, rear: number];
  readonly archetype: VehicleArchetype;
  readonly paint: VehiclePaint;
  /** Whether the roofline carries a panoramic glass panel, from the record's
   *  own feature list rather than invented per render. */
  readonly panoramicRoof: boolean;
  /** Human label for each view, used in alt text and captions. */
  readonly viewLabels: Record<ArtworkView, string>;
}

/**
 * Short captions for the on-image badge. The long descriptive wording is still
 * used in the SVG <title> and alt text, where there is room for it.
 */
export const VIEW_CAPTIONS: Record<ArtworkView, string> = {
  "three-quarter": "Three-quarter",
  profile: "Side profile",
  front: "Front elevation",
  cabin: "Cabin",
};

const VIEW_LABELS: Record<ArtworkView, string> = {
  "three-quarter": "Front three-quarter illustration",
  profile: "Side profile illustration",
  front: "Front elevation illustration",
  cabin: "Cabin and dashboard illustration",
};

/**
 * Artwork for each demonstration vehicle.
 *
 * Paint values are literal renderings of the colour each record already
 * declares (e.g. "Santorini Black" -> #14171b), so the illustration and the
 * published specification agree with each other.
 */
const ARTWORK: Record<string, VehicleArtwork> = {
  [DEMO_VEHICLE_IDS.mercedesGle]: {
    wheelRadius: 88,
    axles: [470, 1230],
    archetype: "suv-coupe",
    paint: {
      name: "Obsidian Black Metallic",
      body: "#1b1e24",
      highlight: "#454b55",
      shade: "#0a0c0f",
      glass: "#1d2a36",
      wheel: "#8d939c",
    },
    panoramicRoof: true,
    viewLabels: VIEW_LABELS,
  },
  [DEMO_VEHICLE_IDS.bmwX5]: {
    wheelRadius: 94,
    axles: [462, 1238],
    archetype: "sav",
    paint: {
      name: "Mineral White Metallic",
      body: "#d5d9dd",
      highlight: "#f6f8fa",
      shade: "#9aa1a9",
      glass: "#26333f",
      wheel: "#aab0b8",
    },
    panoramicRoof: false,
    viewLabels: VIEW_LABELS,
  },
  [DEMO_VEHICLE_IDS.lexusRx]: {
    wheelRadius: 92,
    axles: [452, 1236],
    archetype: "crossover",
    paint: {
      name: "Sonic Titanium",
      body: "#6d7278",
      highlight: "#9ba1a7",
      shade: "#3f4448",
      glass: "#1f2a33",
      wheel: "#9aa0a6",
    },
    panoramicRoof: true,
    viewLabels: VIEW_LABELS,
  },
  [DEMO_VEHICLE_IDS.rangeRoverSport]: {
    wheelRadius: 98,
    axles: [448, 1242],
    archetype: "wide-sport-suv",
    paint: {
      name: "Santorini Black",
      body: "#14171b",
      highlight: "#3c424b",
      shade: "#07080a",
      glass: "#1b2630",
      wheel: "#7f858d",
    },
    panoramicRoof: true,
    viewLabels: VIEW_LABELS,
  },
  [DEMO_VEHICLE_IDS.landCruiser]: {
    wheelRadius: 100,
    axles: [455, 1240],
    archetype: "ladder-suv",
    paint: {
      name: "Precious White Pearl",
      body: "#e2e4e1",
      highlight: "#fbfcfa",
      shade: "#a4a8a4",
      glass: "#22303c",
      wheel: "#8b9199",
    },
    panoramicRoof: false,
    viewLabels: VIEW_LABELS,
  },
  [DEMO_VEHICLE_IDS.mercedesC300]: {
    wheelRadius: 84,
    axles: [470, 1218],
    archetype: "compact-sedan",
    paint: {
      name: "Mojave Silver Metallic",
      body: "#9ba1a7",
      highlight: "#ccd2d7",
      shade: "#666c72",
      glass: "#1d2833",
      wheel: "#a4aab1",
    },
    panoramicRoof: true,
    viewLabels: VIEW_LABELS,
  },
  [DEMO_VEHICLE_IDS.porscheCayenne]: {
    wheelRadius: 94,
    axles: [452, 1238],
    archetype: "suv-coupe",
    paint: {
      name: "Crayon / Chalk Grey",
      body: "#b2b0a8",
      highlight: "#dbd9d1",
      shade: "#7d7b74",
      glass: "#1f2a34",
      wheel: "#9ba1a8",
    },
    panoramicRoof: true,
    viewLabels: VIEW_LABELS,
  },
  [DEMO_VEHICLE_IDS.bmw7Series]: {
    wheelRadius: 86,
    axles: [468, 1226],
    archetype: "luxury-sedan",
    paint: {
      name: "Carbon Black Metallic",
      body: "#1a1d21",
      highlight: "#3f454d",
      shade: "#0a0b0d",
      glass: "#1c2732",
      wheel: "#8b9199",
    },
    panoramicRoof: true,
    viewLabels: VIEW_LABELS,
  },
};

/**
 * Returns the illustration for a vehicle, or `undefined` when the vehicle has
 * no registered artwork.
 *
 * Returning `undefined` for anything unknown is deliberate: a real customer
 * vehicle must fall through to "Photography pending" rather than being given
 * somebody else's stand-in.
 */
export function getVehicleArtwork(vehicleId: string): VehicleArtwork | undefined {
  return ARTWORK[vehicleId];
}

/** True when this vehicle has an illustrative render available. */
export function hasVehicleArtwork(vehicleId: string): boolean {
  return Object.prototype.hasOwnProperty.call(ARTWORK, vehicleId);
}

/** The order the views appear in the gallery. */
export const ARTWORK_VIEWS: readonly ArtworkView[] = [
  "three-quarter",
  "profile",
  "front",
  "cabin",
];

