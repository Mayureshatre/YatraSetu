"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = TripPage;
var React = _interopRequireWildcard(require("react"));
var _tripSetupForm = require("@/components/trip/trip-setup-form");
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
function TripPage() {
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "text-center space-y-2",
      },
      /*#__PURE__*/ React.createElement(
        "span",
        {
          className:
            "text-xs font-bold uppercase tracking-wider text-emerald-600",
        },
        "Smart Trip Planner",
      ),
      /*#__PURE__*/ React.createElement(
        "h1",
        {
          className:
            "text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight",
        },
        "Plan Your Next Road Journey",
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          className: "text-sm text-slate-500 max-w-lg mx-auto",
        },
        "Specify your starting hub, chosen vehicle, and trip duration to receive AI-ranked destination recommendations.",
      ),
    ),
    /*#__PURE__*/ React.createElement(_tripSetupForm.TripSetupForm, null),
  );
}
