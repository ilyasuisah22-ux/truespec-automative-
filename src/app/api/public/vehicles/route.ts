import { NextResponse, type NextRequest } from "next/server";
import { getPublicVehicles } from "@/lib/data/public";
import { assertNoPrivateFields } from "@/lib/serializers/public-vehicle";
import { isVehicleStatus } from "@/lib/inventory";

/**
 * GET /api/public/vehicles
 *
 * Public JSON endpoint used by the marketing site and by the security tests.
 *
 * Security properties:
 *  - Responds with the explicit allow-list DTO produced by
 *    `toPublicVehicle` (never a raw database row).
 *  - `status` is validated against the known enum; any other value is ignored
 *    rather than passed through to the query layer.
 *  - Unknown query parameters (?fields=purchase_price_kobo, ?select=*, ?admin=1,
 *    ...) are ignored. There is no way to widen the response shape from the
 *    client.
 *  - Before responding we defensively assert that no forbidden field is present.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const status = isVehicleStatus(statusParam) ? statusParam : undefined;

  try {
    const vehicles = await getPublicVehicles(status);

    // Defence in depth: if a future change ever leaked a private key into the
    // DTO, this throws and we return a generic 500 instead of the payload.
    assertNoPrivateFields(vehicles);

    return NextResponse.json(
      { data: vehicles, count: vehicles.length, demo: process.env.DEMO_DATA === "true" },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    // Never leak internal error details or stack traces to anonymous callers.
    console.error("[api/public/vehicles] failed:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Unable to load inventory." },
      { status: 500 }
    );
  }
}
