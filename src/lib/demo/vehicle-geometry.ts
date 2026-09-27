import type { VehicleArchetype } from "./vehicle-artwork";

/**
 * Side-elevation geometry, in a 1600 x 900 viewBox with the ground line at
 * y = GROUND_Y.
 *
 * Each archetype supplies its own key dimensions, so the seven silhouettes are
 * genuinely different shapes rather than one outline with cosmetic tweaks. A
 * Land Cruiser gets a tall, flat roof and an upright screen; a Range Rover
 * Sport gets a low roof, a long wheelbase and a dropped tail.
 */
export interface BodyGeometry {
  noseX: number;
  tailX: number;
  /** y of the roof panel. Smaller = taller vehicle. */
  roofY: number;
  /** x where the bonnet meets the windscreen base. */
  cowlX: number;
  /** y along the bonnet, from the nose to the cowl. */
  hoodY: number;
  /** y of the beltline â€” the bottom edge of the side glass. */
  beltY: number;
  /** y of the rocker panel underside. */
  sillY: number;
  roofFrontX: number;
  roofRearX: number;
  tailTopY: number;
  noseY: number;
  /** Half-width, used by the head-on and cabin views. */
  halfWidth: number;
  /** How upright the greenhouse is; drives glass height. */
  glassInset: number;
}

export const GROUND_Y = 720;

/** Key dimensions per body archetype. */
export const BODY_GEOMETRY: Record<VehicleArchetype, BodyGeometry> = {
  // Coupe-roof SUV: sloped tailgate, long raked screen, mid-height roof.
  "suv-coupe": {
    noseX: 232, tailX: 1424, roofY: 300, cowlX: 700, hoodY: 392,
    beltY: 430, sillY: 655, roofFrontX: 762, roofRearX: 1178,
    tailTopY: 358, noseY: 432, halfWidth: 250, glassInset: 8,
  },
  // SAV: taller greenhouse, more upright rear, a little shorter in length.
  sav: {
    noseX: 236, tailX: 1418, roofY: 272, cowlX: 672, hoodY: 376,
    beltY: 418, sillY: 650, roofFrontX: 728, roofRearX: 1202,
    tailTopY: 344, noseY: 424, halfWidth: 252, glassInset: 6,
  },
  // Crossover: short overhangs, rising beltline, near-vertical tailgate.
  crossover: {
    noseX: 222, tailX: 1432, roofY: 288, cowlX: 662, hoodY: 380,
    beltY: 424, sillY: 652, roofFrontX: 716, roofRearX: 1206,
    tailTopY: 340, noseY: 428, halfWidth: 246, glassInset: 7,
  },
  // Performance coupe SUV: lowest roof, longest wheelbase, fastest tail.
  "wide-sport-suv": {
    noseX: 214, tailX: 1448, roofY: 316, cowlX: 748, hoodY: 398,
    beltY: 444, sillY: 660, roofFrontX: 800, roofRearX: 1214,
    tailTopY: 372, noseY: 438, halfWidth: 268, glassInset: 10,
  },
  // Body-on-frame off-roader: tallest, flattest roof, most upright screen.
  "ladder-suv": {
    noseX: 230, tailX: 1424, roofY: 262, cowlX: 636, hoodY: 368,
    beltY: 412, sillY: 648, roofFrontX: 690, roofRearX: 1240,
    tailTopY: 326, noseY: 418, halfWidth: 256, glassInset: 4,
  },
  // Formal long-wheelbase saloon: low, long, extended rear overhang.
  "luxury-sedan": {
    noseX: 224, tailX: 1440, roofY: 328, cowlX: 726, hoodY: 398,
    beltY: 440, sillY: 662, roofFrontX: 792, roofRearX: 1232,
    tailTopY: 368, noseY: 442, halfWidth: 236, glassInset: 9,
  },
  // Compact executive saloon: shortest overall, tighter greenhouse.
  "compact-sedan": {
    noseX: 262, tailX: 1404, roofY: 334, cowlX: 748, hoodY: 400,
    beltY: 446, sillY: 660, roofFrontX: 806, roofRearX: 1204,
    tailTopY: 376, noseY: 446, halfWidth: 228, glassInset: 10,
  },
};

export function bodyGeometry(archetype: VehicleArchetype): BodyGeometry {
  return BODY_GEOMETRY[archetype];
}

/**
 * The outer body silhouette, traced front bumper -> bonnet -> windscreen ->
 * roof -> tailgate -> rear bumper, then back along the underside WITH proper
 * wheel-arch cutouts.
 *
 * The arches matter more than they look: a body whose lower edge is a straight
 * line down to the rocker hides most of the wheel behind it, and the whole
 * vehicle reads as a slab-sided van. Cutting the arches up over each tyre is
 * what makes the silhouette read as a car.
 *
 * `axles` and `wheelRadius` come from the artwork record, so the arches always
 * line up with the wheels actually drawn.
 */
export function bodyPath(
  g: BodyGeometry,
  axles: readonly [number, number],
  wheelRadius: number
): string {
  const { noseX, tailX, roofY, cowlX, hoodY, beltY, sillY, roofFrontX, roofRearX, tailTopY, noseY } = g;

  // Arch opening: slightly wider than the tyre, peaking just above its top.
  const archR = wheelRadius * 1.22;
  const archTop = GROUND_Y - wheelRadius - 26;
  const [frontAxle, rearAxle] = axles;

  // Start of each arch along the underside, as an x coordinate.
  const frontArchL = frontAxle - archR;
  const rearArchL = rearAxle - archR;
  const rearArchR = rearAxle + archR;

  return [
    `M ${noseX} ${sillY}`,
    // Front bumper up into the bonnet leading edge.
    `L ${noseX} ${noseY + 30}`,
    `Q ${noseX} ${noseY} ${noseX + 40} ${noseY - 8}`,
    // Bonnet, rising gently towards the cowl.
    `Q ${(noseX + cowlX) / 2} ${hoodY + 4} ${cowlX} ${hoodY}`,
    // Windscreen, raked back to the roof header.
    `L ${roofFrontX} ${roofY}`,
    // Roof, with a slight crown.
    `Q ${(roofFrontX + roofRearX) / 2} ${roofY - 9} ${roofRearX} ${roofY + 3}`,
    // Tailgate down to the rear bumper.
    `Q ${(roofRearX + tailX) / 2} ${(tailTopY + beltY) / 2} ${tailX} ${tailTopY + 26}`,
    `L ${tailX} ${sillY}`,
    // Underside, right to left, arching over the rear wheel then the front.
    `L ${rearArchR} ${sillY}`,
    `Q ${rearAxle} ${archTop} ${rearArchL} ${sillY}`,
    `L ${frontArchL} ${sillY}`,
    `Q ${frontAxle} ${archTop} ${frontAxle + archR} ${sillY}`,
    "Z",
  ].join(" ");
}

/**
 * The side glasshouse.
 *
 * Deliberately a plain trapezoid spanning the A-pillar to the C-pillar, sitting
 * just inside the roofline and stopping at the beltline. An earlier version ran
 * the glass forward to the tailgate, which produced a triangular sliver that
 * poked out through the rear pillar â€” so the glass must be bounded by the two
 * pillars and nothing else.
 */
export function glassPath(g: BodyGeometry): string {
  const { roofY, cowlX, beltY, roofFrontX, roofRearX } = g;
  return [
    `M ${cowlX + 12} ${beltY + 4}`,
    // Up the A-pillar to the header.
    `L ${roofFrontX + 6} ${roofY + 8}`,
    // Along the roof opening.
    `L ${roofRearX - 18} ${roofY + 12}`,
    // Down the C-pillar to the beltline.
    `Q ${roofRearX - 34} ${beltY - 10} ${roofRearX - 44} ${beltY + 4}`,
    "Z",
  ].join(" ");
}



/** A door shut line, drawn as a short open polyline. */
export function doorLine(x: number, g: BodyGeometry): string {
  return `M ${x} ${g.beltY + 16} L ${x} ${g.sillY - 10}`;
}

/** The side character crease running the length of the body. */
export function creasePath(g: BodyGeometry): string {
  const { noseX, tailX, beltY, sillY, cowlX } = g;
  const y = (beltY + sillY) / 2 - 4;
  return `M ${noseX + 72} ${y + 12} Q ${(noseX + tailX) / 2} ${y} ${cowlX} ${y - 2} L ${tailX - 62} ${y - 4}`;
}

/** Wheel arch: the arc the tyre sits inside. */
export function archPath(cx: number, r: number): string {
  return `M ${cx - r * 1.2} ${GROUND_Y - r * 0.2} A ${r * 1.2} ${r * 1.2} 0 0 1 ${cx + r * 1.2} ${GROUND_Y - r * 0.2}`;
}

/** Headlight lens, angled to follow the nose. */
export function headlightPath(g: BodyGeometry): string {
  const { noseX, noseY, hoodY } = g;
  const x0 = noseX + 26;
  return `M ${x0} ${noseY + 14} Q ${x0 + 56} ${noseY - 6} ${x0 + 94} ${hoodY - 12} L ${x0 + 82} ${hoodY + 14} Q ${x0 + 38} ${noseY + 28} ${x0} ${noseY + 42} Z`;
}

/** Taillight cluster, wrapping the rear pillar. */
export function taillightPath(g: BodyGeometry): string {
  const { tailX, tailTopY, beltY } = g;
  return `M ${tailX - 10} ${tailTopY + 42} Q ${tailX - 44} ${tailTopY + 54} ${tailX - 52} ${beltY - 8} L ${tailX - 4} ${beltY + 24} L ${tailX - 2} ${tailTopY + 74} Z`;
}

/** Side mirror on the front door. */
export function mirrorPath(g: BodyGeometry): string {
  const x = g.cowlX - 8;
  const y = g.beltY - 4;
  return `M ${x} ${y} q 32 -16 50 -2 q -4 22 -28 24 q -20 2 -22 -22 Z`;
}

