"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.ServiceList = ServiceList;
var React = _interopRequireWildcard(require("react"));
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
function ServiceList({ services }) {
  const [activeTab, setActiveTab] = React.useState("fuel");
  const tabs = [
    {
      key: "fuel",
      label: "Fuel Stations",
      count: services.fuel_stations.count,
      icon: "⛽",
    },
    {
      key: "mechanic",
      label: "24/7 Mechanics",
      count: services.mechanics.count,
      icon: "🔧",
    },
    {
      key: "hospital",
      label: "Emergency Hospitals",
      count: services.hospitals.count,
      icon: "🏥",
    },
  ];
  const currentPlaces =
    activeTab === "fuel"
      ? services.fuel_stations.places
      : activeTab === "mechanic"
        ? services.mechanics.places
        : services.hospitals.places;
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className:
        "rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className:
          "flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        null,
        /*#__PURE__*/ React.createElement(
          "h3",
          {
            className:
              "text-base font-bold text-slate-900 flex items-center gap-2",
          },
          /*#__PURE__*/ React.createElement("span", null, "\uD83D\uDEA8"),
          " Nearby Emergency & Support Services",
        ),
        /*#__PURE__*/ React.createElement(
          "p",
          {
            className: "text-xs text-slate-500 mt-0.5",
          },
          "Verified local support within destination corridor",
        ),
      ),
      /*#__PURE__*/ React.createElement(
        _badge.Badge,
        {
          variant: services.data_freshness === "live" ? "success" : "default",
          className: "self-start sm:self-auto",
        },
        services.data_freshness === "live"
          ? "● Live Places Data"
          : "● Verified Regional Fallback",
      ),
    ),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "flex items-center gap-2 overflow-x-auto pb-1",
      },
      tabs.map((t) =>
        /*#__PURE__*/ React.createElement(
          "button",
          {
            key: t.key,
            onClick: () => setActiveTab(t.key),
            className: `px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === t.key ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`,
          },
          /*#__PURE__*/ React.createElement("span", null, t.icon),
          /*#__PURE__*/ React.createElement("span", null, t.label),
          /*#__PURE__*/ React.createElement(
            "span",
            {
              className: `px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === t.key ? "bg-emerald-800 text-emerald-100" : "bg-slate-200 text-slate-800"}`,
            },
            t.count,
          ),
        ),
      ),
    ),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "space-y-2.5 pt-2",
      },
      currentPlaces.length === 0
        ? /*#__PURE__*/ React.createElement(
            "p",
            {
              className: "text-xs text-slate-400 py-4 text-center",
            },
            "No registered ",
            activeTab,
            " service listed.",
          )
        : currentPlaces.map((p) =>
            /*#__PURE__*/ React.createElement(
              "div",
              {
                key: p.id,
                className:
                  "p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3",
              },
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "space-y-1",
                },
                /*#__PURE__*/ React.createElement(
                  "div",
                  {
                    className: "flex items-center gap-2",
                  },
                  /*#__PURE__*/ React.createElement(
                    "h4",
                    {
                      className: "text-sm font-bold text-slate-900",
                    },
                    p.name,
                  ),
                  p.is_open !== null &&
                    /*#__PURE__*/ React.createElement(
                      "span",
                      {
                        className: `text-[10px] font-bold px-1.5 py-0.5 rounded ${p.is_open ? "bg-emerald-100 text-emerald-800" : "bg-emerald-100 text-emerald-800"}`,
                      },
                      p.is_open ? "Open Now" : "Closed",
                    ),
                ),
                /*#__PURE__*/ React.createElement(
                  "p",
                  {
                    className: "text-xs text-slate-500",
                  },
                  p.address,
                ),
                p.phone &&
                  /*#__PURE__*/ React.createElement(
                    "p",
                    {
                      className:
                        "text-xs font-semibold text-emerald-700 flex items-center gap-1",
                    },
                    /*#__PURE__*/ React.createElement(
                      "span",
                      null,
                      "\uD83D\uDCDE",
                    ),
                    " ",
                    p.phone,
                  ),
              ),
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className:
                    "flex sm:flex-col items-center sm:items-end justify-between text-xs text-slate-600 shrink-0",
                },
                /*#__PURE__*/ React.createElement(
                  "span",
                  {
                    className:
                      "font-bold text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded-lg",
                  },
                  "\uD83D\uDCCD ",
                  p.distance_km,
                  " km away",
                ),
                p.rating &&
                  /*#__PURE__*/ React.createElement(
                    "span",
                    {
                      className: "text-emerald-600 font-semibold mt-1",
                    },
                    "\u2605 ",
                    p.rating.toFixed(1),
                  ),
              ),
            ),
          ),
    ),
  );
}
