"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { RatingCategories } from "@/types";
import { useAuth } from "@/lib/auth/auth-context";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationId: string;
  destinationName: string;
  onReviewSubmitted: () => void;
}

export function ReviewFormModal({
  isOpen,
  onClose,
  destinationId,
  destinationName,
  onReviewSubmitted,
}: ReviewFormModalProps) {
  const { user } = useAuth();
  const [overallScore, setOverallScore] = React.useState<number>(5);
  const [categoryScores, setCategoryScores] = React.useState<RatingCategories>({
    cleanliness: 5,
    safety: 5,
    accessibility: 4,
    scenery: 5,
    family_friendly: 5,
    value_for_money: 5,
  });
  const [body, setBody] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/destinations/${destinationId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          overall_score: overallScore,
          category_scores: categoryScores,
          body: body.trim() || undefined,
          user_id: user?.id || "traveler-anon",
          user_name: user?.name || "Explorer",
          user_avatar: user?.avatar_url,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error?.message || "Failed to submit review");
      }

      onReviewSubmitted();
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
      title={`Rate & Review ${destinationName}`}
      description="Share your practical experience to guide other road travelers."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
            {error}
          </p>
        )}

        {/* Overall Rating */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Overall Experience Rating (1 to 5 Stars)
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setOverallScore(star)}
                className={`text-2xl transition-transform hover:scale-110 ${
                  star <= overallScore
                    ? "text-emerald-500"
                    : "text-slate-300 dark:text-slate-600"
                }`}
              >
                ★
              </button>
            ))}
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
              {overallScore} / 5
            </span>
          </div>
        </div>

        {/* Multi-Category Ratings */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            Category Breakdown Ratings
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
            {categories.map((c) => (
              <div
                key={c.key}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {c.label}
                </span>
                <select
                  value={categoryScores[c.key]}
                  onChange={(e) =>
                    setCategoryScores({
                      ...categoryScores,
                      [c.key]: Number(e.target.value),
                    })
                  }
                  className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 py-1 text-xs font-bold focus:ring-1 focus:ring-emerald-500"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Terrible</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Written Review */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Optional Written Review / Road Advice
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Describe road conditions, parking, highlights, best hours to visit..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
          >
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
}
