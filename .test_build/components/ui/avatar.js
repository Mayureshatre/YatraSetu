"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.Avatar = Avatar;
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
function Avatar({ src, name = "User", size = "md", className }) {
  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base font-bold",
  };
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  if (src) {
    return /*#__PURE__*/ React.createElement("img", {
      src: src,
      alt: name,
      className: (0, _utils.cn)(
        "rounded-full object-cover border border-slate-200",
        sizes[size],
        className,
      ),
    });
  }
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: (0, _utils.cn)(
        "rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center border border-emerald-200",
        sizes[size],
        className,
      ),
    },
    initials,
  );
}
