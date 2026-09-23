import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: {
      fuel_stations: { count: 0, places: [] },
      mechanics: { count: 0, places: [] },
      hospitals: { count: 0, places: [] },
    },
  });
}
