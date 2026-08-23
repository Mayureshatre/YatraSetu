"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = DestinationDetailPage;
var React = _interopRequireWildcard(require("react"));
var _navigation = require("next/navigation");
var _mapPanel = require("@/components/map/map-panel");
var _serviceList = require("@/components/destination/service-list");
var _safetyCard = require("@/components/destination/safety-card");
var _ratingBreakdown = require("@/components/ui/rating-breakdown");
var _reviewCard = require("@/components/destination/review-card");
var _reviewFormModal = require("@/components/destination/review-form-modal");
var _communityPostCard = require("@/components/community/community-post-card");
var _createPostModal = require("@/components/community/create-post-modal");
var _itineraryView = require("@/components/itinerary/itinerary-view");
var _busBookingCard = require("@/components/booking/bus-booking-card");
var _button = require("@/components/ui/button");
var _skeleton = require("@/components/ui/skeleton");
var _errorState = require("@/components/ui/error-state");
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
function DestinationDetailPage() {
  const params = (0, _navigation.useParams)();
  const router = (0, _navigation.useRouter)();
  const { userLocation } = (0, _authContext.useAuth)();
  const destinationId = params.id;
  const [destination, setDestination] = React.useState(null);
  const [services, setServices] = React.useState(null);
  const [communityData, setCommunityData] = React.useState(null);
  const [itinerary, setItinerary] = React.useState(null);
  const [busRedirect, setBusRedirect] = React.useState(null);
  const [routeInfo, setRouteInfo] = React.useState({
    distance_km: 46,
    duration_formatted: "55 mins",
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [isItinLoading, setIsItinLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [showReviewModal, setShowReviewModal] = React.useState(false);
  const [showPostModal, setShowPostModal] = React.useState(false);
  const origin = userLocation || _authContext.DEFAULT_LOCATION;
  const loadAllData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch Destination Details
      const destRes = await fetch(`/api/destinations/${destinationId}`);
      if (!destRes.ok) throw new Error("Destination not found");
      const destJson = await destRes.json();
      const dest = destJson.data;
      setDestination(dest);

      // 2. Parallel Fetch: Services, Community, Route, Bus Redirect
      const [srvRes, commRes, routeRes, busRes] = await Promise.allSettled([
        fetch(`/api/destinations/${dest.id}/services`),
        fetch(`/api/destinations/${dest.id}/community`),
        fetch(
          `/api/routes?origin_lat=${origin.latitude}&origin_lng=${origin.longitude}&dest_lat=${dest.latitude}&dest_lng=${dest.longitude}&vehicle_type=car`,
        ),
        fetch(
          `/api/booking/bus?origin_city=${encodeURIComponent(origin.label.split(",")[0])}&destination_city=${encodeURIComponent(dest.name.split(" ")[0])}`,
        ),
      ]);
      if (srvRes.status === "fulfilled" && srvRes.value.ok) {
        const json = await srvRes.value.json();
        setServices(json.data);
      }
      if (commRes.status === "fulfilled" && commRes.value.ok) {
        const json = await commRes.value.json();
        setCommunityData(json.data);
      }
      if (routeRes.status === "fulfilled" && routeRes.value.ok) {
        const json = await routeRes.value.json();
        setRouteInfo({
          distance_km: json.data.distance_km,
          duration_formatted: json.data.duration_formatted,
        });
      }
      if (busRes.status === "fulfilled" && busRes.value.ok) {
        const json = await busRes.value.json();
        setBusRedirect(json.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [destinationId, origin]);
  React.useEffect(() => {
    loadAllData();
  }, [loadAllData]);
  const handleGenerateItinerary = async () => {
    if (!destination) return;
    setIsItinLoading(true);
    try {
      const res = await fetch("/api/itineraries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination_id: destination.id,
          duration_days: 2,
          vehicle_type: "car",
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setItinerary(json.data);
      }
    } finally {
      setIsItinLoading(false);
    }
  };
  const handleAddComment = async (postId, text) => {
    await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: text,
      }),
    });
    // Refresh community data
    const commRes = await fetch(`/api/destinations/${destinationId}/community`);
    if (commRes.ok) {
      const json = await commRes.json();
      setCommunityData(json.data);
    }
  };
  if (isLoading) {
    return /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6",
      },
      /*#__PURE__*/ React.createElement(_skeleton.Skeleton, {
        className: "h-80 w-full rounded-3xl",
      }),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
        },
        /*#__PURE__*/ React.createElement(_skeleton.Skeleton, {
          className: "h-96 lg:col-span-2 rounded-2xl",
        }),
        /*#__PURE__*/ React.createElement(_skeleton.Skeleton, {
          className: "h-96 rounded-2xl",
        }),
      ),
    );
  }
  if (error || !destination) {
    return /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "max-w-3xl mx-auto px-4 py-16",
      },
      /*#__PURE__*/ React.createElement(_errorState.ErrorState, {
        title: "Destination could not be loaded",
        message: error || "Destination not found.",
        onRetry: loadAllData,
      }),
    );
  }
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className:
          "relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-md",
      },
      /*#__PURE__*/ React.createElement("img", {
        src:
          destination.hero_image_url ||
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        alt: destination.name,
        className: "w-full h-full object-cover",
      }),
      /*#__PURE__*/ React.createElement("div", {
        className:
          "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent",
      }),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className:
            "absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4",
        },
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "space-y-1.5",
          },
          /*#__PURE__*/ React.createElement(
            "span",
            {
              className:
                "inline-block px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider",
            },
            destination.category,
          ),
          /*#__PURE__*/ React.createElement(
            "h1",
            {
              className: "text-2xl sm:text-4xl font-black",
            },
            destination.name,
          ),
          /*#__PURE__*/ React.createElement(
            "p",
            {
              className:
                "text-xs sm:text-sm text-slate-200 flex items-center gap-2",
            },
            /*#__PURE__*/ React.createElement(
              "span",
              null,
              "\uD83D\uDCCD ",
              destination.region,
            ),
            /*#__PURE__*/ React.createElement("span", null, "\u2022"),
            /*#__PURE__*/ React.createElement(
              "span",
              null,
              "\uD83D\uDEE3\uFE0F ",
              routeInfo.distance_km,
              " km from ",
              origin.label.split(",")[0],
            ),
            /*#__PURE__*/ React.createElement("span", null, "\u2022"),
            /*#__PURE__*/ React.createElement(
              "span",
              null,
              "\u23F1\uFE0F ",
              routeInfo.duration_formatted,
              " drive",
            ),
          ),
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "flex gap-2",
          },
          /*#__PURE__*/ React.createElement(
            _button.Button,
            {
              size: "sm",
              variant: "secondary",
              onClick: () => setShowReviewModal(true),
            },
            "\u2605 Rate & Review",
          ),
          /*#__PURE__*/ React.createElement(
            _button.Button,
            {
              size: "sm",
              variant: "primary",
              onClick: () => setShowPostModal(true),
            },
            "+ Share Story",
          ),
        ),
      ),
    ),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "grid grid-cols-1 lg:grid-cols-12 gap-8",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "lg:col-span-8 space-y-8",
        },
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className:
              "rounded-2xl border border-slate-200 bg-white p-6 space-y-3",
          },
          /*#__PURE__*/ React.createElement(
            "h2",
            {
              className: "text-lg font-bold text-slate-900",
            },
            "About ",
            destination.name,
          ),
          /*#__PURE__*/ React.createElement(
            "p",
            {
              className: "text-sm text-slate-700 leading-relaxed",
            },
            destination.description,
          ),
        ),
        /*#__PURE__*/ React.createElement(_mapPanel.MapPanel, {
          originLat: origin.latitude,
          originLng: origin.longitude,
          originLabel: origin.label,
          destLat: destination.latitude,
          destLng: destination.longitude,
          destName: destination.name,
          distanceKm: routeInfo.distance_km,
          durationFormatted: routeInfo.duration_formatted,
          services: services
            ? {
                fuel: services.fuel_stations.places,
                mechanic: services.mechanics.places,
                hospital: services.hospitals.places,
              }
            : undefined,
        }),
        services &&
          /*#__PURE__*/ React.createElement(_serviceList.ServiceList, {
            services: services,
          }),
        /*#__PURE__*/ React.createElement(_itineraryView.ItineraryView, {
          itinerary: itinerary,
          isLoading: isItinLoading,
          onRegenerate: handleGenerateItinerary,
          destinationName: destination.name,
          durationDays: 2,
        }),
        busRedirect &&
          /*#__PURE__*/ React.createElement(_busBookingCard.BusBookingCard, {
            redirectInfo: busRedirect,
          }),
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "space-y-4",
          },
          /*#__PURE__*/ React.createElement(
            "div",
            {
              className:
                "flex items-center justify-between pb-2 border-b border-slate-200",
            },
            /*#__PURE__*/ React.createElement(
              "div",
              null,
              /*#__PURE__*/ React.createElement(
                "h3",
                {
                  className: "text-lg font-bold text-slate-900",
                },
                "Traveler Community & Insights",
              ),
              /*#__PURE__*/ React.createElement(
                "p",
                {
                  className: "text-xs text-slate-500",
                },
                "Popular experiences shared by explorers",
              ),
            ),
            /*#__PURE__*/ React.createElement(
              _button.Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => setShowPostModal(true),
              },
              "+ Create Post",
            ),
          ),
          communityData?.posts && communityData.posts.length > 0
            ? /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "space-y-4",
                },
                communityData.posts.map((post) =>
                  /*#__PURE__*/ React.createElement(
                    _communityPostCard.CommunityPostCard,
                    {
                      key: post.id,
                      post: post,
                      onAddComment: handleAddComment,
                    },
                  ),
                ),
              )
            : /*#__PURE__*/ React.createElement(
                "p",
                {
                  className:
                    "text-xs text-slate-400 py-6 text-center bg-slate-50 rounded-xl",
                },
                "No community posts yet. Be the first to share tips for ",
                destination.name,
                "!",
              ),
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "lg:col-span-4 space-y-6",
        },
        /*#__PURE__*/ React.createElement(_safetyCard.SafetyCard, {
          roadCondition: destination.road_condition,
          safetyTips: destination.safety_tips,
        }),
        communityData?.rating_summary &&
          /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "space-y-4",
            },
            /*#__PURE__*/ React.createElement(
              _ratingBreakdown.RatingBreakdown,
              {
                overallScore: communityData.rating_summary.overall_average,
                totalReviews: communityData.rating_summary.total_reviews,
                categoryAverages:
                  communityData.rating_summary.category_averages,
              },
            ),
            communityData.reviews &&
              communityData.reviews.length > 0 &&
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "space-y-3",
                },
                /*#__PURE__*/ React.createElement(
                  "h4",
                  {
                    className:
                      "text-xs font-bold uppercase tracking-wider text-slate-700",
                  },
                  "Recent Traveler Reviews",
                ),
                communityData.reviews.slice(0, 3).map((r) =>
                  /*#__PURE__*/ React.createElement(_reviewCard.ReviewCard, {
                    key: r.id,
                    review: r,
                  }),
                ),
              ),
          ),
      ),
    ),
    /*#__PURE__*/ React.createElement(_reviewFormModal.ReviewFormModal, {
      isOpen: showReviewModal,
      onClose: () => setShowReviewModal(false),
      destinationId: destination.id,
      destinationName: destination.name,
      onReviewSubmitted: loadAllData,
    }),
    /*#__PURE__*/ React.createElement(_createPostModal.CreatePostModal, {
      isOpen: showPostModal,
      onClose: () => setShowPostModal(false),
      destinations: [destination],
      preselectedDestinationId: destination.id,
      onPostCreated: loadAllData,
    }),
  );
}
