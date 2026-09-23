"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { RatingCategories } from "@/types";
import { useAuth } from "@/lib/auth/auth-context";
import { Star } from "lucide-react";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationId: string;
  destinationName: string;
  reviews?: Array<{
    id: string;
    user_id: string;
    overall_score: number;
    category_scores: RatingCategories;
    body?: string | null;
  }>;
  onReviewSubmitted: () => Promise<void> | void;
}

export function ReviewFormModal({
  isOpen,
  onClose,
  destinationId,
  destinationName,
  reviews = [],
  onReviewSubmitted,
}: ReviewFormModalProps) {
  const { user } = useAuth();

  // States
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [existingReviewId, setExistingReviewId] = React.useState<string | null>(
    null,
  );
  const [overallScore, setOverallScore] = React.useState<number>(0);
  const [hoverOverall, setHoverOverall] = React.useState<number>(0);
  const [categoryScores, setCategoryScores] = React.useState<RatingCategories>({
    cleanliness: 5,
    safety: 5,
    accessibility: 5,
    scenery: 5,
    family_friendly: 5,
    value_for_money: 5,
  });
  const [body, setBody] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen || !user) {
      return;
    }

    const myReview = reviews.find((r) => r.user_id === user.id);

    if (myReview) {
      setIsEditing(true);
      setExistingReviewId(myReview.id);
      setOverallScore(myReview.overall_score);
      setCategoryScores(
        myReview.category_scores || {
          cleanliness: 5,
          safety: 5,
          accessibility: 5,
          scenery: 5,
          family_friendly: 5,
          value_for_money: 5,
        },
      );
      setBody(myReview.body || "");
    } else {
      setIsEditing(false);
      setExistingReviewId(null);
      setOverallScore(0);
      setCategoryScores({
        cleanliness: 5,
        safety: 5,
        accessibility: 5,
        scenery: 5,
        family_friendly: 5,
        value_for_money: 5,
      });
      setBody("");
    }
  }, [isOpen, user, reviews]);

  const categories: Array<{ key: keyof RatingCategories; label: string }> = [
    { key: "cleanliness", label: "Cleanliness" },
    { key: "safety", label: "Safety" },
    { key: "accessibility", label: "Road Accessibility" },
    { key: "scenery", label: "Scenery" },
    { key: "family_friendly", label: "Family Friendly" },
    { key: "value_for_money", label: "Value for Money" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (overallScore === 0) {
      setError("Please select an overall rating before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const method = isEditing ? "PATCH" : "POST";
      const endpoint = `/api/destinations/${destinationId}/reviews`;

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id || "traveler-anon",
          user_name: user?.name || "Explorer",
          user_avatar: user?.avatar_url,
          overall_score: overallScore,
          category_scores: categoryScores,
          body: body.trim() || undefined,
          ...(existingReviewId && { id: existingReviewId }),
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(
          json.error?.message || json.message || "Failed to save review",
        );
      }

      if (onReviewSubmitted) {
        await onReviewSubmitted();
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Review ${destinationName}`}
      description="Help fellow travelers by sharing your honest experience."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-6">
        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* 1. Overall Rating (Hero Section) */}
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-slate-50 py-6 dark:bg-slate-900/50">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Overall Experience
          </span>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setOverallScore(star)}
                onMouseEnter={() => setHoverOverall(star)}
                onMouseLeave={() => setHoverOverall(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  size={36}
                  className={`${
                    star <= (hoverOverall || overallScore)
                      ? "fill-emerald-400 text-emerald-400"
                      : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                  } transition-colors duration-200`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* 2. Category Breakdown */}
        <div>
          <h4 className="mb-3 text-sm font-bold text-slate-900 dark:text-slate-100">
            Rate specific aspects
          </h4>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {categories.map((c) => (
              <div
                key={c.key}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {c.label}
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setCategoryScores({ ...categoryScores, [c.key]: star })
                      }
                      className="p-0.5 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        size={14}
                        className={
                          star <= categoryScores[c.key]
                            ? "fill-emerald-500 text-emerald-500"
                            : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Written Review */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Tell us more (Optional)
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="How were the road conditions? Any hidden spots nearby?"
            className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-400"
          />
        </div>

        {/* 4. Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-full px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="rounded-full bg-emerald-600 px-8 hover:bg-emerald-700 text-white"
          >
            {isEditing ? "Update Review" : "Submit Review"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
