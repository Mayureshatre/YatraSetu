-- YatraSetu Migration 2.0 - Community Voting, Nested Comments, Reports, and Image Provenance

-- 1. Add Category and Vote Counters to Community Posts
ALTER TABLE public.community_posts
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'General Discussion',
ADD COLUMN IF NOT EXISTS upvotes_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS downvotes_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS net_votes INTEGER NOT NULL DEFAULT 0;

-- 2. Add Parent ID (for Nested Replies) and Upvotes to Post Comments
ALTER TABLE public.post_comments
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS upvotes INTEGER NOT NULL DEFAULT 0;

-- 3. Add Verified Image Metadata Columns to Destinations Table
ALTER TABLE public.destinations
ADD COLUMN IF NOT EXISTS image_source TEXT,
ADD COLUMN IF NOT EXISTS image_source_url TEXT,
ADD COLUMN IF NOT EXISTS image_alt TEXT,
ADD COLUMN IF NOT EXISTS image_credit TEXT,
ADD COLUMN IF NOT EXISTS image_license TEXT,
ADD COLUMN IF NOT EXISTS image_verified_at TIMESTAMPTZ;

-- 4. Create Post Votes Table
CREATE TABLE IF NOT EXISTS public.post_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- 5. Create Reports Table (Moderation & Safety)
CREATE TABLE IF NOT EXISTS public.post_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_post_votes_post_id ON public.post_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_votes_user_id ON public.post_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_id ON public.post_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON public.community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_net_votes ON public.community_posts(net_votes DESC);

-- 7. Enable RLS on New Tables
ALTER TABLE public.post_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reports ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies for Post Votes
CREATE POLICY "Post votes are viewable by everyone" ON public.post_votes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create their own votes" ON public.post_votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" ON public.post_votes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON public.post_votes
    FOR DELETE USING (auth.uid() = user_id);

-- 9. RLS Policies for Reports
CREATE POLICY "Authenticated users can submit reports" ON public.post_reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" ON public.post_reports
    FOR SELECT USING (auth.uid() = reporter_id);

-- 10. Vote Calculation Trigger Function
CREATE OR REPLACE FUNCTION public.recalculate_post_votes()
RETURNS TRIGGER AS $$
DECLARE
    target_post_id UUID;
    up_count INTEGER;
    down_count INTEGER;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        target_post_id := OLD.post_id;
    ELSE
        target_post_id := NEW.post_id;
    END IF;

    SELECT 
        COALESCE(SUM(CASE WHEN vote_type = 1 THEN 1 ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN vote_type = -1 THEN 1 ELSE 0 END), 0)
    INTO up_count, down_count
    FROM public.post_votes
    WHERE post_id = target_post_id;

    UPDATE public.community_posts
    SET 
        upvotes_count = up_count,
        downvotes_count = down_count,
        net_votes = (up_count - down_count),
        popularity_score = (up_count - down_count) + (comments_count * 2)
    WHERE id = target_post_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_recalculate_post_votes ON public.post_votes;
CREATE TRIGGER trigger_recalculate_post_votes
    AFTER INSERT OR UPDATE OR DELETE ON public.post_votes
    FOR EACH ROW EXECUTE FUNCTION public.recalculate_post_votes();
