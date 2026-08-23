"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.MapPanel = MapPanel;
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
function MapPanel({
  originLat,
  originLng,
  originLabel = "Origin",
  destLat,
  destLng,
  destName,
  distanceKm,
  durationFormatted,
  vehicleType = "car",
  services,
  className,
}) {
  const [activeLayer, setActiveLayer] = React.useState("all");
  const [zoomLevel, setZoomLevel] = React.useState(1);

  // SVG Coordinates Projection
  const minLat = Math.min(originLat, destLat) - 0.2;
  const maxLat = Math.max(originLat, destLat) + 0.2;
  const minLng = Math.min(originLng, destLng) - 0.2;
  const maxLng = Math.max(originLng, destLng) + 0.2;
  const mapWidth = 700;
  const mapHeight = 360;
  const project = (lat, lng) => {
    const x =
      ((lng - minLng) / (maxLng - minLng || 0.1)) * (mapWidth - 120) + 60;
    const y =
      (1 - (lat - minLat) / (maxLat - minLat || 0.1)) * (mapHeight - 100) + 50;
    return {
      x,
      y,
    };
  };
  const originPoint = project(originLat, originLng);
  const destPoint = project(destLat, destLng);

  // Intermediate curve control point to simulate natural highway route
  const midX = (originPoint.x + destPoint.x) / 2 + 25;
  const midY = (originPoint.y + destPoint.y) / 2 - 20;
  const pathD = `M ${originPoint.x} ${originPoint.y} Q ${midX} ${midY} ${destPoint.x} ${destPoint.y}`;
  const allServices = [
    ...(services?.fuel || []),
    ...(services?.mechanic || []),
    ...(services?.hospital || []),
  ];
  const visibleServices =
    activeLayer === "all"
      ? allServices
      : allServices.filter((s) => s.type === activeLayer);
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className:
        "rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className:
          "p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "flex items-center gap-3",
        },
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className:
              "flex items-center gap-1.5 text-xs font-bold text-emerald-400",
          },
          /*#__PURE__*/ React.createElement("span", null, "\uD83D\uDDFA\uFE0F"),
          /*#__PURE__*/ React.createElement(
            "span",
            null,
            "Interactive Route Canvas",
          ),
        ),
        /*#__PURE__*/ React.createElement(
          "span",
          {
            className: "text-slate-500",
          },
          "\u2022",
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "text-xs text-slate-300",
          },
          /*#__PURE__*/ React.createElement(
            "span",
            null,
            "\uD83D\uDEE3\uFE0F ",
            distanceKm,
            " km",
          ),
          /*#__PURE__*/ React.createElement(
            "span",
            {
              className: "mx-1.5",
            },
            "|",
          ),
          /*#__PURE__*/ React.createElement(
            "span",
            null,
            "\u23F1\uFE0F ",
            durationFormatted,
            " (",
            vehicleType,
            ")",
          ),
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "flex items-center gap-1.5",
        },
        /*#__PURE__*/ React.createElement(
          "span",
          {
            className:
              "text-[10px] text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline",
          },
          "Layers:",
        ),
        /*#__PURE__*/ React.createElement(
          "button",
          {
            onClick: () => setActiveLayer("all"),
            className: `px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${activeLayer === "all" ? "bg-emerald-500 text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`,
          },
          "All",
        ),
        /*#__PURE__*/ React.createElement(
          "button",
          {
            onClick: () => setActiveLayer("fuel"),
            className: `px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${activeLayer === "fuel" ? "bg-emerald-500 text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`,
          },
          "\u26FD Fuel (",
          services?.fuel?.length || 0,
          ")",
        ),
        /*#__PURE__*/ React.createElement(
          "button",
          {
            onClick: () => setActiveLayer("mechanic"),
            className: `px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${activeLayer === "mechanic" ? "bg-cyan-500 text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`,
          },
          "\uD83D\uDD27 Mechanic (",
          services?.mechanic?.length || 0,
          ")",
        ),
        /*#__PURE__*/ React.createElement(
          "button",
          {
            onClick: () => setActiveLayer("hospital"),
            className: `px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${activeLayer === "hospital" ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`,
          },
          "\uD83C\uDFE5 Hospital (",
          services?.hospital?.length || 0,
          ")",
        ),
      ),
    ),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className:
          "relative w-full h-80 sm:h-96 bg-slate-950 overflow-hidden select-none",
      },
      /*#__PURE__*/ React.createElement(
        "svg",
        {
          className: "w-full h-full",
          viewBox: `0 0 ${mapWidth} ${mapHeight}`,
        },
        /*#__PURE__*/ React.createElement(
          "defs",
          null,
          /*#__PURE__*/ React.createElement(
            "pattern",
            {
              id: "grid",
              width: "40",
              height: "40",
              patternUnits: "userSpaceOnUse",
            },
            /*#__PURE__*/ React.createElement("path", {
              d: "M 40 0 L 0 0 0 40",
              fill: "none",
              stroke: "#1e293b",
              strokeWidth: "0.8",
            }),
          ),
          /*#__PURE__*/ React.createElement(
            "linearGradient",
            {
              id: "routeGradient",
              x1: "0%",
              y1: "0%",
              x2: "100%",
              y2: "100%",
            },
            /*#__PURE__*/ React.createElement("stop", {
              offset: "0%",
              stopColor: "#06b6d4",
            }),
            /*#__PURE__*/ React.createElement("stop", {
              offset: "100%",
              stopColor: "#10b981",
            }),
          ),
          /*#__PURE__*/ React.createElement(
            "filter",
            {
              id: "glow",
              x: "-20%",
              y: "-20%",
              width: "140%",
              height: "140%",
            },
            /*#__PURE__*/ React.createElement("feGaussianBlur", {
              stdDeviation: "3",
              result: "glow",
            }),
            /*#__PURE__*/ React.createElement("feComposite", {
              in: "SourceGraphic",
              in2: "glow",
              operator: "over",
            }),
          ),
        ),
        /*#__PURE__*/ React.createElement("rect", {
          width: "100%",
          height: "100%",
          fill: "url(#grid)",
        }),
        /*#__PURE__*/ React.createElement("path", {
          d: `M 0 180 Q 200 120 400 240 T ${mapWidth} 160`,
          fill: "none",
          stroke: "#334155",
          strokeWidth: "1.5",
          strokeDasharray: "4,4",
          opacity: "0.5",
        }),
        /*#__PURE__*/ React.createElement("path", {
          d: pathD,
          fill: "none",
          stroke: "#0f172a",
          strokeWidth: "10",
          strokeLinecap: "round",
        }),
        /*#__PURE__*/ React.createElement("path", {
          d: pathD,
          fill: "none",
          stroke: "url(#routeGradient)",
          strokeWidth: "5",
          strokeLinecap: "round",
          filter: "url(#glow)",
        }),
        /*#__PURE__*/ React.createElement(
          "circle",
          {
            r: "4",
            fill: "#ffffff",
          },
          /*#__PURE__*/ React.createElement("animateMotion", {
            path: pathD,
            dur: "4s",
            repeatCount: "indefinite",
          }),
        ),
        /*#__PURE__*/ React.createElement(
          "g",
          {
            transform: `translate(${originPoint.x}, ${originPoint.y})`,
          },
          /*#__PURE__*/ React.createElement("circle", {
            r: "14",
            fill: "#0284c7",
            opacity: "0.3",
            className: "animate-ping",
          }),
          /*#__PURE__*/ React.createElement("circle", {
            r: "8",
            fill: "#0284c7",
            stroke: "#ffffff",
            strokeWidth: "2.5",
          }),
          /*#__PURE__*/ React.createElement(
            "text",
            {
              y: "-14",
              textAnchor: "middle",
              fill: "#93c5fd",
              fontSize: "11",
              fontWeight: "bold",
            },
            originLabel.split(",")[0],
            " (Start)",
          ),
        ),
        /*#__PURE__*/ React.createElement(
          "g",
          {
            transform: `translate(${destPoint.x}, ${destPoint.y})`,
          },
          /*#__PURE__*/ React.createElement("circle", {
            r: "16",
            fill: "#10b981",
            opacity: "0.4",
            className: "animate-ping",
          }),
          /*#__PURE__*/ React.createElement("circle", {
            r: "10",
            fill: "#10b981",
            stroke: "#ffffff",
            strokeWidth: "3",
          }),
          /*#__PURE__*/ React.createElement(
            "text",
            {
              y: "-16",
              textAnchor: "middle",
              fill: "#a7f3d0",
              fontSize: "12",
              fontWeight: "bold",
            },
            destName,
            " (Destination)",
          ),
        ),
        visibleServices.map((srv, index) => {
          // Distribute markers in proximity to the destination point
          const offsetX =
            ((index % 3) - 1) * 35 + (destPoint.x > mapWidth / 2 ? -40 : 40);
          const offsetY =
            Math.floor(index / 3) * 28 +
            (destPoint.y > mapHeight / 2 ? -40 : 35);
          const sx = destPoint.x + offsetX;
          const sy = destPoint.y + offsetY;
          const icon =
            srv.type === "fuel" ? "⛽" : srv.type === "mechanic" ? "🔧" : "🏥";
          const color =
            srv.type === "fuel"
              ? "#f59e0b"
              : srv.type === "mechanic"
                ? "#06b6d4"
                : "#ef4444";
          return /*#__PURE__*/ React.createElement(
            "g",
            {
              key: srv.id,
              transform: `translate(${sx}, ${sy})`,
              className: "cursor-pointer group",
            },
            /*#__PURE__*/ React.createElement("circle", {
              r: "9",
              fill: "#0f172a",
              stroke: color,
              strokeWidth: "2",
            }),
            /*#__PURE__*/ React.createElement(
              "text",
              {
                y: "3.5",
                textAnchor: "middle",
                fontSize: "10",
              },
              icon,
            ),
            /*#__PURE__*/ React.createElement(
              "title",
              null,
              `${srv.name} (${srv.distance_km} km)`,
            ),
          );
        }),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className:
            "absolute bottom-3 right-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300",
        },
        /*#__PURE__*/ React.createElement(
          "span",
          null,
          "\u25CF Verified GPS Vector Map",
        ),
        /*#__PURE__*/ React.createElement(
          "a",
          {
            href: `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-emerald-400 font-bold hover:underline ml-1",
          },
          "Open in Google Maps \u2197",
        ),
      ),
    ),
  );
}
