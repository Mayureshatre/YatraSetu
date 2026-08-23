"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RatingBreakdown = RatingBreakdown;
var React = _interopRequireWildcard(require("react"));
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
function RatingBreakdown({
  overallScore,
  totalReviews = 0,
  categoryAverages = {},
}) {
  const categories = [
    {
      key: "cleanliness",
      label: "Cleanliness & Hygiene",
      icon: "✨",
    },
    {
      key: "safety",
      label: "Safety & Security",
      icon: "🛡️",
    },
    {
      key: "accessibility",
      label: "Road Accessibility",
      icon: "🛣️",
    },
    {
      key: "scenery",
      label: "Scenic Beauty & Views",
      icon: "🌄",
    },
    {
      key: "family_friendly",
      label: "Family Friendly",
      icon: "👨‍👩‍👧",
    },
    {
      key: "value_for_money",
      label: "Value for Money",
      icon: "💎",
    },
  ];
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-200",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className:
          "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        null,
        /*#__PURE__*/ React.createElement(
          "span",
          {
            className: "text-3xl font-extrabold text-slate-900",
          },
          overallScore.toFixed(1),
        ),
        /*#__PURE__*/ React.createElement(
          "span",
          {
            className: "text-slate-500 text-sm ml-1.5 font-medium",
          },
          "/ 5.0",
        ),
        /*#__PURE__*/ React.createElement(
          "p",
          {
            className: "text-xs text-slate-500 mt-1",
          },
          "Based on ",
          totalReviews,
          " traveler review",
          totalReviews === 1 ? "" : "s",
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "flex items-center gap-1 text-emerald-500 text-xl",
        },
        "★".repeat(Math.round(overallScore)),
        "☆".repeat(5 - Math.round(overallScore)),
      ),
    ),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5",
      },
      categories.map((cat) => {
        const score = categoryAverages[cat.key] || 4.5;
        const percentage = (score / 5) * 100;
        return /*#__PURE__*/ React.createElement(
          "div",
          {
            key: cat.key,
            className: "space-y-1",
          },
          /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "flex items-center justify-between text-xs",
            },
            /*#__PURE__*/ React.createElement(
              "span",
              {
                className:
                  "text-slate-700 font-medium flex items-center gap-1.5",
              },
              /*#__PURE__*/ React.createElement("span", null, cat.icon),
              " ",
              cat.label,
            ),
            /*#__PURE__*/ React.createElement(
              "span",
              {
                className: "font-bold text-slate-900",
              },
              score.toFixed(1),
            ),
          ),
          /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "w-full bg-slate-200 rounded-full h-2 overflow-hidden",
            },
            /*#__PURE__*/ React.createElement("div", {
              className:
                "bg-emerald-600 h-2 rounded-full transition-all duration-500",
              style: {
                width: `${percentage}%`,
              },
            }),
          ),
        );
      }),
    ),
  );
}
