"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.DestinationCard = DestinationCard;
var React = _interopRequireWildcard(require("react"));
var _link = _interopRequireDefault(require("next/link"));
var _scoreBadge = require("@/components/ui/score-badge");
var _badge = require("@/components/ui/badge");
var _button = require("@/components/ui/button");
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
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
function DestinationCard({ destination, originLabel, vehicleType }) {
  const isExtended = destination.is_extended_radius;
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className:
        "group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100",
      },
      /*#__PURE__*/ React.createElement("img", {
        src:
          destination.hero_image_url ||
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        alt: destination.name,
        className:
          "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
      }),
      /*#__PURE__*/ React.createElement("div", {
        className:
          "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent",
      }),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className:
            "absolute top-3 left-3 right-3 flex items-center justify-between",
        },
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "flex items-center gap-1.5",
          },
          /*#__PURE__*/ React.createElement(
            "span",
            {
              className:
                "w-6 h-6 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-xs font-black flex items-center justify-center border border-white/20",
            },
            "#",
            destination.rank,
          ),
          /*#__PURE__*/ React.createElement(
            _badge.Badge,
            {
              variant: "default",
              className:
                "bg-white/90 text-slate-900 border-none backdrop-blur-xs font-semibold",
            },
            destination.category,
          ),
        ),
        /*#__PURE__*/ React.createElement(_scoreBadge.ScoreBadge, {
          score: destination.match_score,
          size: "sm",
        }),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "absolute bottom-3 left-3 right-3 text-white",
        },
        /*#__PURE__*/ React.createElement(
          "h3",
          {
            className: "text-lg font-bold leading-tight drop-shadow-sm",
          },
          destination.name,
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className:
              "flex items-center gap-2 text-xs font-medium text-slate-200 mt-1",
          },
          /*#__PURE__*/ React.createElement(
            "span",
            null,
            "\uD83D\uDCCD ",
            destination.distance_km,
            " km",
          ),
          /*#__PURE__*/ React.createElement("span", null, "\u2022"),
          /*#__PURE__*/ React.createElement(
            "span",
            null,
            "\u23F1\uFE0F ",
            destination.duration_formatted,
          ),
          isExtended &&
            /*#__PURE__*/ React.createElement(
              React.Fragment,
              null,
              /*#__PURE__*/ React.createElement("span", null, "\u2022"),
              /*#__PURE__*/ React.createElement(
                "span",
                {
                  className:
                    "text-emerald-300 font-semibold bg-black/40 px-1.5 py-0.5 rounded text-[10px]",
                },
                "Extended Radius",
              ),
            ),
        ),
      ),
    ),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "space-y-2.5",
        },
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className:
              "p-3 bg-emerald-50/80 rounded-xl border border-emerald-100 text-xs text-emerald-900 flex items-start gap-2",
          },
          /*#__PURE__*/ React.createElement(
            "span",
            {
              className: "text-base leading-none",
            },
            "\uD83D\uDCA1",
          ),
          /*#__PURE__*/ React.createElement(
            "div",
            null,
            /*#__PURE__*/ React.createElement(
              "span",
              {
                className: "font-bold text-emerald-950",
              },
              "AI Match Reason: ",
            ),
            /*#__PURE__*/ React.createElement(
              "span",
              {
                className: "leading-relaxed",
              },
              destination.ai_reason,
            ),
            destination.extension_justification &&
              /*#__PURE__*/ React.createElement(
                "p",
                {
                  className:
                    "mt-1 text-[11px] text-emerald-800 font-medium italic",
                },
                "Note: ",
                destination.extension_justification,
              ),
          ),
        ),
        /*#__PURE__*/ React.createElement(
          "p",
          {
            className: "text-xs text-slate-600 line-clamp-2 leading-relaxed",
          },
          destination.description,
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className:
            "pt-2 border-t border-slate-100 flex items-center justify-between gap-2",
        },
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "text-[11px] text-slate-500 font-medium truncate",
          },
          "\uD83D\uDEE3\uFE0F ",
          destination.road_condition
            ? destination.road_condition.split(";")[0]
            : "Paved road",
        ),
        /*#__PURE__*/ React.createElement(
          _link.default,
          {
            href: `/destinations/${destination.id}`,
          },
          /*#__PURE__*/ React.createElement(
            _button.Button,
            {
              size: "sm",
              variant: "primary",
              className: "shrink-0 text-xs",
            },
            "View Details \u2192",
          ),
        ),
      ),
    ),
  );
}
