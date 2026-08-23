"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.EmptyState = EmptyState;
var React = _interopRequireWildcard(require("react"));
var _button = require("./button");
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
function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className:
        "flex flex-col items-center justify-center p-8 md:p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className:
          "w-14 h-14 mb-4 flex items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 text-2xl",
      },
      icon || "🗺️",
    ),
    /*#__PURE__*/ React.createElement(
      "h3",
      {
        className: "text-lg font-bold text-slate-900 mb-1",
      },
      title,
    ),
    /*#__PURE__*/ React.createElement(
      "p",
      {
        className: "text-sm text-slate-500 max-w-md mb-6",
      },
      description,
    ),
    actionLabel &&
      onAction &&
      /*#__PURE__*/ React.createElement(
        _button.Button,
        {
          onClick: onAction,
          variant: "outline",
          size: "sm",
        },
        actionLabel,
      ),
  );
}
