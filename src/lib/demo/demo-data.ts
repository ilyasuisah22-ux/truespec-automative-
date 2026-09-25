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
 *  3. Images are original generated placeholders labelled "DEMONSTRATION IMAGE".
 *
 * Removal before production: `supabase/scripts/remove_demo_data.sql`
 * plus setting DEMO_DATA=false (see README "Removing demo data").
 */

export const DEMO_VEHICLE_IDS = {
  ml350: "d0000000-0000-4000-8000-000000000001",
  bmwX5: "d0000000-0000-4000-8000-000000000002",
  landCruiser: "d0000000-0000-4000-8000-000000000003",
  gClass: "d0000000-0000-4000-8000-000000000004",
} as const;

function images(prefix: string, vehicleId: string) {
  const variants: Array<{ v: string; cover: boolean }> = [
    { v: "exterior", cover: true },
    { v: "interior", cover: false },
    { v: "detail", cover: false },
  ];
  return variants.map((entry, i) => ({
    id: `${vehicleId}-img-${i + 1}`,
    storage_path: `/demo/${prefix}-${entry.v}.svg`,
    display_order: i,
    is_cover: entry.cover,
  }));
}

export const DEMO_VEHICLES: PublicVehicle[] = [
  {
    id: DEMO_VEHICLE_IDS.ml350,
    slug: "demo-mercedes-benz-ml-350-2015",
    brand: "Mercedes-Benz",
    model: "ML 350",
    trim: "4MATIC",
    year: 2015,
    exterior_color: "Obsidian Black",
    interior_color: "Black Leather",
    mileage: 118000,
    features: [
      "Panoramic sunroof",
      "Reverse camera",
      "Heated front seats",
      "Power tailgate",
      "19-inch alloy wheels",
    ],
    status: "available",
    customer_price_kobo: 2450000000, // ₦24,500,000 (demo figure)
    public_arrival_note:
      "Demonstration record. Cleared and ready for inspection in Lagos.",
    images: images("ml350", DEMO_VEHICLE_IDS.ml350),
  },
  {
    id: DEMO_VEHICLE_IDS.bmwX5,
    slug: "demo-bmw-x5-xdrive40i-2019",
    brand: "BMW",
    model: "X5",
    trim: "xDrive40i",
    year: 2019,
    exterior_color: "Mineral White",
    interior_color: "Cognac Leather",
    mileage: 64000,
    features: [
      "Harman Kardon audio",
      "Head-up display",
      "Surround-view camera",
      "M Sport package",
      "20-inch alloy wheels",
    ],
    status: "available",
    customer_price_kobo: 4800000000, // ₦48,000,000 (demo figure)
    public_arrival_note: null,
    images: images("bmw-x5", DEMO_VEHICLE_IDS.bmwX5),
  },
  {
    id: DEMO_VEHICLE_IDS.landCruiser,
    slug: "demo-toyota-land-cruiser-2021",
    brand: "Toyota",
    model: "Land Cruiser",
    trim: "VXR",
    year: 2021,
    exterior_color: "Pearl White",
    interior_color: "Beige Leather",
    mileage: 41000,
    features: [
      "Cool box",
      "Rear entertainment screens",
      "Multi-terrain select",
      "360-degree camera",
      "Roof rails",
    ],
    status: "on_order",
    customer_price_kobo: 9200000000, // ₦92,000,000 (demo figure)
    public_arrival_note:
      "Demonstration record. Currently in transit — estimated arrival window shown to customers.",
    images: images("land-cruiser", DEMO_VEHICLE_IDS.landCruiser),
  },
  {
    id: DEMO_VEHICLE_IDS.gClass,
    slug: "demo-mercedes-benz-g63-amg-2018",
    brand: "Mercedes-Benz",
    model: "G-Class",
    trim: "G63 AMG",
    year: 2018,
    exterior_color: "Designo Night Black",
    interior_color: "Red Pepper Nappa",
    mileage: 52000,
    features: [
      "AMG performance exhaust",
      "Carbon interior trim",
      "Burmester sound",
      "Adaptive damping",
      "22-inch AMG wheels",
    ],
    status: "landed",
    customer_price_kobo: 11500000000, // ₦115,000,000 (demo figure)
    public_arrival_note: "Demonstration record. Landed and cleared earlier this year.",
    images: images("g-class", DEMO_VEHICLE_IDS.gClass),
  },
];

export function getDemoVehicles(status?: PublicVehicle["status"]): PublicVehicle[] {
  if (!status) return DEMO_VEHICLES;
  return DEMO_VEHICLES.filter((v) => v.status === status);
}

export function getDemoVehicleBySlug(slug: string): PublicVehicle | undefined {
  return DEMO_VEHICLES.find((v) => v.slug === slug);
}
