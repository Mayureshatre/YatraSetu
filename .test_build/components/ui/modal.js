"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Modal = Modal;
var React = _interopRequireWildcard(require("react"));
var _utils = require("@/lib/utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md'
}) {
  if (!isOpen) return null;
  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0",
    onClick: onClose,
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: (0, _utils.cn)('relative w-full bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-10 max-h-[90vh] overflow-y-auto', maxWidths[maxWidth]),
    role: "dialog",
    "aria-modal": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between pb-4 mb-4 border-b border-slate-100"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold text-slate-900"
  }, title), description && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 mt-1"
  }, description)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors",
    "aria-label": "Close dialog"
  }, "\u2715")), /*#__PURE__*/React.createElement("div", null, children)));
}