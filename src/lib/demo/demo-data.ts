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
 *  3. Every description field that a visitor can compare against a photograph —
 *     brand, model, trim, year and exterior colour — describes the vehicle that
 *     was ACTUALLY photographed for that listing. Where the Commons donor
 *     differed from what this file used to claim, the record was corrected to
 *     the donor rather than the photograph being passed off as something else.
 *     See `docs/demo-image-sources.md` and `demo-image-credits.ts`.
 *
 * PHOTOGRAPHY
 *
 * The eight listings below carry real photographs from Wikimedia Commons, one
 * coherent donor vehicle per listing (so an interior frame is never from a
 * different car than the exterior frames beside it). Licences range from CC BY
 * 3.0 to CC BY-SA 4.0 and each is recorded, with its author and source page, in
 * `demo-image-credits.ts` — which is what the attribution lines on the cards,
 * the detail galleries and the hero are rendered from.
 *
 * A listing with no correctly-licensed photograph of the right model and
 * generation shows the honest "Photography pending" state. It never borrows
 * another vehicle's picture, and never falls back to an illustration.
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
 * Photography for a demonstration listing.
 *
 * `display_order` is the order the gallery presents, so index 0 is both the
 * gallery's first frame and the card's cover image. `id` is derived from the
 * path: the database seeder replaces it with a UUID when it writes the rows, so
 * the only requirement here is a stable, human-readable identifier.
 */
function demoImages(...paths: readonly string[]): PublicVehicle["images"] {
  return paths.map((storage_path, index) => ({
    id: `demo-image-${storage_path.replace(/^\/demo\/vehicles\//, "").replace(/\//g, "-")}`,
    storage_path,
    display_order: index,
    is_cover: index === 0,
  }));
}

export const DEMO_VEHICLES: PublicVehicle[] = [
  {
    id: DEMO_VEHICLE_IDS.mercedesGle,
    slug: "demo-mercedes-benz-gle-450-2019",
    brand: "Mercedes-Benz",
    model: "GLE 450",
    trim: "AMG Line Premium+ 4MATIC",
    year: 2019,
    exterior_color: "Blue",
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
    images: demoImages(
      "/demo/vehicles/mercedes-gle/mercedes-gle-exterior-front.jpg",
      "/demo/vehicles/mercedes-gle/mercedes-gle-exterior-rear.jpg"
    ),
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
    images: demoImages(
      "/demo/vehicles/bmw-x5/bmw-x5-exterior-01.jpg",
      "/demo/vehicles/bmw-x5/bmw-x5-exterior-02.jpg",
      "/demo/vehicles/bmw-x5/bmw-x5-exterior-03.jpg"
    ),
  },
  {
    id: DEMO_VEHICLE_IDS.lexusRx,
    slug: "demo-lexus-rx-350-2023",
    brand: "Lexus",
    model: "RX 350",
    trim: "Premium Plus AWD",
    year: 2023,
    exterior_color: "Matador Red Mica",
    interior_color: "Black Leather",
    mileage: 8900,
    features: [
      "Lexus Safety System+ 3.0",
      "Mark Levinson® 21-speaker PurePlay sound",
      "14-inch touchscreen multimedia display",
      "Panoramic glass moonroof",
      "Color head-up display",
      "Triple-beam ultra-compact LED headlamps",
    ],
    status: "available",
    customer_price_kobo: 60_000_000_00,
    public_arrival_note: null,
    images: demoImages(
      "/demo/vehicles/lexus-rx/lexus-rx-exterior-front.jpg",
      "/demo/vehicles/lexus-rx/lexus-rx-exterior-rear.jpg"
    ),
  },
  {
    id: DEMO_VEHICLE_IDS.rangeRoverSport,
    slug: "demo-range-rover-sport-dynamic-se-2023",
    brand: "Range Rover",
    model: "Sport",
    trim: "Dynamic SE P400",
    year: 2023,
    exterior_color: "Fuji White",
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
    images: demoImages(
      "/demo/vehicles/range-rover-sport/range-rover-sport-exterior-front.jpg",
      "/demo/vehicles/range-rover-sport/range-rover-sport-exterior-rear.jpg"
    ),
  },
  {
    id: DEMO_VEHICLE_IDS.landCruiser,
    slug: "demo-toyota-land-cruiser-zx-2021",
    brand: "Toyota",
    model: "Land Cruiser",
    trim: "LC300 ZX 3.4 Twin-Turbo V6",
    year: 2021,
    exterior_color: "Silver",
    interior_color: "Black Leather",
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
    images: demoImages(
      "/demo/vehicles/toyota-land-cruiser/toyota-land-cruiser-exterior-front.jpg",
      "/demo/vehicles/toyota-land-cruiser/toyota-land-cruiser-exterior-rear.jpg",
      "/demo/vehicles/toyota-land-cruiser/toyota-land-cruiser-interior.jpg"
    ),
  },
  {
    id: DEMO_VEHICLE_IDS.mercedesC300,
    slug: "demo-mercedes-benz-c300d-2022",
    brand: "Mercedes-Benz",
    model: "C 300 d",
    trim: "AMG Line",
    year: 2022,
    exterior_color: "White",
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
    images: demoImages(
      "/demo/vehicles/mercedes-c300/mercedes-c300-exterior-front.jpg",
      "/demo/vehicles/mercedes-c300/mercedes-c300-exterior-rear.jpg",
      "/demo/vehicles/mercedes-c300/mercedes-c300-exterior-rear-2.jpg"
    ),
  },
  {
    id: DEMO_VEHICLE_IDS.porscheCayenne,
    slug: "demo-porsche-cayenne-s-2018",
    brand: "Porsche",
    model: "Cayenne",
    trim: "S AWD",
    year: 2018,
    exterior_color: "Black",
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
    images: demoImages(
      "/demo/vehicles/porsche-cayenne/porsche-cayenne-exterior-front.jpg",
      "/demo/vehicles/porsche-cayenne/porsche-cayenne-exterior-rear.jpg",
      "/demo/vehicles/porsche-cayenne/porsche-cayenne-interior.jpg"
    ),
  },
  {
    id: DEMO_VEHICLE_IDS.bmw7Series,
    slug: "demo-bmw-740d-xdrive-2024",
    brand: "BMW",
    model: "7 Series",
    trim: "740d xDrive Excellence",
    year: 2024,
    exterior_color: "Black",
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
    images: demoImages(
      "/demo/vehicles/bmw-7-series/bmw-7-series-exterior-front.jpg",
      "/demo/vehicles/bmw-7-series/bmw-7-series-exterior-rear.jpg"
    ),
  },
];

export function getDemoVehicles(status?: PublicVehicle["status"]): PublicVehicle[] {
  if (!status) return DEMO_VEHICLES;
  return DEMO_VEHICLES.filter((v) => v.status === status);
}

export function getDemoVehicleBySlug(slug: string): PublicVehicle | undefined {
  return DEMO_VEHICLES.find((v) => v.slug === slug);
}
