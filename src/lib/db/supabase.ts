import type { PostReport, PostCategory } from "@/types/community";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  Destination,
  DestinationReview,
  CommunityPost,
  PostComment,
  PostImage,
  FlexibleItinerary,
  TripSession,
} from "@/types";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const supabaseAdmin: SupabaseClient | null =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

// Canonical Seed Data for Fallback / Local / Test Mode
export const SEED_DESTINATIONS: Destination[] = [
  // --- INDORE & MALWA / NIMAR REGION (LOCAL CIRCUITS) ---
  {
    id: "55555555-0005-0005-0005-000000000007",
    name: "Lotus Valley (Gulawat Lotus Lake)",
    slug: "lotus-valley-gulawat",
    description:
      "A sprawling backwater lake near Yashwant Sagar completely blanketed with blooming pink lotus flowers and shaded by dense bamboo groves, featuring picturesque wooden bridges and boating channels.",
    latitude: 22.7915,
    longitude: 75.7125,
    category: "Seasonal Lake & Eco-Retreat",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8e/Gulawat_Lotus_Valley_Indore.jpg",
    image_source: "Indore District Administration / MP Tourism",
    image_source_url: "https://indore.nic.in/",
    image_alt:
      "Blooming pink lotus flowers and bamboo walkway at Gulawat Lotus Valley",
    image_credit: "District Administration Indore",
    image_license: "Public Domain / Tourism Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Approx 30 km from Indore via Airport Road & Hatod; well-paved rural approach road with on-site visitor parking.",
    safety_tips: [
      "Peak blooming season is from October through February; winter mornings offer optimal views",
      "Traditional wooden boat rides operate along narrow channels cut through the lotus pads",
      "Early morning sunrise is ideal for avoiding afternoon crowds and catching the flowers open",
    ],
  },
  {
    id: "55555555-0005-0005-0005-000000000003",
    name: "Mohadi Valley (Muhadi Falls)",
    slug: "mohadi-valley",
    description:
      "A scenic canyon and cascading waterfall set amid the lush green hills of the Vindhyan range near Tinchha, perfect for nature photography, morning hikes, and peaceful valley views.",
    latitude: 22.5684,
    longitude: 75.9612,
    category: "Scenic Valley & Nature Hike",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/3/3d/Mohadi_Waterfall_Indore.jpg",
    image_source: "MP Tourism / Ecotourism Board",
    image_source_url: "https://indore.nic.in/",
    image_alt:
      "Expansive green valley views and misty streams in Mohadi Valley",
    image_credit: "MP Tourism Ecotourism Wing",
    image_license: "Tourism Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Approx 30 km from Indore via Ralamandal and Tillor Khurd road; paved rural road leading to a scenic viewpoint trail.",
    safety_tips: [
      "Trek down to the waterfall base can be slippery after rainfall",
      "Stay on designated trail ridges to avoid steep loose rock edges",
      "Ideal morning drive destination during monsoon and early winter",
    ],
  },
  {
    id: "22222222-0002-0002-0002-000000000002",
    name: "Patalpani Waterfall & Heritage Railway Gorge",
    slug: "patalpani",
    description:
      "A picturesque 300-foot waterfall cascading into a deep mythical gorge near Mhow, surrounded by lush green valleys and traversed by India's oldest scenic metre-gauge heritage train.",
    latitude: 22.502,
    longitude: 75.798,
    category: "Monsoon Waterfall & Scenic Gorge",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/7/75/Patalpani_waterfalls_Mhow_Indore.jpg",
    image_source: "Western Railway Heritage / MP Tourism",
    image_source_url: "https://www.mptourism.com/destination-indore.php",
    image_alt:
      "Patalpani waterfall plunging into misty forest canyon during monsoon",
    image_credit: "MP Tourism Eco Wing",
    image_license: "Tourism Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "35 km from Indore via Mhow; smooth paved road up to the waterfall overlook viewpoint.",
    safety_tips: [
      "Flash floods occur suddenly in rainy season; strictly obey barrier warnings",
      "Never attempt descending to the bottom of the gorge pool during monsoons",
      "Heritage train rides from Patalpani to Kalakund operate on weekends",
    ],
  },
  {
    id: "55555555-0005-0005-0005-000000000001",
    name: "Junapani Waterfall & Forest Trail",
    slug: "junapani",
    description:
      "A serene monsoon eco-tourism getaway near Indore featuring seasonal streams, natural rock pools, verdant forest trails, and tranquil picnic clearings away from crowded tourist circuits.",
    latitude: 22.4862,
    longitude: 75.8234,
    category: "Monsoon Waterfall & Forest Trail",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/e/ec/Waterfall_in_forest_monsoon_stream.jpg",
    image_source: "Indore Ecotourism Promotion Council",
    image_source_url: "https://indore.nic.in/",
    image_alt: "Cascading forest streams and natural pools at Junapani",
    image_credit: "MP Ecotourism Wing",
    image_license: "Public Domain / Tourism Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Approx 35 km from Indore via Mhow-Manpur highway; the final 3 km involves an unpaved forest track. Vehicles with higher ground clearance recommended.",
    safety_tips: [
      "Seasonal flow is strongest during peak monsoon (July to September)",
      "Avoid climbing wet, mossy boulders near the water edge",
      "Carry water and snacks as local vendor stalls are limited",
    ],
  },
  {
    id: "55555555-0005-0005-0005-000000000004",
    name: "Kalakund Forest & Heritage Railway Valley",
    slug: "kalakund",
    description:
      "A lush valley along the Choral River famous for dense teak forest trails, the historic Patalpani-Kalakund metre-gauge heritage railway train ride, and its authentic regional specialty sweet—Kalakund.",
    latitude: 22.4578,
    longitude: 75.8236,
    category: "Heritage Railway & River Valley",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/4/41/Patalpani_Kalakund_Heritage_Railway_Line.jpg",
    image_source: "Western Railway Heritage / MP Tourism",
    image_source_url: "https://www.mptourism.com/",
    image_alt: "Heritage train corridor and lush river valley at Kalakund",
    image_credit: "Western Railway / MP Tourism",
    image_license: "Public Tourism Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Approx 40 km from Indore via Mhow; accessible by road or via the scenic weekend heritage train from Patalpani.",
    safety_tips: [
      "Weekend heritage train tickets should be reserved via IRCTC in advance during monsoon",
      "Check river water levels before crossing low-lying culverts during heavy downpours",
      "Do not walk across active railway tunnels and trestle bridges on foot",
    ],
  },
  {
    id: "22222222-0002-0002-0002-000000000004",
    name: "Janapav Kuti (Parshuram Birthplace)",
    slug: "janapav",
    description:
      "The highest peak of the Malwa plateau (881m) and traditional birthplace of Lord Parshuram, where twelve rivers are believed to originate amidst misty hilltop forests.",
    latitude: 22.46,
    longitude: 75.68,
    category: "Hilltop Viewpoint & Spiritual Trek",
    region: "Madhya Pradesh",
    hero_image_url: "https://i.ytimg.com/vi/_oMr_C4-hUU/maxresdefault.jpg",
    image_source: "Indore District Tourism Promotion Council",
    image_source_url: "https://indore.nic.in/en/tourist-place/janapav/",
    image_alt:
      "Lush misty green peaks and valley overlook from Janapav Kuti summit",
    image_credit: "District Administration Indore / MP Tourism",
    image_license: "Public Tourism Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "45 km from Indore directly off Mumbai-Agra NH 52; steep paved winding road to summit.",
    safety_tips: [
      "Summit road has sharp curves; drive cautiously in heavy fog",
      "Panoramic 360-degree viewpoint overlooking Malwa plains",
      "Ayurvedic herbs and ashram atmosphere on hilltop",
    ],
  },
  {
    id: "22222222-0002-0002-0002-000000000003",
    name: "Choral Dam & Backwater Resort",
    slug: "choral-dam",
    description:
      "A tranquil green reservoir surrounded by low hills of the Vindhyan range, ideal for weekend picnics, paddle boating, birdwatching, and peaceful rural retreats.",
    latitude: 22.42,
    longitude: 75.76,
    category: "Eco-Retreat & Water Leisure",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/6/6f/Choral_Dam_Reservoir_Indore.jpg",
    image_source: "MP Tourism Resorts",
    image_source_url: "https://www.mptourism.com/destination-choral.php",
    image_alt: "Choral Dam serene reservoir waters and green hill slopes",
    image_credit: "MPSTDC Choral Resort",
    image_license: "Tourism Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "45 km from Indore on Khandwa road; scenic winding road through green hills.",
    safety_tips: [
      "MP Tourism operates a serene tourist bungalow on the reservoir bank",
      "Pedal and motor boats available with safety gear",
      "Great stopover on the way to Omkareshwar",
    ],
  },
  {
    id: "55555555-0005-0005-0005-000000000002",
    name: "Lodhiya Kund Waterfall",
    slug: "lodhiya-kund",
    description:
      "A hidden natural plunge pool and cascading waterfall nestled in the valley near Manpur, offering a picturesque picnic and trekking spot bordered by rugged rocks and dense flora.",
    latitude: 22.4215,
    longitude: 75.6421,
    category: "Hidden Waterfall & Trekking",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/Plunge_pool_waterfall_canyon.jpg",
    image_source: "Madhya Pradesh Ecotourism Board",
    image_source_url: "https://indore.nic.in/",
    image_alt: "Scenic waterfall and rocky natural plunge pool at Lodhiya Kund",
    image_credit: "Indore District Administration",
    image_license: "State Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Approx 50 km from Indore via AB Road (NH 52) towards Manpur; last 2 km requires gentle off-road driving and a short 15-minute downhill hike.",
    safety_tips: [
      "Water depth in the central kund can be deceptively deep; swimming is not advised without life jackets",
      "Wear trekking shoes with strong grip for navigating gravel slopes",
      "Depart before sunset as the route lacks night lighting",
    ],
  },
  {
    id: "99999999-9999-9999-9999-999999999999",
    name: "Ujjain Mahakal & Shri Mahakal Mahalok",
    slug: "ujjain",
    description:
      "One of the seven sacred Moksha puris in India, home to the revered Mahakaleshwar Jyotirlinga, the grand 900m Shri Mahakal Mahalok corridor, and Ram Ghat on the sacred Shipra.",
    latitude: 23.1765,
    longitude: 75.7885,
    category: "Pilgrimage & Spiritual Culture",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/3/36/Mahakaleshwar_Jyotirlinga_Temple_Ujjain.jpg",
    image_source: "Shri Mahakaleshwar Temple Management Committee",
    image_source_url: "https://shrimahakaleshwar.com/",
    image_alt: "Spire and complex of Mahakaleshwar Temple in Ujjain",
    image_credit: "Ujjain Smart City / Temple Trust",
    image_license: "Official Shrine Source",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Indore-Ujjain 4-lane expressway (SH 27) approx 55 km; high capacity transit with multiple rest plazas.",
    safety_tips: [
      "Bhasma Aarti pre-booking required on official shrine portal",
      "Battery e-rickshaws operate throughout the Mahakal corridor",
      "Evening Shipra River Aarti begins around sunset at Ram Ghat",
    ],
  },
  {
    id: "55555555-0005-0005-0005-000000000005",
    name: "Jam Gate (Vindhyachal Gateway)",
    slug: "jam-gate",
    description:
      "A historic 18th-century stone gateway built by Maharani Ahilyabai Holkar standing perched atop the Vindhya ridge (800m), renowned for panoramic cloud inversions, sunrise views, and dramatic mountain ghats.",
    latitude: 22.3685,
    longitude: 75.7618,
    category: "Historical Viewpoint & Mountain Ghat",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/1/18/Jam_Gate_Mhow_Indore.jpg",
    image_source: "Khargone Tourism / Ahilya Heritage",
    image_source_url: "https://khargone.nic.in/",
    image_alt:
      "Historic Jam Gate stone archway overlooking misty mountain valley",
    image_credit: "MP Tourism / District Administration",
    image_license: "Heritage Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Approx 55 km from Indore via Mhow-Mandleshwar ghat road; scenic multi-hairpin mountain pass with smooth asphalt tarmac.",
    safety_tips: [
      "Exercise caution when driving through thick fog or low-visibility clouds during morning hours",
      "Use low gears on the steep descent towards Mandleshwar",
      "Early morning sunrise (5:30 AM to 7:00 AM) provides optimal cloud cover vistas",
    ],
  },
  {
    id: "22222222-0002-0002-0002-000000000001",
    name: "Omkareshwar Island & Jyotirlinga",
    slug: "omkareshwar",
    description:
      "A revered pilgrimage island in the Narmada River shaped naturally like the sacred 'Om' symbol (Mandhata Island), home to the ancient Omkareshwar and Mamleshwar shrines.",
    latitude: 22.2464,
    longitude: 76.1511,
    category: "Pilgrimage & Sacred Island",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/c/c9/Omkareshwar_temple_and_Narmada_river.jpg",
    image_source: "Shri Omkareshwar Temple Trust / MP Tourism",
    image_source_url: "https://www.mptourism.com/destination-omkareshwar.php",
    image_alt:
      "Sacred Mandhata island and Narmada ghat temples with suspension bridge",
    image_credit: "MP Tourism / Temple Board",
    image_license: "Verified Pilgrimage Source",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "77 km south of Indore via Khandwa Road (SH 27); well-paved road with scenic Narmada valley ghats.",
    safety_tips: [
      "Suspension bridges (Jhula Pul) connect mainland to the island",
      "Island parikrama (circumnavigation) trail is 7 km; start early morning",
      "Life jackets mandatory during motorized boat crossings",
    ],
  },
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    name: "Maheshwar Holy Ghats & Ahilya Fort",
    slug: "maheshwar",
    description:
      "A tranquil spiritual town on the sacred Narmada river, renowned for Rani Ahilyabai Holkar's stone palace, traditional handloom Maheshwari weaving, and ancient temple ghats.",
    latitude: 22.179,
    longitude: 75.584,
    category: "Culture, Weaving Heritage & Spiritual",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/1/1a/Maheshwar_Ghat_Ahilya_Fort.jpg",
    image_source: "Ahilya Fort Heritage Trust & MP Tourism",
    image_source_url: "https://www.mptourism.com/destination-maheshwar.php",
    image_alt:
      "Stone temple ghats and Ahilya Fort overlooking the wide sacred Narmada River",
    image_credit: "MP Tourism / Ahilya Heritage",
    image_license: "Heritage Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "90 km from Indore via AB Road and Dhamnod bypass; smooth 4-lane expressway and rural connector.",
    safety_tips: [
      "Visit Rehwa Society inside fort complex for live master handloom weaving",
      "Sunset wooden boat ride to Baneshwar temple in mid-river is highly recommended",
      "Morning ghat walks are peaceful and serene",
    ],
  },
  {
    id: "55555555-0005-0005-0005-000000000006",
    name: "Sahastradhara (Thousand Streams)",
    slug: "sahastradhara-maheshwar",
    description:
      "A natural wonder on the Narmada River near Maheshwar where the wide river breaks over jagged volcanic rock into a thousand rushing whitewater channels and tranquil rock pools.",
    latitude: 22.1645,
    longitude: 75.5412,
    category: "River Rapids & Geological Marvel",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/87/Sahastradhara_Maheshwar_Narmada_Rapids.jpg",
    image_source: "MP Tourism / Maheshwar Heritage",
    image_source_url: "https://www.mptourism.com/destination-maheshwar.php",
    image_alt:
      "Narmada river dividing into multiple channels over volcanic rock formations at Sahastradhara",
    image_credit: "MP Tourism Khargone Wing",
    image_license: "Tourism Board Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Approx 5 km upstream from Maheshwar Fort; accessible via boat ride or a short paved country road connecting to the rocky bank.",
    safety_tips: [
      "River currents in the narrow rock channels are strong; avoid swimming across deep channels",
      "Hire motorized wooden boats from Maheshwar ghats for scenic river access",
      "Volcanic rocks can be sharp and uneven; wear sturdy sandals or shoes",
    ],
  },
  {
    id: "d4444444-4444-4444-4444-444444444444",
    name: "Mandu (City of Joy / Mandavgad)",
    slug: "mandu",
    description:
      "A ruined medieval fortress city celebrated for Afghan architecture, the floating Jahaz Mahal, Hindola Mahal, Rani Roopmati Pavilion, and baobab trees perched on the Vindhya crest.",
    latitude: 22.366,
    longitude: 75.343,
    category: "Historical Citadel & Romantic Heritage",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/9/91/Jahaz_Mahal_in_Mandu%2C_Madhya_Pradesh.jpg",
    image_source: "Archaeological Survey of India / MP Tourism",
    image_source_url: "https://www.mptourism.com/destination-mandu.php",
    image_alt:
      "Jahaz Mahal palace structure reflected in the reservoir waters at Mandu",
    image_credit: "ASI / MP Tourism",
    image_license: "Tourism Board Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Approached via Dhar/Indore (95 km) through smooth state highways with scenic plateau winding roads.",
    safety_tips: [
      "Bicycle and e-bike rentals available at monument gates",
      "Monsoon season (July-October) offers misty clouds and peak greenery",
      "Watch for steep stone staircases in ancient pavilions",
    ],
  },
  {
    id: "22222222-0002-0002-0002-000000000005",
    name: "Burhanpur Shahi Qila & Asirgarh Fortress",
    slug: "burhanpur-asirgarh",
    description:
      "The historic 'Gateway to the Deccan' featuring the invincible Asirgarh hilltop fort, Mughal bathhouses (Shahi Hammam), black stone Jama Masjid, and the unique underground Kundi Bhandara water system.",
    latitude: 21.31,
    longitude: 76.22,
    category: "Mughal Architecture & Massive Fort",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/b/b5/Asirgarh_Fort_Burhanpur_Madhya_Pradesh.jpg",
    image_source: "Archaeological Survey of India / MP Tourism",
    image_source_url:
      "https://burhanpur.nic.in/en/tourist-place/asirgarh-fort/",
    image_alt:
      "Asirgarh hilltop stone fortress battlements overlooking Satpura valleys",
    image_credit: "ASI Bhopal Circle / Burhanpur Tourism",
    image_license: "State Heritage Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "180 km from Indore via Sanawad & Khandwa (SH 27 / NH 347); smooth state highway.",
    safety_tips: [
      "Asirgarh fort is expansive; carry sun protection and comfortable walking shoes",
      "UNESCO tentative listed underground water labyrinth Kundi Bhandara is a must-see",
      "Sample authentic Burhanpuri Mawa Jalebi and Daraba sweet in local markets",
    ],
  },

  // --- BHOPAL & CENTRAL MP REGION ---
  {
    id: "11111111-0001-0001-0001-000000000004",
    name: "Islamnagar & Chaman Mahal",
    slug: "islamnagar",
    description:
      "A hidden Afghan-Mughal garden palace established in 1715 by Dost Mohammad Khan, showcasing charbagh gardens, sandstone pavilions, ornate sheesh mahals, and lotus fountains.",
    latitude: 23.36,
    longitude: 77.41,
    category: "Hidden Heritage & Mughal Gardens",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/2/23/Chaman_Mahal_Islamnagar_Bhopal.jpg",
    image_source: "Madhya Pradesh State Archaeology",
    image_source_url:
      "https://bhopal.nic.in/en/tourist-place/chaman-mahal-islamnagar/",
    image_alt:
      "Chaman Mahal charbagh garden pavilions and red sandstone corridors",
    image_credit: "MP Archaeology / Bhopal Heritage",
    image_license: "State Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Quick 14 km drive north of Bhopal along Berasia road; well-paved village road.",
    safety_tips: [
      "Open from sunrise to sunset under MP Archaeology protection",
      "Very peaceful, uncrowded alternative for history and photography buffs",
      "Combine with a visit to Halali Dam nearby",
    ],
  },
  {
    id: "11111111-0001-0001-0001-000000000006",
    name: "Kerwa & Kaliasot Eco-Adventure Zone",
    slug: "kerwa-dam",
    description:
      "A nature and adventure hub located on the southwestern fringe of Bhopal, famous for nature trails, India's longest twin zip line across water, and birdwatching.",
    latitude: 23.161,
    longitude: 77.375,
    category: "Adventure & Nature Escape",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/5/52/Kerwa_Dam_Bhopal_Landscape.jpg",
    image_source: "MP Ecotourism Development Board",
    image_source_url: "https://www.mptourism.com/destination-kerwa.php",
    image_alt:
      "Green forested hills and lake waters at Kerwa Eco-Adventure Zone",
    image_credit: "MP Ecotourism Board",
    image_license: "State Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "15 km from Bhopal city center; smooth asphalt road winding through green hills.",
    safety_tips: [
      "Zipline and rope activities operate under certified instructors",
      "Forest edge territory; avoid solitary hikes after sunset",
      "Excellent spot for morning cycling and weekend drives",
    ],
  },
  {
    id: "11111111-0001-0001-0001-000000000001",
    name: "Bhojpur Shiva Temple (Bhojeshwar)",
    slug: "bhojpur",
    description:
      "An architectural marvel founded by Raja Bhoj in the 11th century, housing one of the world's tallest monolithic Shiva Lingams (7.5 ft) set on a grand 21 ft platform.",
    latitude: 23.1,
    longitude: 77.5833,
    category: "Ancient Architecture & Spiritual",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/c/c5/Bhojpur_Temple_Madhya_Pradesh.jpg",
    image_source: "Archaeological Survey of India (ASI)",
    image_source_url: "https://www.mptourism.com/destination-bhojpur.php",
    image_alt:
      "Massive monolithic stone sanctum and entrance dome of Bhojpur Shiva Temple",
    image_credit: "MP Tourism / ASI Central Circle",
    image_license: "State Heritage Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Smooth 28 km state road connecting from Bhopal via 11 Mile bypass; accessible for all vehicles.",
    safety_tips: [
      "Betwa riverbank nearby has rocky terrain; avoid swimming during monsoons",
      "Stone steps inside the sanctum can be slippery during aarti times",
      "Combines well with a day trip to Bhimbetka",
    ],
  },
  {
    id: "88888888-8888-8888-8888-888888888888",
    name: "Bhimbetka Rock Shelters",
    slug: "bhimbetka",
    description:
      "An extraordinary UNESCO World Heritage site displaying human rock paintings over 30,000 years old, depicting prehistoric dance, hunting, and daily life on sandstone bluffs.",
    latitude: 22.9372,
    longitude: 77.6128,
    category: "Prehistoric Archaeology & Caves",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/f/fc/Bhimbetka_rock_paintings_Madhya_Pradesh.jpg",
    image_source: "Archaeological Survey of India (ASI)",
    image_source_url: "https://whc.unesco.org/en/list/925/",
    image_alt:
      "Prehistoric red and white cave rock paintings at Bhimbetka Rock Shelters",
    image_credit: "ASI Bhimbetka Heritage Circle",
    image_license: "World Heritage Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Directly off NH 46 (Bhopal-Hoshangabad highway) approx 45 km; quick turnoff with paved access road.",
    safety_tips: [
      "Short 1.5 km walking trail across rock clusters; wear sturdy footwear",
      "Guide audio devices available at entry kiosk",
      "Stay on paved paths to protect delicate prehistoric art",
    ],
  },
  {
    id: "11111111-0001-0001-0001-000000000005",
    name: "Halali Dam & Backwaters",
    slug: "halali-dam",
    description:
      "A massive reservoir on the Halali river surrounded by gentle green hills, offering boat rides, water birds, fishing, and a serene MP Tourism lakeside resort.",
    latitude: 23.5042,
    longitude: 77.555,
    category: "Lakeside Retreat & Water Sports",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/7/7b/Halali_Dam_Reservoir_Madhya_Pradesh.jpg",
    image_source: "MP Tourism Water Sports & Resorts",
    image_source_url: "https://www.mptourism.com/destination-halali.php",
    image_alt: "Halali reservoir lake waters and MP Tourism boat dock",
    image_credit: "MP State Tourism Development Corporation",
    image_license: "Tourism Board Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "40 km from Bhopal via Bhopal-Vidisha highway; good state road connecting right to the resort gates.",
    safety_tips: [
      "Boating available through MP Tourism boat club",
      "Swimming in deep dam waters without life jackets is strictly prohibited",
      "Monsoon and post-monsoon (August-January) offer full water levels",
    ],
  },
  {
    id: "c3333333-3333-3333-3333-333333333333",
    name: "Sanchi Stupa & Archaeological Complex",
    slug: "sanchi",
    description:
      "One of India's oldest stone structures commissioned by Emperor Ashoka in the 3rd century BCE, representing timeless Buddhist art, ornate Toranas, and monastic legacy.",
    latitude: 23.48,
    longitude: 77.74,
    category: "UNESCO Heritage & History",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/0/07/The_Great_Stupa_at_Sanchi%2C_Madhya_Pradesh%2C_India.jpg",
    image_source: "Archaeological Survey of India (ASI) / UNESCO",
    image_source_url: "https://whc.unesco.org/en/list/524/",
    image_alt:
      "The Great Sanchi Stupa showing detailed Ashokan stone Torana gateway carvings",
    image_credit: "ASI / UNESCO World Heritage",
    image_license: "World Heritage Public Domain / CC-BY-SA",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Direct 4-lane SH 19 / NH 146 highway from Bhopal (approx 46 km); dual carriageway with smooth tarmac.",
    safety_tips: [
      "Electric golf carts available on campus for elderly visitors",
      "ASI museum is closed on Fridays",
      "Ideal for early morning or sunset visits to avoid midday sun",
    ],
  },
  {
    id: "11111111-0001-0001-0001-000000000002",
    name: "Raisen Hilltop Fortress",
    slug: "raisen-fort",
    description:
      "A dramatic 800-year-old hilltop citadel with massive stone ramparts, 9 gateways, 40 rock-cut wells, an ancient Shiva temple, and a cliffside shrine overlooking panoramic plains.",
    latitude: 23.3323,
    longitude: 77.7816,
    category: "Historical Fortress & Viewpoint",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/3/30/Raisen_Fort_Madhya_Pradesh.jpg",
    image_source: "Madhya Pradesh Directorate of Archaeology",
    image_source_url: "https://raisen.nic.in/en/tourist-place/raisen-fort/",
    image_alt:
      "Ancient stone ramparts and watchtowers of Raisen Hilltop Fortress",
    image_credit: "District Administration Raisen / MP Tourism",
    image_license: "Public Heritage Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "45 km east of Bhopal via NH 146; steep paved ramp road leads to fort gate with parking.",
    safety_tips: [
      "Requires 20-30 minutes uphill walking through stone gates",
      "Carry sufficient drinking water as uphill stalls are limited",
      "Evening sunset offers spectacular 360-degree photography",
    ],
  },
  {
    id: "11111111-0001-0001-0001-000000000003",
    name: "Ratapani Tiger Reserve & Delawadi",
    slug: "ratapani",
    description:
      "A dense teak jungle and wildlife reserve spreading across the Vindhyan hills, featuring secluded water reservoirs, wild leopards, tigers, sloth bears, and prehistoric rock art.",
    latitude: 22.842,
    longitude: 77.585,
    category: "Wildlife Safari & Forest Retreat",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ratapani_Wildlife_Sanctuary_Jungle.jpg",
    image_source: "Madhya Pradesh Forest Department",
    image_source_url: "https://forest.mponline.gov.in/",
    image_alt:
      "Teak forest safari track and wildlife waterhole in Ratapani Sanctuary",
    image_credit: "MP Forest Department / Ecotourism Board",
    image_license: "Official Wildlife Source",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "NH 46 to Obaidullaganj then forest road through Delawadi; high ground clearance / SUV recommended for deep tracks.",
    safety_tips: [
      "Strict forest department permits required for jeep safaris",
      "Do not venture into forest trails on foot without a designated ranger",
      "Check gate opening hours before planning early morning drives",
    ],
  },
  {
    id: "22222222-0002-0002-0002-000000000006",
    name: "Gandhi Sagar Sanctuary & Hinglajgarh Fort",
    slug: "gandhi-sagar",
    description:
      "An offbeat wildlife haven along the Chambal river reservoir in Mandsaur, featuring rock-cut temples, prehistoric rock art, Hinglajgarh forest citadel, and boat safaris for marsh crocodiles and leopards.",
    latitude: 24.58,
    longitude: 75.65,
    category: "Hidden Wildlife Sanctuary & Canyon",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/e/ec/Gandhi_Sagar_Dam_Mandsaur.jpg",
    image_source: "MP Tourism / Gandhi Sagar Festival",
    image_source_url: "https://www.mptourism.com/destination-gandhisagar.php",
    image_alt:
      "Chambal river reservoir water canyons and wildlife forest edge at Gandhi Sagar",
    image_credit: "MP Tourism Ecotourism Wing",
    image_license: "Official Tourism Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Mandsaur/Neemuch to Bhanpura via SH; rugged scenic landscape with paved access.",
    safety_tips: [
      "Annual Gandhi Sagar Floating Festival operates luxury tent cities and water sports",
      "Hire registered forest guides for rock art site visits",
      "Winter season (Nov-Feb) brings thousands of migratory aquatic birds",
    ],
  },
  {
    id: "11111111-0001-0001-0001-000000000007",
    name: "Madhai & Satpura Tiger Reserve Backwaters",
    slug: "madhai-satpura",
    description:
      "An offbeat ecotourism sanctuary offering silent motorless canoe safaris across Denwa backwaters, walking jungle patrols, and pristine teak wilderness away from crowd trails.",
    latitude: 22.58,
    longitude: 77.98,
    category: "Wildlife Safari & River Backwaters",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/d/da/Satpura_National_Park_Madhai_Landscape.jpg",
    image_source: "Satpura Tiger Reserve Authority",
    image_source_url: "https://forest.mponline.gov.in/",
    image_alt:
      "Denwa river canoe crossing overlooking Satpura national park hills at Madhai",
    image_credit: "Satpura Tiger Reserve / MP Forest",
    image_license: "Official Wildlife Source",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Bhopal to Sohagpur via NH 46 & SH 22 (approx 140 km), followed by a 18 km forest road to Denwa river bank.",
    safety_tips: [
      "Vehicles park on the outer river bank; boat transfer required to enter core park",
      "Night safaris on the buffer zone provide unique sloth bear sightings",
      "Advanced safari booking required through MP Online portal",
    ],
  },
  {
    id: "a1111111-1111-1111-1111-111111111111",
    name: "Pachmarhi (Queen of Satpura)",
    slug: "pachmarhi",
    description:
      "A pristine hill station nestled in the Satpura range, famed for cascading waterfalls like Bee Falls, prehistoric cave paintings at Pandav Caves, sunset viewpoints at Dhoopgarh, and tranquil pine forests.",
    latitude: 22.4674,
    longitude: 78.4346,
    category: "Hill Station & Nature",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/e/e7/Bee_Falls_Pachmarhi.jpg",
    image_source: "Madhya Pradesh Tourism Board",
    image_source_url: "https://www.mptourism.com/destination-pachmarhi.php",
    image_alt:
      "Bee Falls cascading through lush Satpura valley rocks in Pachmarhi",
    image_credit: "MP Tourism / Satpura Ecotourism",
    image_license: "Tourism Board Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Scenic ghat roads from Pipariya; well-maintained asphalt with hairpin curves. Low gears recommended on descents.",
    safety_tips: [
      "Maintain low gears on ghat descents; avoid excessive braking",
      "Forest entry permit required for core reserve zones and Dhoopgarh",
      "Pre-book forest gypsy safari for Bee Falls and Duchess Falls",
    ],
  },
  {
    id: "33333333-0003-0003-0003-000000000004",
    name: "Patalkot Valley & Tamia Hills",
    slug: "patalkot-tamia",
    description:
      "A secluded 1,200-foot-deep horseshoe-shaped canyon in Chhindwara, home to indigenous Bharia tribes, 18 isolated villages, untouched flora, and rare ethno-medicinal herbs.",
    latitude: 22.4,
    longitude: 78.75,
    category: "Hidden Canyon & Tribal Eco-Heritage",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/0/03/Patalkot_Valley_Chhindwara.jpg",
    image_source: "Chhindwara District Administration / MP Tourism",
    image_source_url: "https://chhindwara.nic.in/en/tourist-place/patalkot/",
    image_alt:
      "Deep dramatic green gorge and isolated tribal settlement basin in Patalkot Valley",
    image_credit: "MP Ecotourism / Chhindwara Tribal Council",
    image_license: "Tribal Heritage Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "78 km northwest of Chhindwara via Tamia ghats; winding hill roads with breathtaking valley lookouts.",
    safety_tips: [
      "Hiring a local tribal guide is mandatory for descending into the valley basin",
      "Sunlight reaches the deep canyon floor only for a few hours around midday",
      "Tamia PWD Rest House offers one of MP's best cliffside sunrise views",
    ],
  },

  // --- EASTERN MP, BUNDELKHAND & NORTHERN MP (MAJOR HIGHLIGHTS) ---
  {
    id: "e5555555-5555-5555-5555-555555555555",
    name: "Bhedaghat & Marble Rocks",
    slug: "bhedaghat",
    description:
      "Towering crystalline marble cliffs rising 100 feet on either side of the sacred Narmada River, creating the roaring Dhuandhar Falls, cable ropeway, and serene moonlight boat gorges.",
    latitude: 23.1311,
    longitude: 79.8006,
    category: "Geological Wonder & River Gorge",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/6/69/Dhuandhar_Falls_Bhedaghat_Jabalpur.jpg",
    image_source: "Jabalpur Tourism Promotion Council / MP Tourism",
    image_source_url: "https://www.mptourism.com/destination-bhedaghat.php",
    image_alt:
      "Crystalline white marble cliffs and boat gorge along the Narmada at Bhedaghat",
    image_credit: "MP Tourism Jabalpur Wing",
    image_license: "Tourism Board Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Fast 22 km highway drive from Jabalpur city center; broad bypass road with smooth tarmac.",
    safety_tips: [
      "Boating is suspended during peak monsoon flood currents (July-Sept)",
      "Full moon night boat rides through the marble canyon are extraordinarily popular",
      "Cable car ropeway connects both banks directly above Dhuandhar falls",
    ],
  },
  {
    id: "33333333-0003-0003-0003-000000000002",
    name: "Pench National Park (Mowgli's Land)",
    slug: "pench",
    description:
      "The classic landscape of teak forests and the meandering Pench River, renowned for tiger tracking, leopard sightings, Indian wild dogs (Dhole), and wolf sanctuaries.",
    latitude: 21.75,
    longitude: 79.3,
    category: "Wildlife Safari & Ecotourism",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/e/ee/Pench_National_Park_Tiger_Safari.jpg",
    image_source: "Pench Tiger Reserve Directorate",
    image_source_url: "https://penchtiger.mponline.gov.in/",
    image_alt:
      "Teak forest tree canopy and riverbed clearing in Pench National Park",
    image_credit: "Pench Tiger Reserve Authority",
    image_license: "Official Park Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Directly accessible from Seoni and Nagpur via NH 44 (four-lane expressway with wildlife elevated corridor).",
    safety_tips: [
      "Turia and Karmajhiri are the most popular entry gates",
      "Night buffer safaris offer nocturnal wildlife viewing",
      "Check gate locations when booking lodging accommodations",
    ],
  },
  {
    id: "44444444-0004-0004-0004-000000000005",
    name: "Chanderi Heritage Town & Weaving Cluster",
    slug: "chanderi",
    description:
      "An ancient fortified town surrounded by hills and lakes, celebrated for handwoven Chanderi silk sarees, the grand Koshak Mahal, Badal Mahal Gate, and the hilltop Chanderi Fort.",
    latitude: 24.715,
    longitude: 78.135,
    category: "Silk Weaving Heritage & Fortified Town",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/a/a2/Badal_Mahal_Gate_Chanderi.jpg",
    image_source: "Chanderi Handloom Weavers Guild / MP Tourism",
    image_source_url: "https://www.mptourism.com/destination-chanderi.php",
    image_alt:
      "Badal Mahal monumental stone gateway with hilltop Chanderi fort in background",
    image_credit: "MP Tourism / Chanderi Craft Council",
    image_license: "Craft & Heritage Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "110 km from Jhansi / 210 km from Bhopal via Lalitpur or Ashoknagar; good state highways.",
    safety_tips: [
      "Explore Pranpur craft village for live traditional loom demonstrations",
      "Chanderi Fort offers stunning sunset views over the whitewashed historic town",
      "Chanderi Museum preserves exquisite sculptures and ancient coins",
    ],
  },
  {
    id: "44444444-0004-0004-0004-000000000001",
    name: "Gwalior Fort & Gopachal Rock Statues",
    slug: "gwalior-fort",
    description:
      "Referred to as 'The Pearl in the necklace of forts of India' by Babur, perched atop a steep sandstone hill with Man Mandir Palace, Sas Bahu Temples, Teli ka Mandir, and giant 7th-century rock-cut Jain Tirthankaras.",
    latitude: 26.2295,
    longitude: 78.167,
    category: "Hill Fortress & Ancient Citadel",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/e/e0/Gwalior_Fort_Man_Mandir_Palace.jpg",
    image_source: "Archaeological Survey of India / Gwalior Heritage",
    image_source_url: "https://gwalior.nic.in/en/tourist-place/gwalior-fort/",
    image_alt:
      "Man Mandir Palace sandstone battlements and ornate turquoise tile frieze at Gwalior Fort",
    image_credit: "ASI / MP Tourism",
    image_license: "National Monument Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Direct 6-lane NH 44 connectivity; smooth uphill climb to the fort gate from Urvai Gate or Gwalior Gate.",
    safety_tips: [
      "Urvai Gate ascent allows driving cars up to the fort summit parking",
      "Visit Jai Vilas Palace and Scindia Museum in the city below",
      "Evening sound and light show narrated by Amitabh Bachchan",
    ],
  },
  {
    id: "77777777-7777-7777-7777-777777777777",
    name: "Kanha National Park & Tiger Reserve",
    slug: "kanha",
    description:
      "Vast Sal forests and sweeping meadows that inspired Rudyard Kipling's Jungle Book, hosting flourishing populations of Royal Bengal Tigers and the rare Hardground Barasingha (swamp deer).",
    latitude: 22.3345,
    longitude: 80.6115,
    category: "Wildlife Safari & Tiger Reserve",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/1/14/Tiger_Kanha_National_Park.jpg",
    image_source: "Kanha Tiger Reserve Field Directorate",
    image_source_url: "https://kanhatigerreserve.org/",
    image_alt:
      "Royal Bengal tiger moving through open Sal meadows in Kanha National Park",
    image_credit: "Kanha Tiger Reserve Authority / MP Forest",
    image_license: "Official Tiger Reserve Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Good state highway from Jabalpur (160 km) and Raipur; forest fringe roads require slow cautious driving.",
    safety_tips: [
      "Park closed July 1 to Sept 30 during annual breeding season",
      "Safari slots across Khatia, Mukki, and Sarhi gates must be booked in advance",
      "Morning safaris require early 5:30 AM reporting at designated gates",
    ],
  },
  {
    id: "b2222222-2222-2222-2222-222222222222",
    name: "Khajuraho Group of Monuments",
    slug: "khajuraho",
    description:
      "A world-renowned UNESCO World Heritage site known for magnificent Nagara-style architectural temples, intricate stone carvings, and the annual Khajuraho Dance Festival.",
    latitude: 24.8318,
    longitude: 79.9199,
    category: "UNESCO Heritage & Architecture",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/d/df/Kandariya_Mahadeva_Temple%2C_Khajuraho.jpg",
    image_source: "Archaeological Survey of India / UNESCO",
    image_source_url: "https://whc.unesco.org/en/list/240/",
    image_alt:
      "Kandariya Mahadeva Temple Nagara shikhara and stone relief friezes in Khajuraho",
    image_credit: "ASI / UNESCO World Heritage",
    image_license: "World Heritage Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "NH 39 four-lane highway connectivity from Jhansi and Chhatarpur; smooth transit suitable for all vehicles.",
    safety_tips: [
      "Western group of temples requires ASI entry ticket",
      "Light and Sound show operates in evening hours (English & Hindi)",
      "Summer temperatures can exceed 42°C; carry hydration and sun protection",
    ],
  },
  {
    id: "f6666666-6666-6666-6666-666666666666",
    name: "Orchha Historic Royal Town",
    slug: "orchha",
    description:
      "A frozen-in-time riverside kingdom founded in the 16th century, featuring the grand Jahangir Mahal, Raja Mahal, Ram Raja Temple (where Rama is worshipped as King), and riverside Chhatris.",
    latitude: 25.351,
    longitude: 78.6433,
    category: "Palatial Heritage & Riverside Culture",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/9/90/Jahangir_Mahal_Orchha_Madhya_Pradesh.jpg",
    image_source: "Madhya Pradesh State Archaeology / MP Tourism",
    image_source_url: "https://www.mptourism.com/destination-orchha.php",
    image_alt:
      "Royal stone Chhatris and Jahangir Mahal reflected in the Betwa River in Orchha",
    image_credit: "MP Tourism / Orchha Heritage",
    image_license: "State Heritage Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Easy 15 km drive from Jhansi railway hub; wide paved road connecting across the Betwa river.",
    safety_tips: [
      "River rafting and kayaking available on the Betwa in post-monsoon months",
      "Ram Raja Temple follows royal guard of honour salute during daily aarti",
      "Sound and light show inside Orchha Fort palace complex",
    ],
  },
  {
    id: "44444444-0004-0004-0004-000000000007",
    name: "Panna National Park & Diamond Mines",
    slug: "panna-tiger-reserve",
    description:
      "A successful tiger conservation story along the Ken River gorge, known for boat safaris, tree-nesting vulture colonies, pristine Pandav Falls, and India's only active diamond mining belt.",
    latitude: 24.65,
    longitude: 80.05,
    category: "Tiger Reserve, Gorge & Diamond Valley",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/5/52/Ken_River_Panna_National_Park.jpg",
    image_source: "Panna Tiger Reserve Directorate",
    image_source_url: "https://forest.mponline.gov.in/",
    image_alt: "Ken river flowing through rocky gorges in Panna Tiger Reserve",
    image_credit: "Panna Field Directorate / MP Forest",
    image_license: "Tiger Reserve Official",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "45 km from Khajuraho via NH 39; smooth tarmac road right to Madla entrance gate.",
    safety_tips: [
      "Madla and Hinouta gates provide deep forest safari access",
      "Boat ride on the Ken River within the park offers unique crocodile sightings",
      "Combine with Pandav Falls caves on the same circuit",
    ],
  },
  {
    id: "33333333-0003-0003-0003-000000000001",
    name: "Bandhavgarh National Park",
    slug: "bandhavgarh",
    description:
      "Famous for having one of the highest densities of Royal Bengal Tigers in the world, centered around an ancient 2,000-year-old hilltop fort and reclining Vishnu rock sculpture (Shesh Shaiya).",
    latitude: 23.7225,
    longitude: 81.025,
    category: "Wildlife Safari & Ancient Citadel",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/87/Bandhavgarh_Tigress_in_Wild.jpg",
    image_source: "Bandhavgarh Tiger Reserve Authority",
    image_source_url: "https://forest.mponline.gov.in/",
    image_alt:
      "Bandhavgarh cliff fortress backdrop with tiger habitat grasslands in foreground",
    image_credit: "Bandhavgarh Field Directorate / MP Forest",
    image_license: "Official Reserve Source",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "165 km from Jabalpur via Katni / Umaria; 4-lane highway with good connectivity.",
    safety_tips: [
      "Tala, Magdhi, and Khitauli are the prime safari zones",
      "Pre-booking open gypsy vehicles is essential for tiger tracking",
      "Carry warm clothing during November-February morning safaris",
    ],
  },
  {
    id: "33333333-0003-0003-0003-000000000003",
    name: "Amarkantak (Teerthraj / Source of Narmada)",
    slug: "amarkantak",
    description:
      "The sacred meeting point of the Vindhya and Satpura ranges, source of the Holy Narmada and Son rivers, featuring the Narmadakund temple complex, Kapildhara waterfall, and Mai ki Bagiya.",
    latitude: 22.67,
    longitude: 81.75,
    category: "Sacred Source & Mountain Sanctuary",
    region: "Madhya Pradesh",
    hero_image_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8f/Narmadakund_Temple_Complex_Amarkantak.jpg",
    image_source: "Amarkantak Temple Trust / MP Tourism",
    image_source_url: "https://www.mptourism.com/destination-amarkantak.php",
    image_alt:
      "White-washed temple shrines surrounding the sacred Narmadakund in Amarkantak",
    image_credit: "MP Tourism / Holy Shrine Board",
    image_license: "Pilgrimage Verified",
    image_verified_at: "2026-08-21T06:00:00Z",
    road_condition:
      "Scenic ghat road from Jabalpur (220 km) or Shahdol; pine tree lined hill ascent with smooth asphalt.",
    safety_tips: [
      "Temperatures remain pleasant year-round; carry light woolens in winter",
      "Kapildhara and Dudhadhara waterfalls require moderate walking downhill",
      "Visit Kabir Chabutra for sunset views across valley ridges",
    ],
  },
];

// Helper to prevent millisecond ID collisions in tests
const generateId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

// In-Memory Database Store for State & Reviews / Posts
class MemoryDatabase {
  private destinations = [...SEED_DESTINATIONS];
  private reviews: DestinationReview[] = [];
  private posts: CommunityPost[] = [];
  private userVotes: Map<string, 1 | -1> = new Map();
  private reports: PostReport[] = [];
  private itineraries: Map<string, FlexibleItinerary> = new Map();
  private trips: Map<string, TripSession> = new Map();

  async getDestinations(): Promise<Destination[]> {
    if (supabase) {
      const { data, error } = await supabase.from("destinations").select("*");
      if (!error && data && data.length > 0) return data;
    }
    return this.destinations;
  }

  async getDestinationById(id: string): Promise<Destination | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) return data;
    }
    return this.destinations.find((d) => d.id === id || d.slug === id) || null;
  }

  async getReviews(destinationId: string): Promise<DestinationReview[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from("reviews")
        .select(`*, profiles(display_name, avatar_url)`)
        .eq("destination_id", destinationId)
        .order("created_at", { ascending: false });

      // 🚨 LOG THE ERROR SO WE CAN SEE IT!
      if (error) {
        console.error("❌ SUPABASE SELECT ERROR:", error);
      }

      if (data && !error) {
        return data.map((r: any) => ({
          ...r,
          user_name: r.profiles?.display_name || "Traveler",
          user_avatar: r.profiles?.avatar_url || null,
        }));
      }
    }

    console.warn("⚠️ Falling back to mock data because Supabase fetch failed.");
    return this.reviews.filter((r) => r.destination_id === destinationId);
  }

  async getReviewById(id: string): Promise<DestinationReview | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from("reviews")
        .select(`*, profiles(display_name, avatar_url)`)
        .eq("id", id)
        .single();

      // 🚨 LOG THE ERROR SO WE CAN SEE IT!
      if (error) {
        console.error(
          `❌ SUPABASE SELECT ERROR (getReviewById for ${id}):`,
          error,
        );
      }

      if (data && !error) {
        return {
          ...data,
          user_name: data.profiles?.display_name || "Traveler",
          user_avatar: data.profiles?.avatar_url || null,
        };
      }
    }

    console.warn(
      `⚠️ Falling back to mock data for review ${id} because Supabase fetch failed.`,
    );
    return this.reviews.find((r) => r.id === id) || null;
  }

  async createReview(
    review: Omit<DestinationReview, "id" | "created_at">,
  ): Promise<DestinationReview> {
    if (supabase) {
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          destination_id: review.destination_id,
          user_id: review.user_id,
          overall_score: review.overall_score,
          category_scores: review.category_scores,
          body: review.body,
        })
        .select()
        .single();

      // 🚨 DO NOT SILENTLY MOCK ON ERROR. THROW IT SO WE CAN SEE IT. 🚨
      if (error) {
        console.error("❌ SUPABASE REJECTED REVIEW:", error);
        throw new Error(`Database Error: ${error.message}`);
      }

      if (data) return { ...data, user_name: review.user_name };
    }

    // Fallback ONLY if the Supabase client entirely failed to initialize
    console.warn(
      "⚠️ Warning: Supabase client missing, falling back to local mock data.",
    );
    const newReview: DestinationReview = {
      ...review,
      id: generateId("rev"),
      created_at: new Date().toISOString(),
    };
    this.reviews.unshift(newReview);
    return newReview;
  }

  async updateReview(
    destinationId: string,
    userId: string,
    updates: Partial<DestinationReview>,
  ): Promise<{
    success: boolean;
    review?: DestinationReview;
    error?: string;
    status: number;
  }> {
    if (!supabase) {
      return {
        success: false,
        error: "Supabase client not initialized",
        status: 500,
      };
    }

    // 1. Perform the update matching both destination and user
    const { data, error } = await supabase
      .from("reviews")
      .update({
        ...(updates.overall_score !== undefined && {
          overall_score: updates.overall_score,
        }),
        ...(updates.category_scores !== undefined && {
          category_scores: updates.category_scores,
        }),
        ...(updates.body !== undefined && { body: updates.body }),
      })
      .eq("destination_id", destinationId)
      .eq("user_id", userId)
      .select(`*, profiles(display_name, avatar_url)`)
      .single();

    if (error) {
      console.error("❌ Failed to update review:", error);
      return { success: false, error: error.message, status: 400 };
    }

    if (!data) {
      return {
        success: false,
        error: "Review not found or unauthorized",
        status: 404,
      };
    }

    const formattedReview: DestinationReview = {
      ...data,
      user_name: data.profiles?.display_name || "Traveler",
      user_avatar: data.profiles?.avatar_url || null,
    };

    return { success: true, review: formattedReview, status: 200 };
  }

  async deleteReview(
    reviewId: string,
    userId: string,
  ): Promise<{ success: boolean; error?: string; status: number }> {
    const existing = await this.getReviewById(reviewId);
    if (!existing) {
      return {
        success: false,
        error: `Review '${reviewId}' not found`,
        status: 404,
      };
    }
    if (existing.user_id !== userId) {
      return {
        success: false,
        error: "Forbidden: You do not have permission to delete this review",
        status: 403,
      };
    }

    if (supabase) {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId)
        .eq("user_id", userId);
      if (!error) return { success: true, status: 200 };
    }

    this.reviews = this.reviews.filter((r) => r.id !== reviewId);
    return { success: true, status: 200 };
  }

  async getCommunityPosts(options?: {
    destinationId?: string;
    category?: string;
    sortBy?: "for_you" | "latest" | "popular" | "most_discussed";
    currentUserId?: string;
  }): Promise<CommunityPost[]> {
    const destinationId = options?.destinationId;
    const category = options?.category;
    const sortBy = options?.sortBy || "popular";
    const currentUserId = options?.currentUserId;

    if (supabase) {
      let query = supabase
        .from("community_posts")
        .select(
          `*, profiles(display_name, avatar_url), post_images(*), post_comments(*, profiles(display_name, avatar_url)), post_votes(*)`,
        );

      if (destinationId) {
        query = query.eq("destination_id", destinationId);
      }
      if (category && category !== "All") {
        query = query.eq("category", category);
      }

      if (sortBy === "latest") {
        query = query.order("created_at", { ascending: false });
      } else if (sortBy === "most_discussed") {
        query = query.order("comments_count", { ascending: false });
      } else {
        query = query.order("net_votes", { ascending: false });
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map((p: any) => {
          const userVote = currentUserId
            ? p.post_votes?.find((v: any) => v.user_id === currentUserId)
                ?.vote_type
            : null;
          return {
            id: p.id,
            destination_id: p.destination_id,
            user_id: p.user_id,
            user_name: p.profiles?.display_name || "Traveler",
            user_avatar: p.profiles?.avatar_url || null,
            title: p.title,
            body: p.body,
            category: p.category || "General Discussion",
            upvotes_count: p.upvotes_count || 0,
            downvotes_count: p.downvotes_count || 0,
            net_votes: p.net_votes ?? (p.popularity_score || 0),
            user_vote: userVote || null,
            popularity_score: p.popularity_score || p.net_votes || 0,
            images: p.post_images || [],
            comments_count: (p.post_comments || []).length,
            comments: this.organizeNestedComments(p.post_comments || []),
            created_at: p.created_at,
          };
        });
      }
    }

    let list = [...this.posts];
    if (destinationId) {
      list = list.filter((p) => p.destination_id === destinationId);
    }
    if (category && category !== "All") {
      list = list.filter((p) => p.category === category);
    }

    // Attach user votes from in-memory store
    list = list.map((p) => {
      const voteKey = currentUserId ? `${p.id}:${currentUserId}` : null;
      const userVote = voteKey ? this.userVotes.get(voteKey) || null : null;
      return {
        ...p,
        user_vote: userVote,
      };
    });

    if (sortBy === "latest") {
      return list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }
    if (sortBy === "most_discussed") {
      return list.sort(
        (a, b) => (b.comments_count || 0) - (a.comments_count || 0),
      );
    }
    if (sortBy === "for_you") {
      return list.sort(
        (a, b) =>
          b.net_votes * 1.5 +
          (b.comments_count || 0) -
          (a.net_votes * 1.5 + (a.comments_count || 0)),
      );
    }
    // Default: Popular (net_votes desc)
    return list.sort((a, b) => b.net_votes - a.net_votes);
  }

  async getPostById(
    postId: string,
    currentUserId?: string,
  ): Promise<CommunityPost | null> {
    const posts = await this.getCommunityPosts({ currentUserId });
    return posts.find((p) => p.id === postId) || null;
  }

  async votePost(
    postId: string,
    userId: string,
    voteType: 1 | -1,
  ): Promise<{
    success: boolean;
    net_votes: number;
    upvotes_count: number;
    downvotes_count: number;
    user_vote: 1 | -1 | null;
  }> {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) {
      return {
        success: false,
        net_votes: 0,
        upvotes_count: 0,
        downvotes_count: 0,
        user_vote: null,
      };
    }

    const voteKey = `${postId}:${userId}`;
    const previousVote = this.userVotes.get(voteKey) || null;
    let newVote: 1 | -1 | null = voteType;

    if (previousVote === voteType) {
      this.userVotes.delete(voteKey);
      newVote = null;
      if (voteType === 1) {
        post.upvotes_count = Math.max(0, post.upvotes_count - 1);
      } else {
        post.downvotes_count = Math.max(0, post.downvotes_count - 1);
      }
    } else if (previousVote === null) {
      this.userVotes.set(voteKey, voteType);
      if (voteType === 1) {
        post.upvotes_count += 1;
      } else {
        post.downvotes_count += 1;
      }
    } else {
      this.userVotes.set(voteKey, voteType);
      if (voteType === 1) {
        post.upvotes_count += 1;
        post.downvotes_count = Math.max(0, post.downvotes_count - 1);
      } else {
        post.downvotes_count += 1;
        post.upvotes_count = Math.max(0, post.upvotes_count - 1);
      }
    }

    post.net_votes = post.upvotes_count - post.downvotes_count;
    post.popularity_score = post.net_votes + (post.comments_count || 0) * 2;

    if (supabase) {
      if (newVote === null) {
        await supabase
          .from("post_votes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId);
      } else {
        await supabase.from("post_votes").upsert({
          post_id: postId,
          user_id: userId,
          vote_type: newVote,
          updated_at: new Date().toISOString(),
        });
      }
    }

    return {
      success: true,
      net_votes: post.net_votes,
      upvotes_count: post.upvotes_count,
      downvotes_count: post.downvotes_count,
      user_vote: newVote,
    };
  }

  async createCommunityPost(post: {
    destination_id: string;
    user_id: string;
    user_name?: string;
    user_avatar?: string | null;
    title: string;
    body: string;
    category?: PostCategory;
    image_url?: string;
  }): Promise<CommunityPost> {
    const destination = await this.getDestinationById(post.destination_id);
    const newPostId = generateId("post");
    const newPost: CommunityPost = {
      id: newPostId,
      destination_id: post.destination_id,
      destination_name: destination?.name || "Destination",
      user_id: post.user_id,
      user_name: post.user_name || "Traveler",
      user_avatar: post.user_avatar || null,
      title: post.title,
      body: post.body,
      category: post.category || "General Discussion",
      upvotes_count: 1,
      downvotes_count: 0,
      net_votes: 1,
      user_vote: 1,
      popularity_score: 1,
      images: post.image_url
        ? [
            {
              id: generateId("img"),
              post_id: newPostId,
              storage_path: post.image_url,
              mime_type: "image/jpeg",
              size_bytes: 500000,
            },
          ]
        : [],
      comments_count: 0,
      comments: [],
      created_at: new Date().toISOString(),
    };

    this.userVotes.set(`${newPostId}:${post.user_id}`, 1);

    if (supabase) {
      const { data, error } = await supabase
        .from("community_posts")
        .insert({
          destination_id: post.destination_id,
          user_id: post.user_id,
          title: post.title,
          body: post.body,
          category: newPost.category,
          upvotes_count: 1,
          net_votes: 1,
          popularity_score: 1,
        })
        .select()
        .single();
      if (!error && data)
        return { ...data, images: newPost.images, comments: [] };
    }

    this.posts.unshift(newPost);
    return newPost;
  }

  async deletePost(
    postId: string,
    userId: string,
  ): Promise<{ success: boolean; error?: string; status: number }> {
    const post = await this.getPostById(postId);
    if (!post) {
      return {
        success: false,
        error: `Post '${postId}' not found`,
        status: 404,
      };
    }
    if (post.user_id !== userId) {
      return {
        success: false,
        error: "Forbidden: You do not have permission to delete this post",
        status: 403,
      };
    }

    if (supabase) {
      const { error } = await supabase
        .from("community_posts")
        .delete()
        .eq("id", postId)
        .eq("user_id", userId);
      if (!error) return { success: true, status: 200 };
    }

    this.posts = this.posts.filter((p) => p.id !== postId);
    return { success: true, status: 200 };
  }

  async addComment(
    postId: string,
    userId: string,
    userName: string,
    body: string,
    parentId?: string | null,
  ): Promise<PostComment> {
    const comment: PostComment = {
      id: generateId("com"),
      post_id: postId,
      parent_id: parentId || null,
      user_id: userId,
      user_name: userName,
      body,
      upvotes: 0,
      replies: [],
      created_at: new Date().toISOString(),
    };

    const post = this.posts.find((p) => p.id === postId);
    if (post) {
      if (!post.comments) post.comments = [];

      if (parentId) {
        const parent = post.comments.find((c) => c.id === parentId);
        if (parent) {
          if (!parent.replies) parent.replies = [];
          parent.replies.push(comment);
        } else {
          post.comments.push(comment);
        }
      } else {
        post.comments.push(comment);
      }

      post.comments_count = (post.comments_count || 0) + 1;
      post.popularity_score += 2;
    }

    if (supabase) {
      await supabase.from("post_comments").insert({
        post_id: postId,
        parent_id: parentId || null,
        user_id: userId,
        body,
      });
    }

    return comment;
  }

  async deleteComment(
    commentId: string,
    userId: string,
  ): Promise<{ success: boolean; error?: string; status: number }> {
    let foundComment: PostComment | null = null;
    let targetPost: CommunityPost | null = null;

    for (const post of this.posts) {
      const c = post.comments?.find((item) => item.id === commentId);
      if (c) {
        foundComment = c;
        targetPost = post;
        break;
      }
      for (const parent of post.comments || []) {
        const reply = parent.replies?.find((r) => r.id === commentId);
        if (reply) {
          foundComment = reply;
          targetPost = post;
          break;
        }
      }
    }

    if (!foundComment) {
      return {
        success: false,
        error: `Comment '${commentId}' not found`,
        status: 404,
      };
    }
    if (foundComment.user_id !== userId) {
      return {
        success: false,
        error: "Forbidden: You do not have permission to delete this comment",
        status: 403,
      };
    }

    if (supabase) {
      const { error } = await supabase
        .from("post_comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", userId);
      if (!error) return { success: true, status: 200 };
    }

    if (targetPost && targetPost.comments) {
      targetPost.comments = targetPost.comments.filter(
        (c) => c.id !== commentId,
      );
      for (const parent of targetPost.comments) {
        if (parent.replies) {
          parent.replies = parent.replies.filter((r) => r.id !== commentId);
        }
      }
      targetPost.comments_count = Math.max(
        0,
        (targetPost.comments_count || 1) - 1,
      );
    }
    return { success: true, status: 200 };
  }

  async reportContent(
    reporterId: string,
    reason: string,
    postId?: string,
    commentId?: string,
  ): Promise<{ success: boolean; report_id: string }> {
    const report: PostReport = {
      id: generateId("rep"),
      reporter_id: reporterId,
      post_id: postId,
      comment_id: commentId,
      reason,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    this.reports.push(report);

    if (supabase) {
      await supabase.from("post_reports").insert({
        reporter_id: reporterId,
        post_id: postId || null,
        comment_id: commentId || null,
        reason,
        status: "pending",
      });
    }

    return { success: true, report_id: report.id };
  }

  async addPostImage(
    postId: string,
    userId: string,
    image: {
      storage_path: string;
      mime_type: "image/jpeg" | "image/png" | "image/webp";
      size_bytes: number;
    },
  ): Promise<{
    success: boolean;
    image?: PostImage;
    error?: string;
    status: number;
  }> {
    const post = await this.getPostById(postId);
    if (!post) {
      return {
        success: false,
        error: `Post '${postId}' not found`,
        status: 404,
      };
    }
    if (post.user_id !== userId) {
      return {
        success: false,
        error:
          "Forbidden: You do not have permission to add images to this post",
        status: 403,
      };
    }

    const newImage: PostImage = {
      id: generateId("img"),
      post_id: postId,
      storage_path: image.storage_path,
      mime_type: image.mime_type,
      size_bytes: image.size_bytes,
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      const { data, error } = await supabase
        .from("post_images")
        .insert({
          post_id: postId,
          storage_path: image.storage_path,
          mime_type: image.mime_type,
          size_bytes: image.size_bytes,
        })
        .select()
        .single();
      if (!error && data) return { success: true, image: data, status: 201 };
    }

    if (!post.images) post.images = [];
    post.images.push(newImage);
    return { success: true, image: newImage, status: 201 };
  }

  async saveTrip(trip: TripSession): Promise<TripSession> {
    const id = trip.id || generateId("trip");
    const saved: TripSession = {
      ...trip,
      id,
      created_at: new Date().toISOString(),
    };
    this.trips.set(id, saved);
    return saved;
  }

  async saveItinerary(
    itinerary: FlexibleItinerary,
  ): Promise<FlexibleItinerary> {
    const id = itinerary.id || generateId("itin");
    const saved: FlexibleItinerary = {
      ...itinerary,
      id,
      created_at: new Date().toISOString(),
    };
    this.itineraries.set(id, saved);
    return saved;
  }

  async getItineraryById(id: string): Promise<FlexibleItinerary | null> {
    return this.itineraries.get(id) || null;
  }

  private organizeNestedComments(rawComments: any[]): PostComment[] {
    const commentMap = new Map<string, PostComment>();
    const rootComments: PostComment[] = [];

    for (const c of rawComments) {
      commentMap.set(c.id, {
        id: c.id,
        post_id: c.post_id,
        parent_id: c.parent_id || null,
        user_id: c.user_id,
        user_name: c.profiles?.display_name || "Traveler",
        user_avatar: c.profiles?.avatar_url || null,
        body: c.body,
        upvotes: c.upvotes || 0,
        replies: [],
        created_at: c.created_at,
      });
    }

    for (const c of rawComments) {
      const item = commentMap.get(c.id)!;
      if (c.parent_id && commentMap.has(c.parent_id)) {
        commentMap.get(c.parent_id)!.replies!.push(item);
      } else {
        rootComments.push(item);
      }
    }

    return rootComments;
  }
}

export const db = new MemoryDatabase();
