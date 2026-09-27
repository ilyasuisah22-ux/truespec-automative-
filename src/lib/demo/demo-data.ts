import type { PublicVehicle } from "@/lib/inventory";

/**
 * ============================================================================
 * DEMONSTRATION DATA — NOT REAL TRUESPEC AUTOMOTIVE INVENTORY
 * ============================================================================
 *
 * Used ONLY as a local development fallback when Supabase is not yet
 * configured (or when DEMO_DATA=true), so the public showroom is fully
 * demonstrable before client credentials exist.
 *
 * Guarantees:
 *  1. This file contains ONLY the explicit public vehicle shape. It is
 *     structurally incapable of leaking financial data because no financial
 *     field exists here.
 *  2. Every price, mileage and status below is invented for demonstration.
 *  3. These records deliberately carry NO imagery. The photographs that used to
 *     sit in /public/demo/vehicles/ did not depict these vehicles and were
 *     withdrawn — see `NO_IMAGERY` below.
 *
 * Removal before production: `supabase/scripts/remove_demo_data.sql`
 * plus setting DEMO_DATA=false (see README "Removing demo data").
 */

export const DEMO_VEHICLE_IDS = {
  mercedesGle: "d0000000-0000-4000-8000-000000000001",
  bmwX5: "d0000000-0000-4000-8000-000000000002",
  lexusRx: "d0000000-0000-4000-8000-000000000003",
  rangeRoverSport: "d0000000-0000-4000-8000-000000000004",
  landCruiser: "d0000000-0000-4000-8000-000000000005",
  mercedesC300: "d0000000-0000-4000-8000-000000000006",
  porscheCayenne: "d0000000-0000-4000-8000-000000000007",
  bmw7Series: "d0000000-0000-4000-8000-000000000008",
} as const;

/**
 * Demo vehicles deliberately carry NO imagery.
 *
 * The JPEGs that used to live in `public/demo/vehicles/` were named after this
 * fleet but did not depict it. Opening every file showed they were generic
 * stock photographs of other vehicles — `lexus-rx-exterior.jpg` was a
 * Lamborghini, `mercedes-c300-exterior.jpg` a BMW M4, `range-rover-sport-
 * exterior.jpg` an Audi A3, `land-cruiser-exterior.jpg` a Ford — and every
 * "-interior.jpg" was an exterior shot, with six of the eight shared across
 * vehicles (identical checksums).
 *
 * Shipping a Lamborghini on a "Lexus RX 350" listing is a misrepresentation of
 * the goods, so the imagery was withdrawn from the database and from `public/`
 * rather than reordered. Returning an empty list here keeps the prototype
 * fallback and `npm run db:seed-demo` consistent with that, so neither path can
 * reintroduce a mismatched photograph.
 *
 * Photography is attached per vehicle through the existing admin upload flow
 * (Admin -> Inventory -> [vehicle] -> Images), which stores the row against
 * that vehicle id. Vehicles without photographs render an honest
 * "photography pending" state instead of a substitute image.
 */
const NO_IMAGERY: PublicVehicle["images"] = [];

export const DEMO_VEHICLES: PublicVehicle[] = [
  {
    id: DEMO_VEHICLE_IDS.mercedesGle,
    slug: "demo-mercedes-benz-gle-450-2024",
    brand: "Mercedes-Benz",
    model: "GLE 450",
    trim: "4MATIC AMG Line",
    year: 2024,
    exterior_color: "Obsidian Black Metallic",
    interior_color: "Macchiato Beige / Black Nappa",
    mileage: 6200,
    features: [
      "Panoramic sliding sunroof",
      "Burmester® Surround Sound system",
      "Airmatic air suspension with adaptive damping",
      "Active Distance Assist DISTRONIC",
      "Multibeam LED intelligent lighting",
      "21-inch AMG multi-spoke alloy wheels",
    ],
    status: "available",
    customer_price_kobo: 71_000_000_00,
    public_arrival_note:
      "DEMO RECORD · Representative inventory. Cleared and ready for inspection at Victoria Island showroom.",
    images: NO_IMAGERY,
  },
  {
    id: DEMO_VEHICLE_IDS.bmwX5,
    slug: "demo-bmw-x5-xdrive40i-2023",
    brand: "BMW",
    model: "X5",
    trim: "xDrive40i M Sport",
    year: 2023,
    exterior_color: "Mineral White Metallic",
    interior_color: "Tartufo Extended Merino Leather",
    mileage: 18500,
    features: [
      "M Sport aerodynamic package",
      "Sky Lounge panoramic glass roof",
      "Harman Kardon premium sound",
      "Live Cockpit Professional with curved display",
      "BMW Laserlight system",
      "22-inch M double-spoke bi-color wheels",
    ],
    status: "available",
    customer_price_kobo: 54_000_000_00,
    public_arrival_note:
      "DEMO RECORD · Representative inventory. Inspected before shipment; Lagos customs documentation verified.",
    images: NO_IMAGERY,
  },
  {
    id: DEMO_VEHICLE_IDS.lexusRx,
    slug: "demo-lexus-rx-350-2024",
    brand: "Lexus",
    model: "RX 350",
    trim: "F SPORT Handling AWD",
    year: 2024,
    exterior_color: "Sonic Titanium",
    interior_color: "Circuit Red NuLuxe",
    mileage: 8900,
    features: [
      "Lexus Safety System+ 3.0",
      "Mark Levinson® 21-speaker PurePlay sound",
      "14-inch touchscreen multimedia display",
      "Adaptive Variable Suspension (AVS)",
      "Color head-up display",
      "Triple-beam ultra-compact LED headlamps",
    ],
    status: "available",
    customer_price_kobo: 60_000_000_00,
    public_arrival_note: null,
    images: NO_IMAGERY,
  },
  {
    id: DEMO_VEHICLE_IDS.rangeRoverSport,
    slug: "demo-range-rover-sport-dynamic-se-2023",
    brand: "Range Rover",
    model: "Sport",
    trim: "Dynamic SE P400",
    year: 2023,
    exterior_color: "Santorini Black",
    interior_color: "Ebony / Light Cloud Semi-Aniline",
    mileage: 14200,
    features: [
      "Dynamic Air Suspension with switchable volume",
      "Meridian™ 3D surround sound system",
      "Pixel LED headlights with signature DRL",
      "ClearSight interior rear view mirror",
      "Deployable side access steps",
      "23-inch Style 5135 gloss black wheels",
    ],
    status: "available",
    customer_price_kobo: 104_000_000_00,
    public_arrival_note:
      "DEMO RECORD · Representative inventory. Direct UK spec, fully duty-paid with transparent doorstep pricing.",
    images: NO_IMAGERY,
  },
  {
    id: DEMO_VEHICLE_IDS.landCruiser,
    slug: "demo-toyota-land-cruiser-vxr-2024",
    brand: "Toyota",
    model: "Land Cruiser",
    trim: "LC300 VXR Twin-Turbo V6",
    year: 2024,
    exterior_color: "Precious White Pearl",
    interior_color: "Neutral Beige Semi-Aniline Leather",
    mileage: 4300,
    features: [
      "Electronic Kinetic Dynamic Suspension (E-KDSS)",
      "JBL® 14-speaker premium reference audio",
      "Rear dual 11.6-inch entertainment displays",
      "Multi-terrain monitor with 3D under-floor view",
      "Integrated center console cool box",
      "Adaptive high-beam system",
    ],
    status: "on_order",
    customer_price_kobo: 145_000_000_00,
    public_arrival_note:
      "DEMO RECORD · Representative inventory. Currently in transit; tracking updates provided through vessel arrival.",
    images: NO_IMAGERY,
  },
  {
    id: DEMO_VEHICLE_IDS.mercedesC300,
    slug: "demo-mercedes-benz-c300-2022",
    brand: "Mercedes-Benz",
    model: "C300",
    trim: "AMG Line Premium Plus",
    year: 2022,
    exterior_color: "Mojave Silver Metallic",
    interior_color: "Sienna Brown Leather",
    mileage: 28400,
    features: [
      "AMG Line body styling and sport brakes",
      "Panoramic tilting/sliding sunroof",
      "Burmester® 3D sound system",
      "11.9-inch central portrait multimedia touchscreen",
      "64-color ambient lighting system",
      "19-inch AMG multi-spoke bi-color alloys",
    ],
    status: "on_order",
    customer_price_kobo: 36_500_000_00,
    public_arrival_note:
      "DEMO RECORD · Representative inventory. Allocated and currently undergoing ocean transit to Lagos.",
    images: NO_IMAGERY,
  },
  {
    id: DEMO_VEHICLE_IDS.porscheCayenne,
    slug: "demo-porsche-cayenne-2023",
    brand: "Porsche",
    model: "Cayenne",
    trim: "Base AWD Sport Chrono",
    year: 2023,
    exterior_color: "Crayon / Chalk Grey",
    interior_color: "Black / Bordeaux Red Two-Tone",
    mileage: 16100,
    features: [
      "Sport Chrono Package with mode switch",
      "Adaptive air suspension with PASM",
      "Panoramic roof system",
      "BOSE® Surround Sound system",
      "LED-Matrix Design headlights with PDLS+",
      "21-inch RS Spyder Design wheels",
    ],
    status: "landed",
    customer_price_kobo: 91_000_000_00,
    public_arrival_note:
      "DEMO RECORD · Representative inventory. Cleared and delivered to client specification earlier this quarter.",
    images: NO_IMAGERY,
  },
  {
    id: DEMO_VEHICLE_IDS.bmw7Series,
    slug: "demo-bmw-740i-2024",
    brand: "BMW",
    model: "7 Series",
    trim: "740i M Sport",
    year: 2024,
    exterior_color: "Carbon Black Metallic",
    interior_color: "Smoke White BMW Individual Merino",
    mileage: 5100,
    features: [
      "31.3-inch BMW Theatre Screen in rear cabin",
      "Bowers & Wilkins Diamond surround sound",
      "Sky Lounge panoramic glass roof with LED patterns",
      "Automatic doors with soft-close function",
      "BMW Interaction Bar with ambient backlighting",
      "Executive lounge seating with massage function",
    ],
    status: "landed",
    customer_price_kobo: 122_000_000_00,
    public_arrival_note:
      "DEMO RECORD · Representative inventory. Sourced, imported, inspected and delivered through our flagship white-glove service.",
    images: NO_IMAGERY,
  },
];

export function getDemoVehicles(status?: PublicVehicle["status"]): PublicVehicle[] {
  if (!status) return DEMO_VEHICLES;
  return DEMO_VEHICLES.filter((v) => v.status === status);
}

export function getDemoVehicleBySlug(slug: string): PublicVehicle | undefined {
  return DEMO_VEHICLES.find((v) => v.slug === slug);
}
