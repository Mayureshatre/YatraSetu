"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.BusBookingCard = BusBookingCard;
var React = _interopRequireWildcard(require("react"));
var _button = require("@/components/ui/button");
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
function BusBookingCard({ redirectInfo }) {
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className:
        "rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-orange-50 p-5 md:p-6 space-y-3",
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
            className: "text-2xl",
          },
          "\uD83D\uDE8C",
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          null,
          /*#__PURE__*/ React.createElement(
            "h4",
            {
              className: "text-sm font-bold text-slate-900",
            },
            "Intercity Bus Travel Assistance",
          ),
          /*#__PURE__*/ React.createElement(
            "p",
            {
              className: "text-xs text-slate-600",
            },
            "Verified route from ",
            /*#__PURE__*/ React.createElement(
              "strong",
              null,
              redirectInfo.origin_city,
            ),
            " to ",
            /*#__PURE__*/ React.createElement(
              "strong",
              null,
              redirectInfo.destination_city,
            ),
          ),
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "span",
        {
          className:
            "text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg",
        },
        redirectInfo.provider_name,
      ),
    ),
    /*#__PURE__*/ React.createElement(
      "p",
      {
        className: "text-xs text-slate-600 leading-relaxed",
      },
      redirectInfo.disclaimer,
    ),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "pt-2 flex justify-end",
      },
      /*#__PURE__*/ React.createElement(
        "a",
        {
          href: redirectInfo.booking_url,
          target: "_blank",
          rel: "noopener noreferrer",
        },
        /*#__PURE__*/ React.createElement(
          _button.Button,
          {
            variant: "primary",
            size: "sm",
            className: "bg-emerald-600 hover:bg-emerald-700 text-white gap-2",
          },
          /*#__PURE__*/ React.createElement(
            "span",
            null,
            "Check Bus Schedules on ",
            redirectInfo.provider_name,
          ),
          /*#__PURE__*/ React.createElement("span", null, "\u2197"),
        ),
      ),
    ),
  );
}
