"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.ErrorState = ErrorState;
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
function ErrorState({ title = "Something went wrong", message, onRetry }) {
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className:
        "p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      null,
      /*#__PURE__*/ React.createElement(
        "h4",
        {
          className: "font-bold text-base mb-0.5",
        },
        title,
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          className: "text-sm text-emerald-700",
        },
        message,
      ),
    ),
    onRetry &&
      /*#__PURE__*/ React.createElement(
        _button.Button,
        {
          variant: "destructive",
          size: "sm",
          onClick: onRetry,
        },
        "Try Again",
      ),
  );
}
