-- YatraSetu Database Schema Migration (PostgreSQL / Supabase)
-- Version 1.0 - SIH MVP Production Baseline

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Destinations Table (Canonical tourism metadata)
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
    longitude DOUBLE PRECISION NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
    category TEXT NOT NULL,
    region TEXT NOT NULL,
    hero_image_url TEXT,
    road_condition TEXT DEFAULT 'Good paved roads with standard highway connectivity',
    safety_tips JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Destination Sources (Provider freshness & provenance metadata)
CREATE TABLE IF NOT EXISTS public.destination_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL,
    source_id TEXT,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    raw_reference JSONB DEFAULT '{}'::jsonb
);

-- 4. Trips Table (Planning sessions)
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    origin_lat DOUBLE PRECISION NOT NULL CHECK (origin_lat >= -90 AND origin_lat <= 90),
    origin_lng DOUBLE PRECISION NOT NULL CHECK (origin_lng >= -180 AND origin_lng <= 180),
    origin_label TEXT NOT NULL,
    vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('car', 'bike', 'suv', 'bus')),
    duration_days INTEGER NOT NULL CHECK (duration_days > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Trip Destinations (Ranked recommendations snapshot)
CREATE TABLE IF NOT EXISTS public.trip_destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL CHECK (rank >= 1),
    match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
    ai_reason TEXT NOT NULL,
    distance_m INTEGER NOT NULL CHECK (distance_m >= 0),
    duration_s INTEGER NOT NULL CHECK (duration_s >= 0),
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Itineraries (AI-generated flexible plans)
CREATE TABLE IF NOT EXISTS public.itineraries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    generated_by TEXT NOT NULL DEFAULT 'ai',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Itinerary Items (Day-by-day plan items)
CREATE TABLE IF NOT EXISTS public.itinerary_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL CHECK (day_number > 0),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
    sequence INTEGER NOT NULL DEFAULT 1
);

-- 8. Reviews (Detailed category ratings + optional review)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    overall_score NUMERIC(3,1) NOT NULL CHECK (overall_score >= 1.0 AND overall_score <= 5.0),
    category_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
    body TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Community Posts (Popular-first posts)
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    popularity_score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Post Comments
CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Post Images
CREATE TABLE IF NOT EXISTS public.post_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    mime_type TEXT NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp')),
    size_bytes INTEGER NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 5242880),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_destinations_location ON public.destinations (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON public.destinations (slug);
CREATE INDEX IF NOT EXISTS idx_destinations_region ON public.destinations (region);
CREATE INDEX IF NOT EXISTS idx_reviews_destination ON public.reviews (destination_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews (user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_dest_pop ON public.community_posts (destination_id, popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_post_comments_post ON public.post_comments (post_id);
CREATE INDEX IF NOT EXISTS idx_trips_user ON public.trips (user_id);
CREATE INDEX IF NOT EXISTS idx_trip_destinations_trip ON public.trip_destinations (trip_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_trip ON public.itineraries (trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_itinerary ON public.itinerary_items (itinerary_id, day_number, sequence);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_images ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Destinations (Public Read, Admin Write)
CREATE POLICY "Destinations are viewable by everyone" ON public.destinations
    FOR SELECT USING (true);

-- Destination Sources (Public Read)
CREATE POLICY "Destination sources are viewable by everyone" ON public.destination_sources
    FOR SELECT USING (true);

-- Trips (Owner Only)
CREATE POLICY "Users can view their own trips" ON public.trips
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own trips" ON public.trips
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own trips" ON public.trips
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own trips" ON public.trips
    FOR DELETE USING (auth.uid() = user_id);

-- Trip Destinations (Owner Only via Trip)
CREATE POLICY "Users can view recommendations of their trips" ON public.trip_destinations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = trip_destinations.trip_id AND trips.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert recommendations into their trips" ON public.trip_destinations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = trip_destinations.trip_id AND trips.user_id = auth.uid()
        )
    );

-- Itineraries (Owner Only via Trip)
CREATE POLICY "Users can view their itineraries" ON public.itineraries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = itineraries.trip_id AND trips.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can create itineraries for their trips" ON public.itineraries
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = itineraries.trip_id AND trips.user_id = auth.uid()
        )
    );

-- Itinerary Items (Owner Only via Itinerary/Trip)
CREATE POLICY "Users can view their itinerary items" ON public.itinerary_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.itineraries
            JOIN public.trips ON trips.id = itineraries.trip_id
            WHERE itineraries.id = itinerary_items.itinerary_id AND trips.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert itinerary items for their trips" ON public.itinerary_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.itineraries
            JOIN public.trips ON trips.id = itineraries.trip_id
            WHERE itineraries.id = itinerary_items.itinerary_id AND trips.user_id = auth.uid()
        )
    );

-- Reviews (Public Read, Owner Write/Update/Delete)
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
    FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON public.reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Community Posts (Public Read, Owner Write/Update/Delete)
CREATE POLICY "Community posts are viewable by everyone" ON public.community_posts
    FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.community_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.community_posts
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.community_posts
    FOR DELETE USING (auth.uid() = user_id);

-- Post Comments (Public Read, Owner Write/Delete)
CREATE POLICY "Post comments are viewable by everyone" ON public.post_comments
    FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.post_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.post_comments
    FOR DELETE USING (auth.uid() = user_id);

-- Post Images (Public Read, Post Owner Write)
CREATE POLICY "Post images are viewable by everyone" ON public.post_images
    FOR SELECT USING (true);
CREATE POLICY "Post owners can upload post images" ON public.post_images
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.community_posts
            WHERE community_posts.id = post_images.post_id AND community_posts.user_id = auth.uid()
        )
    );

-- Profile Sync Trigger from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Traveler'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL)
    )
    ON CONFLICT (id) DO UPDATE
    SET
        display_name = EXCLUDED.display_name,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
