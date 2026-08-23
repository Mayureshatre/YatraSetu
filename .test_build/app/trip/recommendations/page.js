"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = RecommendationsPage;
var React = _interopRequireWildcard(require("react"));
var _navigation = require("next/navigation");
var _destinationCard = require("@/components/destination/destination-card");
var _skeleton = require("@/components/ui/skeleton");
var _errorState = require("@/components/ui/error-state");
var _emptyState = require("@/components/ui/empty-state");
var _badge = require("@/components/ui/badge");
var _link = _interopRequireDefault(require("next/link"));
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
function RecommendationsPage() {
  const searchParams = (0, _navigation.useSearchParams)();
  const originLat = parseFloat(searchParams.get("origin_lat") || "23.2599");
  const originLng = parseFloat(searchParams.get("origin_lng") || "77.4126");
  const originLabel =
    searchParams.get("origin_label") || "Bhopal, Madhya Pradesh";
  const vehicleType = searchParams.get("vehicle_type") || "car";
  const durationDays = parseInt(searchParams.get("duration_days") || "1", 10);
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [filterRadius, setFilterRadius] = React.useState("all");
  const fetchRecommendations = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin_lat: originLat,
          origin_lng: originLng,
          origin_label: originLabel,
          vehicle_type: vehicleType,
          duration_days: durationDays,
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(
          json.error?.message || "Failed to generate recommendations",
        );
      }
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [originLat, originLng, originLabel, vehicleType, durationDays]);
  React.useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);
  const filteredRecommendations = React.useMemo(() => {
    if (!data?.recommendations) return [];
    if (filterRadius === "100km") {
      return data.recommendations.filter((r) => r.is_within_preferred_radius);
    }
    if (filterRadius === "extended") {
      return data.recommendations.filter((r) => !r.is_within_preferred_radius);
    }
    return data.recommendations;
  }, [data, filterRadius]);
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className:
          "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200",
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
            "span",
            {
              className:
                "text-xs font-bold uppercase tracking-wider text-emerald-600",
            },
            "Recommendation Results",
          ),
          /*#__PURE__*/ React.createElement(
            _badge.Badge,
            {
              variant: data?.data_freshness === "live" ? "success" : "default",
              className: "text-[10px]",
            },
            data?.data_freshness === "live"
              ? "● Live AI Ranking"
              : "● Verified Deterministic Fallback",
          ),
        ),
        /*#__PURE__*/ React.createElement(
          "h1",
          {
            className:
              "text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1",
          },
          "Top Ranked Destinations from ",
          originLabel.split(",")[0],
        ),
        /*#__PURE__*/ React.createElement(
          "p",
          {
            className:
              "text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-3",
          },
          /*#__PURE__*/ React.createElement(
            "span",
            null,
            "\uD83D\uDE97 Vehicle: ",
            /*#__PURE__*/ React.createElement(
              "strong",
              {
                className: "text-slate-700 capitalize",
              },
              vehicleType,
            ),
          ),
          /*#__PURE__*/ React.createElement("span", null, "\u2022"),
          /*#__PURE__*/ React.createElement(
            "span",
            null,
            "\uD83D\uDDD3\uFE0F Duration: ",
            /*#__PURE__*/ React.createElement(
              "strong",
              {
                className: "text-slate-700",
              },
              durationDays,
              " Day",
              durationDays > 1 ? "s" : "",
            ),
          ),
        ),
      ),
      /*#__PURE__*/ React.createElement(
        _link.default,
        {
          href: "/trip",
        },
        /*#__PURE__*/ React.createElement(
          _button.Button,
          {
            variant: "outline",
            size: "sm",
          },
          "Modify Trip Parameters",
        ),
      ),
    ),
    data &&
      data.recommendations.length > 0 &&
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "flex items-center justify-between gap-3 flex-wrap",
        },
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "flex items-center gap-2",
          },
          /*#__PURE__*/ React.createElement(
            "button",
            {
              onClick: () => setFilterRadius("all"),
              className: `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${filterRadius === "all" ? "bg-emerald-600 text-white shadow-xs" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`,
            },
            "All Ranked (",
            data.recommendations.length,
            ")",
          ),
          /*#__PURE__*/ React.createElement(
            "button",
            {
              onClick: () => setFilterRadius("100km"),
              className: `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${filterRadius === "100km" ? "bg-emerald-600 text-white shadow-xs" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`,
            },
            "Preferred \u2264 100 km (",
            data.recommendations.filter((r) => r.is_within_preferred_radius)
              .length,
            ")",
          ),
          /*#__PURE__*/ React.createElement(
            "button",
            {
              onClick: () => setFilterRadius("extended"),
              className: `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${filterRadius === "extended" ? "bg-emerald-600 text-white shadow-xs" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`,
            },
            "AI-Justified Extended (",
            data.recommendations.filter((r) => !r.is_within_preferred_radius)
              .length,
            ")",
          ),
        ),
        /*#__PURE__*/ React.createElement(
          "span",
          {
            className: "text-xs text-slate-400",
          },
          "Showing ",
          filteredRecommendations.length,
          " of ",
          data.recommendations.length,
          " recommendations",
        ),
      ),
    isLoading &&
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        },
        [1, 2, 3, 4, 5, 6].map((i) =>
          /*#__PURE__*/ React.createElement(
            "div",
            {
              key: i,
              className:
                "rounded-2xl border border-slate-200 bg-white p-4 space-y-4",
            },
            /*#__PURE__*/ React.createElement(_skeleton.Skeleton, {
              className: "h-48 w-full rounded-xl",
            }),
            /*#__PURE__*/ React.createElement(_skeleton.Skeleton, {
              className: "h-5 w-3/4",
            }),
            /*#__PURE__*/ React.createElement(_skeleton.Skeleton, {
              className: "h-16 w-full",
            }),
            /*#__PURE__*/ React.createElement(_skeleton.Skeleton, {
              className: "h-8 w-24",
            }),
          ),
        ),
      ),
    error &&
      !isLoading &&
      /*#__PURE__*/ React.createElement(_errorState.ErrorState, {
        title: "Could not load recommendations",
        message: error,
        onRetry: fetchRecommendations,
      }),
    !isLoading &&
      !error &&
      filteredRecommendations.length === 0 &&
      /*#__PURE__*/ React.createElement(_emptyState.EmptyState, {
        title: "No matching destinations found",
        description:
          "Try broadening your starting hub or extending your trip duration.",
        actionLabel: "Reset Search",
        onAction: () => setFilterRadius("all"),
      }),
    !isLoading &&
      !error &&
      filteredRecommendations.length > 0 &&
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        },
        filteredRecommendations.map((dest) =>
          /*#__PURE__*/ React.createElement(_destinationCard.DestinationCard, {
            key: dest.id,
            destination: dest,
            originLabel: originLabel,
            vehicleType: vehicleType,
          }),
        ),
      ),
  );
}
