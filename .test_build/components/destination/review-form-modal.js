"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.ReviewFormModal = ReviewFormModal;
var React = _interopRequireWildcard(require("react"));
var _modal = require("@/components/ui/modal");
var _button = require("@/components/ui/button");
var _authContext = require("@/lib/auth/auth-context");
function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}
function ReviewFormModal({
  isOpen,
  onClose,
  destinationId,
  destinationName,
  onReviewSubmitted,
}) {
  const { user } = (0, _authContext.useAuth)();
  const [overallScore, setOverallScore] = React.useState(5);
  const [categoryScores, setCategoryScores] = React.useState({
    cleanliness: 5,
    safety: 5,
    accessibility: 4,
    scenery: 5,
    family_friendly: 5,
    value_for_money: 5,
  });
  const [body, setBody] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);
  const categories = [
    {
      key: "cleanliness",
      label: "Cleanliness",
    },
    {
      key: "safety",
      label: "Safety",
    },
    {
      key: "accessibility",
      label: "Road Accessibility",
    },
    {
      key: "scenery",
      label: "Scenery",
    },
    {
      key: "family_friendly",
      label: "Family Friendly",
    },
    {
      key: "value_for_money",
      label: "Value for Money",
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/destinations/${destinationId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return /*#__PURE__*/ React.createElement(
    _modal.Modal,
    {
      isOpen: isOpen,
      onClose: onClose,
      title: `Rate & Review ${destinationName}`,
      description:
        "Share your practical experience to guide other road travelers.",
      maxWidth: "lg",
    },
    /*#__PURE__*/ React.createElement(
      "form",
      {
        onSubmit: handleSubmit,
        className: "space-y-4",
      },
      error &&
        /*#__PURE__*/ React.createElement(
          "p",
          {
            className:
              "text-xs text-emerald-600 bg-emerald-50 p-2.5 rounded-lg",
          },
          error,
        ),
      /*#__PURE__*/ React.createElement(
        "div",
        null,
        /*#__PURE__*/ React.createElement(
          "label",
          {
            className: "text-xs font-bold text-slate-700 block mb-1",
          },
          "Overall Experience Rating (1 to 5 Stars)",
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "flex items-center gap-2",
          },
          [1, 2, 3, 4, 5].map((star) =>
            /*#__PURE__*/ React.createElement(
              "button",
              {
                key: star,
                type: "button",
                onClick: () => setOverallScore(star),
                className: `text-2xl transition-transform hover:scale-110 ${star <= overallScore ? "text-emerald-500" : "text-slate-300"}`,
              },
              "\u2605",
            ),
          ),
          /*#__PURE__*/ React.createElement(
            "span",
            {
              className: "text-xs font-bold text-slate-700 ml-2",
            },
            overallScore,
            " / 5",
          ),
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        null,
        /*#__PURE__*/ React.createElement(
          "label",
          {
            className: "text-xs font-bold text-slate-700 block mb-2",
          },
          "Category Breakdown Ratings",
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className:
              "grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200",
          },
          categories.map((c) =>
            /*#__PURE__*/ React.createElement(
              "div",
              {
                key: c.key,
                className: "flex items-center justify-between text-xs",
              },
              /*#__PURE__*/ React.createElement(
                "span",
                {
                  className: "text-slate-700 font-medium",
                },
                c.label,
              ),
              /*#__PURE__*/ React.createElement(
                "select",
                {
                  value: categoryScores[c.key],
                  onChange: (e) =>
                    setCategoryScores({
                      ...categoryScores,
                      [c.key]: Number(e.target.value),
                    }),
                  className:
                    "rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-bold focus:ring-1 focus:ring-emerald-500",
                },
                /*#__PURE__*/ React.createElement(
                  "option",
                  {
                    value: 5,
                  },
                  "5 - Excellent",
                ),
                /*#__PURE__*/ React.createElement(
                  "option",
                  {
                    value: 4,
                  },
                  "4 - Good",
                ),
                /*#__PURE__*/ React.createElement(
                  "option",
                  {
                    value: 3,
                  },
                  "3 - Average",
                ),
                /*#__PURE__*/ React.createElement(
                  "option",
                  {
                    value: 2,
                  },
                  "2 - Poor",
                ),
                /*#__PURE__*/ React.createElement(
                  "option",
                  {
                    value: 1,
                  },
                  "1 - Terrible",
                ),
              ),
            ),
          ),
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        null,
        /*#__PURE__*/ React.createElement(
          "label",
          {
            className: "text-xs font-bold text-slate-700 block mb-1",
          },
          "Optional Written Review / Road Advice",
        ),
        /*#__PURE__*/ React.createElement("textarea", {
          value: body,
          onChange: (e) => setBody(e.target.value),
          rows: 3,
          placeholder:
            "Describe road conditions, parking, highlights, best hours to visit...",
          className:
            "w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500",
        }),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "pt-2 flex justify-end gap-2",
        },
        /*#__PURE__*/ React.createElement(
          _button.Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: onClose,
          },
          "Cancel",
        ),
        /*#__PURE__*/ React.createElement(
          _button.Button,
          {
            type: "submit",
            variant: "primary",
            size: "sm",
            isLoading: isSubmitting,
          },
          "Submit Review",
        ),
      ),
    ),
  );
}
