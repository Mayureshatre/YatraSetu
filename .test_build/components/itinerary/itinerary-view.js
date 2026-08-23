"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.ItineraryView = ItineraryView;
var React = _interopRequireWildcard(require("react"));
var _button = require("@/components/ui/button");
var _badge = require("@/components/ui/badge");
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
function ItineraryView({
  itinerary,
  isLoading = false,
  onRegenerate,
  destinationName,
  durationDays,
}) {
  if (isLoading) {
    return /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "rounded-2xl border border-slate-200 bg-white p-6 space-y-4",
      },
      /*#__PURE__*/ React.createElement("div", {
        className: "h-6 w-48 bg-slate-200 rounded animate-pulse",
      }),
      /*#__PURE__*/ React.createElement("div", {
        className: "h-16 w-full bg-slate-100 rounded-xl animate-pulse",
      }),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "space-y-3 pt-2",
        },
        /*#__PURE__*/ React.createElement("div", {
          className: "h-24 bg-slate-100 rounded-xl animate-pulse",
        }),
        /*#__PURE__*/ React.createElement("div", {
          className: "h-24 bg-slate-100 rounded-xl animate-pulse",
        }),
      ),
    );
  }
  if (!itinerary) {
    return /*#__PURE__*/ React.createElement(
      "div",
      {
        className:
          "rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center space-y-3",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "text-3xl",
        },
        "\uD83D\uDDD3\uFE0F",
      ),
      /*#__PURE__*/ React.createElement(
        "h4",
        {
          className: "text-base font-bold text-slate-900",
        },
        "Custom ",
        durationDays,
        "-Day AI Itinerary",
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          className: "text-xs text-slate-500 max-w-sm mx-auto",
        },
        "Generate an unhurried, flexible day-by-day plan tailored specifically for your trip duration and vehicle choice.",
      ),
      onRegenerate &&
        /*#__PURE__*/ React.createElement(
          _button.Button,
          {
            size: "sm",
            variant: "primary",
            onClick: onRegenerate,
          },
          "Generate Itinerary",
        ),
    );
  }
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className:
        "rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-5",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className:
          "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        null,
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "flex items-center gap-2",
          },
          /*#__PURE__*/ React.createElement(
            "h3",
            {
              className: "text-base font-bold text-slate-900",
            },
            "Flexible ",
            itinerary.duration_days,
            "-Day Itinerary for ",
            destinationName,
          ),
          /*#__PURE__*/ React.createElement(
            _badge.Badge,
            {
              variant: "purple",
              className: "text-[10px]",
            },
            "AI Generated",
          ),
        ),
        /*#__PURE__*/ React.createElement(
          "p",
          {
            className: "text-xs text-slate-500 mt-1",
          },
          itinerary.summary,
        ),
      ),
      onRegenerate &&
        /*#__PURE__*/ React.createElement(
          _button.Button,
          {
            variant: "outline",
            size: "sm",
            onClick: onRegenerate,
            className: "shrink-0 text-xs gap-1.5",
          },
          /*#__PURE__*/ React.createElement("span", null, "\uD83D\uDD04"),
          /*#__PURE__*/ React.createElement("span", null, "Regenerate"),
        ),
    ),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "space-y-4",
      },
      itinerary.items.map((item) =>
        /*#__PURE__*/ React.createElement(
          "div",
          {
            key: item.day_number,
            className:
              "p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-2",
          },
          /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "flex items-center justify-between",
            },
            /*#__PURE__*/ React.createElement(
              "div",
              {
                className: "flex items-center gap-2",
              },
              /*#__PURE__*/ React.createElement(
                "span",
                {
                  className:
                    "px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-xs font-black",
                },
                "DAY ",
                item.day_number,
              ),
              /*#__PURE__*/ React.createElement(
                "h4",
                {
                  className: "text-sm font-bold text-slate-900",
                },
                item.title,
              ),
            ),
            item.timing_suggestion &&
              /*#__PURE__*/ React.createElement(
                "span",
                {
                  className:
                    "text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded",
                },
                "\u23F1\uFE0F ",
                item.timing_suggestion,
              ),
          ),
          /*#__PURE__*/ React.createElement(
            "p",
            {
              className: "text-xs text-slate-700 leading-relaxed",
            },
            item.description,
          ),
          item.activities &&
            item.activities.length > 0 &&
            /*#__PURE__*/ React.createElement(
              "div",
              {
                className: "pt-1 flex flex-wrap gap-1.5",
              },
              item.activities.map((act, i) =>
                /*#__PURE__*/ React.createElement(
                  "span",
                  {
                    key: i,
                    className:
                      "text-[11px] bg-white border border-emerald-200 text-emerald-800 font-medium px-2 py-0.5 rounded-full",
                  },
                  "\u2713 ",
                  act,
                ),
              ),
            ),
        ),
      ),
    ),
  );
}
