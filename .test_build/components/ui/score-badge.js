"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.ScoreBadge = ScoreBadge;
var React = _interopRequireWildcard(require("react"));
var _utils = require("@/lib/utils");
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
function ScoreBadge({ score, size = "md", className, showLabel = true }) {
  let colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  let gaugeClass = "bg-emerald-500";
  if (score >= 90) {
    colorClass = "bg-emerald-50 text-emerald-800 border-emerald-300";
    gaugeClass = "bg-emerald-600";
  } else if (score >= 80) {
    colorClass = "bg-emerald-50 text-emerald-800 border-emerald-300";
    gaugeClass = "bg-emerald-600";
  } else if (score >= 65) {
    colorClass = "bg-blue-50 text-blue-800 border-blue-300";
    gaugeClass = "bg-blue-600";
  } else {
    colorClass = "bg-emerald-50 text-emerald-800 border-emerald-300";
    gaugeClass = "bg-emerald-600";
  }
  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: (0, _utils.cn)(
        "inline-flex items-center gap-1.5 rounded-full border font-bold shadow-xs",
        colorClass,
        sizes[size],
        className,
      ),
    },
    /*#__PURE__*/ React.createElement("span", {
      className: (0, _utils.cn)(
        "w-2 h-2 rounded-full animate-pulse",
        gaugeClass,
      ),
    }),
    /*#__PURE__*/ React.createElement("span", null, score, "%"),
    showLabel &&
      /*#__PURE__*/ React.createElement(
        "span",
        {
          className: "font-medium text-slate-500 text-[0.85em]",
        },
        "Match",
      ),
  );
}
