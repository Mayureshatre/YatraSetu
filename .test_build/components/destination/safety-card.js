"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SafetyCard = SafetyCard;
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
function SafetyCard({ roadCondition, safetyTips = [] }) {
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
          "flex items-center justify-between pb-3 border-b border-slate-100",
      },
      /*#__PURE__*/ React.createElement(
        "h3",
        {
          className:
            "text-base font-bold text-slate-900 flex items-center gap-2",
        },
        /*#__PURE__*/ React.createElement("span", null, "\uD83D\uDEE1\uFE0F"),
        " Road & Travel Safety Intelligence",
      ),
      /*#__PURE__*/ React.createElement(
        "span",
        {
          className:
            "text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full",
        },
        "Verified Field Intel",
      ),
    ),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "space-y-3",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        null,
        /*#__PURE__*/ React.createElement(
          "h4",
          {
            className:
              "text-xs font-bold text-slate-700 uppercase tracking-wider mb-1",
          },
          "Current Road & Terrain Condition",
        ),
        /*#__PURE__*/ React.createElement(
          "p",
          {
            className:
              "text-sm text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-medium",
          },
          roadCondition ||
            "Well-paved state highway with standard tarmac connectivity.",
        ),
      ),
      safetyTips &&
        safetyTips.length > 0 &&
        /*#__PURE__*/ React.createElement(
          "div",
          null,
          /*#__PURE__*/ React.createElement(
            "h4",
            {
              className:
                "text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5",
            },
            "Practical Traveler Precautions",
          ),
          /*#__PURE__*/ React.createElement(
            "ul",
            {
              className: "space-y-2",
            },
            safetyTips.map((tip, idx) =>
              /*#__PURE__*/ React.createElement(
                "li",
                {
                  key: idx,
                  className: "text-xs text-slate-700 flex items-start gap-2",
                },
                /*#__PURE__*/ React.createElement(
                  "span",
                  {
                    className: "text-emerald-500 font-bold",
                  },
                  "\u2022",
                ),
                /*#__PURE__*/ React.createElement("span", null, tip),
              ),
            ),
          ),
        ),
    ),
  );
}
