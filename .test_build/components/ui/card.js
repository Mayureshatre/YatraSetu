"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Card = Card;
exports.CardContent = CardContent;
exports.CardDescription = CardDescription;
exports.CardFooter = CardFooter;
exports.CardHeader = CardHeader;
exports.CardTitle = CardTitle;
var React = _interopRequireWildcard(require("react"));
var _utils = require("@/lib/utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function Card({
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: (0, _utils.cn)('rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden', className)
  }, props));
}
function CardHeader({
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: (0, _utils.cn)('flex flex-col space-y-1.5 p-5 md:p-6', className)
  }, props));
}
function CardTitle({
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("h3", _extends({
    className: (0, _utils.cn)('text-lg md:text-xl font-bold tracking-tight text-slate-900', className)
  }, props));
}
function CardDescription({
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("p", _extends({
    className: (0, _utils.cn)('text-sm text-slate-500 leading-relaxed', className)
  }, props));
}
function CardContent({
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: (0, _utils.cn)('p-5 md:p-6 pt-0', className)
  }, props));
}
function CardFooter({
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: (0, _utils.cn)('flex items-center p-5 md:p-6 pt-0', className)
  }, props));
}