"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Skeleton = Skeleton;
var _utils = require("@/lib/utils");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function Skeleton({
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: (0, _utils.cn)('animate-pulse rounded-xl bg-slate-200', className)
  }, props));
}