"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = HomePage;
var React = _interopRequireWildcard(require("react"));
var _link = _interopRequireDefault(require("next/link"));
var _button = require("@/components/ui/button");
var _tripSetupForm = require("@/components/trip/trip-setup-form");
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
function HomePage() {
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "space-y-16 pb-16",
    },
    /*#__PURE__*/ React.createElement(
      "section",
      {
        className:
          "relative overflow-hidden bg-gradient-to-b from-emerald-900 via-slate-900 to-slate-950 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8",
      },
      /*#__PURE__*/ React.createElement("div", {
        className:
          "absolute inset-0 opacity-20 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:24px_24px]",
      }),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className:
            "max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center",
        },
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "lg:col-span-7 space-y-6 text-center lg:text-left",
          },
          /*#__PURE__*/ React.createElement(
            "div",
            {
              className:
                "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide",
            },
            /*#__PURE__*/ React.createElement("span", null, "\uD83D\uDE80"),
            /*#__PURE__*/ React.createElement(
              "span",
              null,
              "Unified Travel Discovery & Intelligence",
            ),
          ),
          /*#__PURE__*/ React.createElement(
            "h1",
            {
              className:
                "text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]",
            },
            "Every road trip, ",
            /*#__PURE__*/ React.createElement("br", null),
            /*#__PURE__*/ React.createElement(
              "span",
              {
                className:
                  "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300",
              },
              "AI-ranked & route-ready.",
            ),
          ),
          /*#__PURE__*/ React.createElement(
            "p",
            {
              className:
                "text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed",
            },
            "Stop switching between maps, review sites, and local listings. Discover top destinations within 100 km, verified fuel & mechanics, live road safety, and personalized AI itineraries.",
          ),
          /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-left",
            },
            /*#__PURE__*/ React.createElement(
              "div",
              {
                className:
                  "p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs",
              },
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "text-xl mb-1",
                },
                "\uD83D\uDCCD",
              ),
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "text-xs font-bold text-white",
                },
                "100 km Radius Focus",
              ),
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "text-[10px] text-slate-400 mt-0.5",
                },
                "Prioritized nearby gems",
              ),
            ),
            /*#__PURE__*/ React.createElement(
              "div",
              {
                className:
                  "p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs",
              },
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "text-xl mb-1",
                },
                "\uD83D\uDEA8",
              ),
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "text-xs font-bold text-white",
                },
                "Emergency Services",
              ),
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "text-[10px] text-slate-400 mt-0.5",
                },
                "Fuel, Mechanics, Hospitals",
              ),
            ),
            /*#__PURE__*/ React.createElement(
              "div",
              {
                className:
                  "p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs col-span-2 sm:col-span-1",
              },
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "text-xl mb-1",
                },
                "\uD83E\uDD16",
              ),
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "text-xs font-bold text-white",
                },
                "Vehicle-Aware AI",
              ),
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "text-[10px] text-slate-400 mt-0.5",
                },
                "Match scores & itineraries",
              ),
            ),
          ),
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "lg:col-span-5",
          },
          /*#__PURE__*/ React.createElement(_tripSetupForm.TripSetupForm, null),
        ),
      ),
    ),
    /*#__PURE__*/ React.createElement(
      "section",
      {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className:
            "flex flex-col sm:flex-row sm:items-end justify-between gap-4",
        },
        /*#__PURE__*/ React.createElement(
          "div",
          null,
          /*#__PURE__*/ React.createElement(
            "span",
            {
              className:
                "text-xs font-bold uppercase tracking-wider text-emerald-600",
            },
            "Explore Central Highlights",
          ),
          /*#__PURE__*/ React.createElement(
            "h2",
            {
              className:
                "text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1",
            },
            "Top Rated Tourist Gems in Madhya Pradesh",
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
            "Discover All Destinations \u2192",
          ),
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        },
        [
          {
            name: "Pachmarhi (Queen of Satpura)",
            category: "Hill Station & Nature",
            img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
            score: 96,
            dist: "190 km from Bhopal",
            id: "a1111111-1111-1111-1111-111111111111",
          },
          {
            name: "Sanchi Stupa & Monastic Caves",
            category: "UNESCO World Heritage",
            img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
            score: 95,
            dist: "46 km from Bhopal",
            id: "c3333333-3333-3333-3333-333333333333",
          },
          {
            name: "Bhedaghat Marble Rocks & Falls",
            category: "Geological Gorge & River",
            img: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=600&q=80",
            score: 93,
            dist: "22 km from Jabalpur",
            id: "e5555555-5555-5555-5555-555555555555",
          },
        ].map((d) =>
          /*#__PURE__*/ React.createElement(
            _link.default,
            {
              key: d.id,
              href: `/destinations/${d.id}`,
              className: "group block",
            },
            /*#__PURE__*/ React.createElement(
              "div",
              {
                className:
                  "rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200",
              },
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className:
                    "relative h-48 w-full bg-slate-100 overflow-hidden",
                },
                /*#__PURE__*/ React.createElement("img", {
                  src: d.img,
                  alt: d.name,
                  className:
                    "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
                }),
                /*#__PURE__*/ React.createElement(
                  "div",
                  {
                    className:
                      "absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs",
                  },
                  d.score,
                  "% Match",
                ),
              ),
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "p-4 space-y-1.5",
                },
                /*#__PURE__*/ React.createElement(
                  "span",
                  {
                    className:
                      "text-[11px] font-bold text-emerald-600 uppercase tracking-wider",
                  },
                  d.category,
                ),
                /*#__PURE__*/ React.createElement(
                  "h3",
                  {
                    className:
                      "text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors",
                  },
                  d.name,
                ),
                /*#__PURE__*/ React.createElement(
                  "p",
                  {
                    className: "text-xs text-slate-500 font-medium",
                  },
                  "\uD83D\uDCCD ",
                  d.dist,
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
