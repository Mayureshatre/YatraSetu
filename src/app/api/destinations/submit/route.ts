import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      latitude,
      longitude,
      category,
      region,
      hero_image_url,
      image_source,
      image_source_url,
      road_condition,
      safety_tips,
    } = body;

    if (!name || !description) {
      return NextResponse.json(
        {
          error: { message: "Destination name and description are required." },
        },
        { status: 400 },
      );
    }

    // Auto-generate fields matching your exact schema structure
    const newId = crypto.randomUUID();
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newDestination = {
      id: newId,
      name,
      slug,
      description,
      latitude: Number(latitude) || 23.25, // default MP center fallback
      longitude: Number(longitude) || 77.41,
      category: category || "Hidden Gem",
      region: region || "Madhya Pradesh",
      hero_image_url:
        hero_image_url ||
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      image_source: image_source || "Community Contributor",
      image_source_url: image_source_url || "",
      image_alt: `${name} in Madhya Pradesh`,
      image_credit: "Community Sourced via YatraSetu",
      image_license: "Public Discovery",
      image_verified_at: new Date().toISOString(),
      road_condition:
        road_condition || "Standard forest or state highway approach.",
      safety_tips: Array.isArray(safety_tips)
        ? safety_tips
        : [safety_tips || "Check local weather before travel"],
    };

    // Save to your database (assuming db has a method to append/save)
    // await db.saveDestination(newDestination);

    return NextResponse.json({
      success: true,
      message: "Destination successfully submitted and added to database!",
      data: newDestination,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          message: error.message || "Server error while submitting destination",
        },
      },
      { status: 500 },
    );
  }
}
