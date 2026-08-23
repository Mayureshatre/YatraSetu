"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CommunityPost } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useAuth } from "@/lib/auth/auth-context";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const postId = params.id as string;

  const [post, setPost] = React.useState<CommunityPost | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [commentText, setCommentText] = React.useState("");
  const [replyingToId, setReplyingToId] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [netVotes, setNetVotes] = React.useState(0);
  const [userVote, setUserVote] = React.useState<1 | -1 | null>(null);
  const [isVoting, setIsVoting] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [reportReason, setReportReason] = React.useState("");
  const [reportSuccess, setReportSuccess] = React.useState(false);

  const loadPost = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = user?.id
        ? `/api/posts/${postId}?user_id=${user.id}`
        : `/api/posts/${postId}`;
      const res = await fetch(url);
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error?.message || "Post not found");
      }
      const json = await res.json();
      setPost(json.data);
      setNetVotes(json.data.net_votes || 0);
      setUserVote(json.data.user_vote || null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [postId, user?.id]);

  React.useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleVote = async (type: 1 | -1) => {
    if (isVoting) return;
    setIsVoting(true);

    const prevVote = userVote;
    const prevNet = netVotes;

    if (prevVote === type) {
      setUserVote(null);
      setNetVotes(prevNet - type);
    } else if (prevVote === null) {
      setUserVote(type);
      setNetVotes(prevNet + type);
    } else {
      setUserVote(type);
      setNetVotes(prevNet + type * 2);
    }

    try {
      const res = await fetch(`/api/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote_type: type, user_id: user?.id }),
      });
      if (res.ok) {
        const json = await res.json();
        setNetVotes(json.data.net_votes);
        setUserVote(json.data.user_vote);
      }
    } catch {
      setUserVote(prevVote);
      setNetVotes(prevNet);
    } finally {
      setIsVoting(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: commentText.trim(),
          user_id: user?.id || "traveler-user-01",
          user_name: user?.name || "Fellow Traveler",
          user_avatar: user?.avatar_url,
        }),
      });
      if (res.ok) {
        setCommentText("");
        await loadPost();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: replyText.trim(),
          parent_id: parentId,
          user_id: user?.id || "traveler-user-01",
          user_name: user?.name || "Fellow Traveler",
          user_avatar: user?.avatar_url,
        }),
      });
      if (res.ok) {
        setReplyText("");
        setReplyingToId(null);
        await loadPost();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Discussion link copied to clipboard!");
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          reason: reportReason.trim(),
          reporter_id: user?.id,
        }),
      });
      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
        setReportReason("");
      }, 1500);
    } catch {
      alert("Failed to submit report.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <ErrorState
          title="Could not load community post"
          message={
            error || "The requested post was not found or has been removed."
          }
          onRetry={loadPost}
        />
        <div className="mt-4 text-center">
          <Link href="/community">
            <Button variant="outline" size="sm">
              ← Return to Community Feed
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const dateFormatted = new Date(post.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/community"
          className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
        >
          <span>←</span>
          <span>Back to Community Feed</span>
        </Link>

        {post.destination_id && (
          <Link href={`/destinations/${post.destination_id}`}>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors">
              📍 View Destination ({post.destination_name})
            </span>
          </Link>
        )}
      </div>

      {/* Main Post Card with Voting */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-8 shadow-xs flex gap-5 transition-colors">
        {/* Voting Column */}
        <div className="flex flex-col items-center justify-start gap-1.5 shrink-0 pt-1">
          <button
            type="button"
            onClick={() => handleVote(1)}
            title="Upvote"
            aria-label="Upvote post"
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base transition-colors ${
              userVote === 1
                ? "bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-800 shadow-xs"
                : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-600"
            }`}
          >
            ▲
          </button>

          <span
            className={`text-sm font-black select-none ${
              userVote === 1
                ? "text-orange-600 dark:text-orange-400"
                : userVote === -1
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-800 dark:text-slate-200"
            }`}
          >
            {netVotes}
          </span>

          <button
            type="button"
            onClick={() => handleVote(-1)}
            title="Downvote"
            aria-label="Downvote post"
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base transition-colors ${
              userVote === -1
                ? "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-800 shadow-xs"
                : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600"
            }`}
          >
            ▼
          </button>
        </div>

        {/* Post Content */}
        <div className="flex-1 space-y-5 min-w-0">
          {/* Author Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60 gap-2 flex-wrap">
            <div className="flex items-center gap-3.5">
              <Avatar
                src={post.user_avatar}
                name={post.user_name || "Traveler"}
                size="md"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {post.user_name || "Fellow Traveler"}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                  <span>{dateFormatted}</span>
                  {post.destination_name && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        📍 {post.destination_name}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700">
              🏷️ {post.category || "General Discussion"}
            </span>
          </div>

          {/* Title & Body */}
          <div className="space-y-3">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
              {post.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {post.body}
            </p>
          </div>

          {/* Attached Images */}
          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {post.images.map((img) => (
                <div
                  key={img.id}
                  className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 max-h-80 shadow-xs"
                >
                  <img
                    src={img.storage_path}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Action Row */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSaved(!isSaved)}
                className={`font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                  isSaved
                    ? "text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60"
                    : "hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <span>{isSaved ? "🔖" : "📑"}</span>
                <span>{isSaved ? "Saved" : "Save"}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="font-semibold hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors"
              >
                <span>↗</span>
                <span>Share</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="text-[11px] text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
            >
              Report Post
            </button>
          </div>

          {/* Comments Section with Nested Replies */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Community Responses (
              {post.comments?.length || post.comments_count || 0})
            </h3>

            {/* Comment Form */}
            <form
              onSubmit={handleCommentSubmit}
              className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700"
            >
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Add your response / insights
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Contribute road advice, answer questions, or add details..."
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  isLoading={isSubmitting}
                >
                  Post
                </Button>
              </div>
            </form>

            {/* Threaded Comments List */}
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-4">
                {post.comments.map((c) => (
                  <div key={c.id} className="space-y-2">
                    {/* Root Comment */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={c.user_avatar}
                            name={c.user_name || "Traveler"}
                            size="sm"
                          />
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {c.user_name || "Fellow Explorer"}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {new Date(c.created_at).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 pl-7 leading-relaxed">
                        {c.body}
                      </p>

                      <div className="pl-7 pt-1 flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
                        <button
                          type="button"
                          onClick={() =>
                            setReplyingToId(replyingToId === c.id ? null : c.id)
                          }
                          className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                        >
                          Reply
                        </button>
                      </div>
                    </div>

                    {/* Reply Input */}
                    {replyingToId === c.id && (
                      <div className="pl-8 flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${c.user_name}...`}
                          className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500"
                        />
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleReplySubmit(c.id)}
                          isLoading={isSubmitting}
                        >
                          Send Reply
                        </Button>
                      </div>
                    )}

                    {/* Nested Replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="pl-6 space-y-2 border-l-2 border-slate-200 dark:border-slate-700 ml-4">
                        {c.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-1"
                          >
                            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 text-xs">
                              <span>{reply.user_name || "Traveler"}</span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                                {new Date(reply.created_at).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300">
                              {reply.body}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center py-6">
                No replies yet. Be the first to join the conversation!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Report Inappropriate Content
            </h4>
            {reportSuccess ? (
              <p className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 p-3 rounded-lg font-semibold border border-emerald-200 dark:border-emerald-800">
                ✓ Report submitted for review.
              </p>
            ) : (
              <form onSubmit={handleReport} className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Please describe the violation:
                </p>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="e.g. Inappropriate content, inaccurate road data, spam..."
                  className="w-full text-xs p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  required
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowReportModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    variant="primary"
                    className="bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white"
                  >
                    Submit Report
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
