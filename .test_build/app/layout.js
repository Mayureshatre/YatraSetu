"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = RootLayout;
exports.metadata = void 0;
require("./globals.css");
var _authContext = require("@/lib/auth/auth-context");
var _navbar = require("@/components/layout/navbar");
var _footer = require("@/components/layout/footer");
var _locationPermissionModal = require("@/components/trip/location-permission-modal");
const metadata = {
  title: 'YatraSetu — Unified Tourism Discovery & Travel Intelligence',
  description: 'AI-assisted destination ranking, vehicle-aware route intelligence, nearby emergency services, and community travel hub for India.'
};
exports.metadata = metadata;
function RootLayout({
  children
}) {
  return /*#__PURE__*/React.createElement("html", {
    lang: "en",
    className: "h-full bg-slate-50 text-slate-900 antialiased"
  }, /*#__PURE__*/React.createElement("body", {
    className: "flex min-h-full flex-col font-sans"
  }, /*#__PURE__*/React.createElement(_authContext.AuthProvider, null, /*#__PURE__*/React.createElement(_navbar.Navbar, null), /*#__PURE__*/React.createElement("main", {
    className: "flex-1"
  }, children), /*#__PURE__*/React.createElement(_footer.Footer, null), /*#__PURE__*/React.createElement(_locationPermissionModal.LocationPermissionModal, null))));
}