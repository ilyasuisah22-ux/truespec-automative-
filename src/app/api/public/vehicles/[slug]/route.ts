import { NextResponse, type NextRequest } from "next/server";
import { getPublicVehicleBySlug } from "@/lib/data/public";
import { assertNoPrivateFields } from "@/lib/serializers/public-vehicle";

/**
 * GET /api/public/vehicles/:slug
 *
 * Returns the sanitized public DTO for a single vehicle. The public URL is the
 * human-readable slug — internal UUIDs are not required to be exposed.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const vehicle = await getPublicVehicleBySlug(slug);
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });
    }

    assertNoPrivateFields(vehicle);

    return NextResponse.json({ data: vehicle }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error(
      "[api/public/vehicles/:slug] failed:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json({ error: "Unable to load this vehicle." }, { status: 500 });
  }
}
