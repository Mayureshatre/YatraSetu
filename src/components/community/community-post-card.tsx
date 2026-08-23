"use client";

import * as React from "react";
import Link from "next/link";
import { CommunityPost } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";

interface CommunityPostCardProps {
  post: CommunityPost;
  onAddComment?: (
    postId: string,
    text: string,
    parentId?: string,
  ) => Promise<void>;
  onVote?: (postId: string, voteType: 1 | -1) => Promise<void>;
}

export function CommunityPostCard({
  post,
  onAddComment,
  onVote,
}: CommunityPostCardProps) {
  const { user } = useAuth();
  const [showComments, setShowComments] = React.useState(false);
  const [commentText, setCommentText] = React.useState("");
  const [replyingToId, setReplyingToId] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [netVotes, setNetVotes] = React.useState(post.net_votes || 0);
  const [userVote, setUserVote] = React.useState<1 | -1 | null>(
    post.user_vote || null,
  );
  const [isVoting, setIsVoting] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [reportReason, setReportReason] = React.useState("");
  const [reportSuccess, setReportSuccess] = React.useState(false);

  React.useEffect(() => {
    setNetVotes(post.net_votes || 0);
    setUserVote(post.user_vote || null);
  }, [post.net_votes, post.user_vote]);

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
      if (onVote) {
        await onVote(post.id, type);
      } else {
        const res = await fetch(`/api/posts/${post.id}/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vote_type: type, user_id: user?.id }),
        });
        if (res.ok) {
          const json = await res.json();
          setNetVotes(json.data.net_votes);
          setUserVote(json.data.user_vote);
        }
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
    if (!commentText.trim() || !onAddComment) return;
    setIsSubmitting(true);
    try {
      await onAddComment(post.id, commentText.trim());
      setCommentText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!replyText.trim() || !onAddComment) return;
    setIsSubmitting(true);
    try {
      await onAddComment(post.id, replyText.trim(), parentId);
      setReplyText("");
      setReplyingToId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/community/${post.id}`,
      );
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
          post_id: post.id,
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
      alert("Failed to submit report. Please try again.");
    }
  };

  const dateFormatted = new Date(post.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 md:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex gap-4">
      {/* Reddit-Style Voting Widget */}
      <div className="flex flex-col items-center justify-start gap-1 shrink-0 pt-0.5">
        <button
          type="button"
          onClick={() => handleVote(1)}
          title="Upvote"
          aria-label="Upvote post"
          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${
            userVote === 1
              ? "bg-orange-100 text-orange-600 border border-orange-300 dark:bg-orange-950/60 dark:text-orange-400 dark:border-orange-800"
              : "bg-slate-100 text-slate-500 hover:bg-orange-50 hover:text-orange-600 dark:bg-slate-700/60 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-orange-400"
          }`}
        >
          ▲
        </button>

        <span
          className={`text-xs font-black select-none ${
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
          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${
            userVote === -1
              ? "bg-indigo-100 text-indigo-600 border border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-800"
              : "bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-700/60 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-indigo-400"
          }`}
        >
          ▼
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-3 min-w-0">
        {/* Header Metadata */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2.5">
            <Avatar
              src={post.user_avatar}
              name={post.user_name || "Traveler"}
              size="sm"
            />
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {post.user_name || "Fellow Explorer"}
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-slate-400 dark:text-slate-500 font-medium">
                {dateFormatted}
              </span>
              {post.destination_name && (
                <>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <Link
                    href={`/destinations/${post.destination_id}`}
                    className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
                  >
                    📍 {post.destination_name}
                  </Link>
                </>
              )}
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 dark:bg-slate-700/60 dark:border-slate-600 dark:text-slate-300 text-[10px] font-bold">
            {post.category || "General"}
          </span>
        </div>

        {/* Title & Body */}
        <div className="space-y-1.5">
          <Link href={`/community/${post.id}`} className="group block">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              {post.title}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3 whitespace-pre-line">
            {post.body}
          </p>
        </div>

        {/* Image Attachment */}
        {post.images && post.images.length > 0 && (
          <Link
            href={`/community/${post.id}`}
            className="block rounded-xl overflow-hidden max-h-72 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shadow-2xs"
          >
            <img
              src={post.images[0].storage_path}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-101 transition-transform duration-200"
            />
          </Link>
        )}

        {/* Action Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowComments(!showComments)}
              className="font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1.5 bg-emerald-50 dark:bg-slate-700/50 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-slate-600 transition-colors"
            >
              <span>💬</span>
              <span>
                {post.comments?.length || post.comments_count || 0} Comments{" "}
                {showComments ? "▲" : "▼"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              className={`font-semibold flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                isSaved
                  ? "text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-slate-700/50"
                  : "hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <span>{isSaved ? "🔖" : "📑"}</span>
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="font-semibold hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 px-2 py-1 rounded-lg transition-colors"
            >
              <span>↗</span>
              <span>Share</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="text-[11px] text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
            >
              Flag / Report
            </button>
            <Link
              href={`/community/${post.id}`}
              className="font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 text-xs flex items-center gap-1 transition-colors"
            >
              <span>Full Thread →</span>
            </Link>
          </div>
        </div>

        {/* Inline Threaded Comments Section */}
        {showComments && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl">
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-3">
                {post.comments.map((c) => (
                  <div key={c.id} className="space-y-2">
                    {/* Root Comment */}
                    <div className="text-xs bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={c.user_avatar}
                            name={c.user_name || "Traveler"}
                            size="sm"
                          />
                          <span>{c.user_name || "Traveler"}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                          {new Date(c.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 pl-7">
                        {c.body}
                      </p>

                      <div className="pl-7 pt-1 flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
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

                    {/* Reply Input Box */}
                    {replyingToId === c.id && (
                      <div className="pl-6 flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${c.user_name}...`}
                          className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500"
                        />
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleReplySubmit(c.id)}
                          isLoading={isSubmitting}
                        >
                          Send
                        </Button>
                      </div>
                    )}

                    {/* Nested Replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="pl-6 space-y-2 border-l-2 border-slate-200 dark:border-slate-700 ml-3">
                        {c.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="text-xs bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1"
                          >
                            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                              <span>{reply.user_name || "Traveler"}</span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                                {new Date(reply.created_at).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300">
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
              <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                No comments yet. Start the conversation!
              </p>
            )}

            {/* Comment Form */}
            {onAddComment && (
              <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share a thoughtful reply or question..."
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  isLoading={isSubmitting}
                >
                  Post Comment
                </Button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Report Inappropriate Content
            </h4>
            {reportSuccess ? (
              <p className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 p-3 rounded-lg font-semibold border border-emerald-200 dark:border-emerald-800">
                ✓ Report submitted for community safety review.
              </p>
            ) : (
              <form onSubmit={handleReport} className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Please specify why this post violates community guidelines:
                </p>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="e.g. Spam, incorrect road information, abusive language..."
                  className="w-full text-xs p-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
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
                    className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white border-0"
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
