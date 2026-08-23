"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.Input = void 0;
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
const Input = /*#__PURE__*/ React.forwardRef(
  ({ className, type = "text", label, error, ...props }, ref) => {
    return /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "w-full space-y-1.5",
      },
      label &&
        /*#__PURE__*/ React.createElement(
          "label",
          {
            className: "text-xs font-semibold text-slate-700",
          },
          label,
        ),
      /*#__PURE__*/ React.createElement(
        "input",
        _extends(
          {
            type: type,
            className: (0, _utils.cn)(
              "flex w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
              error &&
                "border-emerald-400 focus:ring-emerald-400 focus:border-emerald-400",
              className,
            ),
            ref: ref,
          },
          props,
        ),
      ),
      error &&
        /*#__PURE__*/ React.createElement(
          "p",
          {
            className: "text-xs text-emerald-600 font-medium",
          },
          error,
        ),
    );
  },
);
exports.Input = Input;
Input.displayName = "Input";
