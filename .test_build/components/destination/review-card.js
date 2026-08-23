"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.ReviewCard = ReviewCard;
var React = _interopRequireWildcard(require("react"));
var _avatar = require("@/components/ui/avatar");
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
function ReviewCard({ review }) {
  const dateFormatted = new Date(review.created_at).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "p-4 rounded-xl border border-slate-200 bg-white space-y-3",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "flex items-center justify-between",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "flex items-center gap-2.5",
        },
        /*#__PURE__*/ React.createElement(_avatar.Avatar, {
          src: review.user_avatar,
          name: review.user_name || "Traveler",
          size: "sm",
        }),
        /*#__PURE__*/ React.createElement(
          "div",
          null,
          /*#__PURE__*/ React.createElement(
            "h4",
            {
              className: "text-xs font-bold text-slate-900",
            },
            review.user_name || "Verified Traveler",
          ),
          /*#__PURE__*/ React.createElement(
            "span",
            {
              className: "text-[10px] text-slate-400",
            },
            dateFormatted,
          ),
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className:
            "flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold",
        },
        /*#__PURE__*/ React.createElement("span", null, "\u2605"),
        /*#__PURE__*/ React.createElement(
          "span",
          null,
          review.overall_score.toFixed(1),
        ),
      ),
    ),
    review.body &&
      /*#__PURE__*/ React.createElement(
        "p",
        {
          className: "text-xs text-slate-700 leading-relaxed",
        },
        review.body,
      ),
    review.category_scores &&
      Object.keys(review.category_scores).length > 0 &&
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "flex flex-wrap gap-1.5 pt-1",
        },
        Object.entries(review.category_scores).map(([k, v]) =>
          /*#__PURE__*/ React.createElement(
            "span",
            {
              key: k,
              className:
                "text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full capitalize",
            },
            k.replace("_", " "),
            ": ",
            /*#__PURE__*/ React.createElement(
              "strong",
              {
                className: "text-slate-800",
              },
              v,
              "/5",
            ),
          ),
        ),
      ),
  );
}
