"use client";

import * as React from "react";
import { CommunityPost, Destination, POST_CATEGORIES } from "@/types";
import { CommunityPostCard } from "@/components/community/community-post-card";
import { CreatePostModal } from "@/components/community/create-post-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useAuth } from "@/lib/auth/auth-context";
import { SubmitDestinationModal } from "@/components/community/submit-destination-modal";

export default function CommunityFeedPage() {
  const { user, signInWithGoogle } = useAuth();
  const [posts, setPosts] = React.useState<CommunityPost[]>([]);
  const [destinations, setDestinations] = React.useState<Destination[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [selectedDestination, setSelectedDestination] =
    React.useState<string>("All");
  const [sortBy, setSortBy] = React.useState<
    "popular" | "latest" | "most_discussed" | "for_you"
  >("popular");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = React.useState(false);

  const loadDestinations = React.useCallback(async () => {
    try {
      const res = await fetch("/api/destinations");
      if (res.ok) {
        const json = await res.json();
        setDestinations(json.data || []);
      }
    } catch {}
  }, []);

  const loadFeed = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        sort_by: sortBy,
      });
      if (selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }
      if (selectedDestination !== "All") {
        params.append("destination_id", selectedDestination);
      }
      if (user?.id) {
        params.append("user_id", user.id);
      }

      const res = await fetch(`/api/community?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load community discussions");
      }

      const json = await res.json();
      setPosts(json.data.posts || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, selectedCategory, selectedDestination, user?.id]);

  React.useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  React.useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handleAddComment = async (
    postId: string,
    text: string,
    parentId?: string,
  ) => {
    await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: text,
        parent_id: parentId,
        user_id: user?.id || "traveler-user-01",
        user_name: user?.name || "Explorer",
        user_avatar: user?.avatar_url,
      }),
    });
    loadFeed();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header (Clean & Uncluttered) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Traveler Network
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            Community Discussions & Route Intel
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore authentic traveler advice, road warnings, and photography
            from fellow explorers.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            if (!user) {
              signInWithGoogle();
              return;
            }
            setShowCreateModal(true);
          }}
          className="gap-1.5 shrink-0 shadow-sm font-bold"
        >
          <span>+</span>
          <span>{user ? "Start a Discussion" : "Sign-In to post"}</span>
        </Button>
      </div>

      {/* Interactive Contribution Card */}
      <div
        onClick={() => {
          if (!user) {
            signInWithGoogle();
            return;
          }
          setIsSubmitModalOpen(true);
        }}
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/50"
      >
        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <span>✨</span>
              <span>Crowdsource Intelligence</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
              Discovered a hidden gem in Madhya Pradesh?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Contribute its exact coordinates, road conditions, and safety tips
              directly to the YatraSetu database.
            </p>
          </div>

          <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shrink-0">
            <span className="text-xl font-bold">＋</span>
          </div>
        </div>
      </div>

      {/* Feed Filter & Sort Controls */}
      <div className="space-y-3">
        {/* Sort Tabs */}
        <div className="flex items-center justify-between gap-2 flex-wrap pb-1">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            {[
              {
                key: "popular",
                label: "🔥 Popular",
                desc: "Highest Net Upvotes",
              },
              { key: "latest", label: "🕒 Latest", desc: "Newest Discussions" },
              {
                key: "most_discussed",
                label: "💬 Most Discussed",
                desc: "Active Comment Threads",
              },
              { key: "for_you", label: "✨ For You", desc: "Curated Mix" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSortBy(tab.key as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortBy === tab.key
                    ? "bg-white dark:bg-slate-700 text-emerald-900 dark:text-emerald-200 shadow-xs border border-slate-200 dark:border-slate-600"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Destination Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Filter by Spot:
            </span>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Madhya Pradesh Destinations</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === "All"
                ? "bg-emerald-600 dark:bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All Topics
          </button>
          {POST_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-600 dark:bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <ErrorState
          title="Could not load discussions"
          message={error}
          onRetry={loadFeed}
        />
      )}

      {/* Posts List */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-8 space-y-3">
              <span className="text-3xl block">💬</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                No discussions matching this filter yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Be the first traveler to post about road conditions, travel
                tips, or ask a question in this topic!
              </p>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  if (!user) {
                    signInWithGoogle();
                    return;
                  }
                  setShowCreateModal(true);
                }}
              >
                {user ? "+ Create Discussion" : "Sign-In to post"}
              </Button>
            </div>
          ) : (
            posts.map((post) => (
              <CommunityPostCard
                key={post.id}
                post={post}
                onAddComment={handleAddComment}
              />
            ))
          )}
        </div>
      )}

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        destinations={destinations}
        onPostCreated={loadFeed}
      />

      <SubmitDestinationModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
}
