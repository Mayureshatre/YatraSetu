import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !googleApiKey) {
  console.error("❌ Missing environment variables. Check .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getGooglePlaceImage(name, lat, lng) {
  try {
    // 1. Search for the place near the exact coordinates
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(name)}&inputtype=textquery&fields=photos&locationbias=circle:2000@${lat},${lng}&key=${googleApiKey}`;

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (
      !searchData.candidates ||
      searchData.candidates.length === 0 ||
      !searchData.candidates[0].photos
    ) {
      return null; // No photos found
    }

    const photoRef = searchData.candidates[0].photos[0].photo_reference;

    // 2. Request the actual photo (Google will redirect this to the final image URL)
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photoRef}&key=${googleApiKey}`;

    // Fetch it just to capture the final redirected URL (keeps your API key off the frontend)
    const photoRes = await fetch(photoUrl);

    return photoRes.url; // Returns the clean lh3.googleusercontent.com link
  } catch (error) {
    console.error(`⚠️ Error fetching Google data for ${name}:`, error.message);
    return null;
  }
}

async function runSeeder() {
  console.log("🚀 Starting Google Places Image Seeder...");

  const { data: destinations, error } = await supabase
    .from("destinations")
    .select("id, name, latitude, longitude");

  if (error) return console.error("❌ DB Error:", error.message);

  let successCount = 0;
  let failCount = 0;

  for (const dest of destinations) {
    process.stdout.write(`Fetching Google Maps photo for "${dest.name}"... `);

    const imageUrl = await getGooglePlaceImage(
      dest.name,
      dest.latitude,
      dest.longitude,
    );

    if (imageUrl) {
      await supabase
        .from("destinations")
        .update({
          hero_image_url: imageUrl,
          image_source: "Google Maps",
          image_verified_at: new Date().toISOString(),
        })
        .eq("id", dest.id);

      console.log(`✅ Success`);
      successCount++;
    } else {
      console.log(`⚠️ No photos found on Google`);
      failCount++;
    }

    // Wait 300ms to avoid Google API rate limits
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log("\n🎉 Google Seeding Complete!");
  console.log(`✅ Updated: ${successCount} | ⚠️ Missing: ${failCount}`);
}

runSeeder();
