import { NextRequest, NextResponse } from "next/server";
import { mapsAdapter } from "@/lib/maps/maps-adapter";
import { createErrorResponse } from "@/lib/utils";
import { z } from "zod";

const geocodeSchema = z.object({
  query: z.string().min(2).max(200),
});

interface GeocodeResult {
  latitude: number;
  longitude: number;
  formatted_address: string;
}

// Universal fallback geocoder for any Indian town/city
async function fallbackGeocode(
  cityName: string,
): Promise<GeocodeResult | null> {
  try {
    const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      cityName + ", India",
    )}&format=json&limit=1`;

    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent": "YatraSetuApp/1.0 (contact@yatrasetu.internal)",
        "Accept-Language": "en",
      },
      next: { revalidate: 86400 }, // Cache 24 hrs
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          return {
            latitude: lat,
            longitude: lng,
            formatted_address: item.display_name
              .split(",")
              .slice(0, 3)
              .join(","),
          };
        }
      }
    }
  } catch (err) {
    console.error("Universal geocode fallback failed:", err);
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || searchParams.get("query");

    const parseResult = geocodeSchema.safeParse({ query: q });
    if (!parseResult.success) {
      const { response, status } = createErrorResponse(
        "VALIDATION_ERROR",
        "A valid location name is required (at least 2 characters)",
        parseResult.error.flatten(),
        400,
      );
      return NextResponse.json(response, { status });
    }

    // Explicitly typed as nullable
    let result: GeocodeResult | null = await mapsAdapter.geocodeCity(
      parseResult.data.query,
    );

    // Universal fallback if mapsAdapter returns null
    if (!result) {
      result = await fallbackGeocode(parseResult.data.query);
    }

    if (!result) {
      const { response, status } = createErrorResponse(
        "LOCATION_NOT_FOUND",
        `Unable to resolve location "${parseResult.data.query}". Please check the spelling or enter a valid city/town name.`,
        undefined,
        404,
      );
      return NextResponse.json(response, { status });
    }

    return NextResponse.json({ data: result });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      "SERVER_ERROR",
      "Failed to geocode location",
      { details: error.message },
      500,
    );
    return NextResponse.json(response, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = geocodeSchema.safeParse(body);
    if (!parseResult.success) {
      const { response, status } = createErrorResponse(
        "VALIDATION_ERROR",
        "A valid location name is required (at least 2 characters)",
        parseResult.error.flatten(),
        400,
      );
      return NextResponse.json(response, { status });
    }

    // Explicitly typed as nullable
    let result: GeocodeResult | null = await mapsAdapter.geocodeCity(
      parseResult.data.query,
    );

    // Universal fallback if mapsAdapter returns null
    if (!result) {
      result = await fallbackGeocode(parseResult.data.query);
    }

    if (!result) {
      const { response, status } = createErrorResponse(
        "LOCATION_NOT_FOUND",
        `Unable to resolve location "${parseResult.data.query}". Please check the spelling or enter a valid city/town name.`,
        undefined,
        404,
      );
      return NextResponse.json(response, { status });
    }

    return NextResponse.json({ data: result });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      "SERVER_ERROR",
      "Failed to geocode location",
      { details: error.message },
      500,
    );
    return NextResponse.json(response, { status });
  }
}
