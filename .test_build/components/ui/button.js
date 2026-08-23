"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.Button = void 0;
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
function _extends() {
  _extends = Object.assign
    ? Object.assign.bind()
    : function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
  return _extends.apply(this, arguments);
}
const Button = /*#__PURE__*/ React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
    const variants = {
      primary:
        "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm hover:shadow",
      secondary:
        "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 focus:ring-emerald-400",
      outline:
        "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:ring-emerald-500",
      ghost:
        "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400",
      destructive:
        "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm",
      subtle:
        "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400",
    };
    const sizes = {
      sm: "text-xs px-3 py-1.5 min-h-[34px] gap-1.5",
      md: "text-sm px-4 py-2.5 min-h-[42px] gap-2",
      lg: "text-base px-6 py-3.5 min-h-[50px] gap-2.5 font-semibold",
      icon: "h-10 w-10 p-0",
    };
    return /*#__PURE__*/ React.createElement(
      "button",
      _extends(
        {
          ref: ref,
          disabled: disabled || isLoading,
          className: (0, _utils.cn)(
            baseStyles,
            variants[variant],
            sizes[size],
            className,
          ),
        },
        props,
      ),
      isLoading &&
        /*#__PURE__*/ React.createElement(
          "svg",
          {
            className: "animate-spin -ml-1 mr-2 h-4 w-4 text-current",
            fill: "none",
            viewBox: "0 0 24 24",
          },
          /*#__PURE__*/ React.createElement("circle", {
            className: "opacity-25",
            cx: "12",
            cy: "12",
            r: "10",
            stroke: "currentColor",
            strokeWidth: "4",
          }),
          /*#__PURE__*/ React.createElement("path", {
            className: "opacity-75",
            fill: "currentColor",
            d: "M4 12a8 8 0 018-8v8H4z",
          }),
        ),
      children,
    );
  },
);
exports.Button = Button;
Button.displayName = "Button";
