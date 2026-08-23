"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.Navbar = Navbar;
var React = _interopRequireWildcard(require("react"));
var _link = _interopRequireDefault(require("next/link"));
var _authContext = require("@/lib/auth/auth-context");
var _button = require("@/components/ui/button");
var _avatar = require("@/components/ui/avatar");
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
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
function Navbar() {
  const {
    user,
    signInWithGoogle,
    signOut,
    userLocation,
    requestLocationPermission,
  } = (0, _authContext.useAuth)();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  return /*#__PURE__*/ React.createElement(
    "header",
    {
      className:
        "sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className:
          "max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "flex items-center gap-6",
        },
        /*#__PURE__*/ React.createElement(
          _link.default,
          {
            href: "/",
            className: "flex items-center gap-2.5 group",
          },
          /*#__PURE__*/ React.createElement(
            "div",
            {
              className:
                "w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white text-lg font-black shadow-sm group-hover:scale-105 transition-transform",
            },
            "YS",
          ),
          /*#__PURE__*/ React.createElement(
            "div",
            null,
            /*#__PURE__*/ React.createElement(
              "span",
              {
                className: "text-xl font-black tracking-tight text-slate-900",
              },
              "Yatra",
              /*#__PURE__*/ React.createElement(
                "span",
                {
                  className: "text-emerald-600",
                },
                "Setu",
              ),
            ),
            /*#__PURE__*/ React.createElement(
              "span",
              {
                className:
                  "hidden sm:inline-block text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded ml-1.5",
              },
              "SIH MVP",
            ),
          ),
        ),
        /*#__PURE__*/ React.createElement(
          "nav",
          {
            className:
              "hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600",
          },
          /*#__PURE__*/ React.createElement(
            _link.default,
            {
              href: "/trip",
              className: "hover:text-emerald-600 transition-colors",
            },
            "Plan Trip",
          ),
          /*#__PURE__*/ React.createElement(
            _link.default,
            {
              href: "/community",
              className: "hover:text-emerald-600 transition-colors",
            },
            "Community Feed",
          ),
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "flex items-center gap-3",
        },
        userLocation &&
          /*#__PURE__*/ React.createElement(
            "button",
            {
              onClick: requestLocationPermission,
              title: "Click to refresh GPS location",
              className:
                "hidden lg:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1.5 rounded-full transition-colors",
            },
            /*#__PURE__*/ React.createElement(
              "span",
              {
                className: "text-emerald-600",
              },
              "\uD83D\uDCCD",
            ),
            /*#__PURE__*/ React.createElement(
              "span",
              {
                className: "max-w-[150px] truncate font-medium",
              },
              userLocation.label,
            ),
          ),
        user
          ? /*#__PURE__*/ React.createElement(
              "div",
              {
                className: "flex items-center gap-3",
              },
              /*#__PURE__*/ React.createElement(
                _link.default,
                {
                  href: "/profile",
                  className:
                    "flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-emerald-600",
                },
                /*#__PURE__*/ React.createElement(_avatar.Avatar, {
                  src: user.avatar_url,
                  name: user.name,
                  size: "sm",
                }),
                /*#__PURE__*/ React.createElement(
                  "span",
                  {
                    className: "hidden sm:inline",
                  },
                  user.name.split(" ")[0],
                ),
              ),
              /*#__PURE__*/ React.createElement(
                _button.Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: signOut,
                },
                "Sign Out",
              ),
            )
          : /*#__PURE__*/ React.createElement(
              _button.Button,
              {
                variant: "primary",
                size: "sm",
                onClick: signInWithGoogle,
                className: "gap-2",
              },
              /*#__PURE__*/ React.createElement(
                "svg",
                {
                  className: "w-4 h-4",
                  viewBox: "0 0 24 24",
                },
                /*#__PURE__*/ React.createElement("path", {
                  fill: "currentColor",
                  d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
                }),
                /*#__PURE__*/ React.createElement("path", {
                  fill: "currentColor",
                  d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
                }),
                /*#__PURE__*/ React.createElement("path", {
                  fill: "currentColor",
                  d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z",
                }),
                /*#__PURE__*/ React.createElement("path", {
                  fill: "currentColor",
                  d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z",
                }),
              ),
              /*#__PURE__*/ React.createElement(
                "span",
                null,
                "Sign in with Google",
              ),
            ),
        /*#__PURE__*/ React.createElement(
          "button",
          {
            onClick: () => setMobileMenuOpen(!mobileMenuOpen),
            className:
              "md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100",
            "aria-label": "Toggle menu",
          },
          "\u2630",
        ),
      ),
    ),
    mobileMenuOpen &&
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className:
            "md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2",
        },
        /*#__PURE__*/ React.createElement(
          _link.default,
          {
            href: "/trip",
            onClick: () => setMobileMenuOpen(false),
            className:
              "block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100",
          },
          "Plan Trip",
        ),
        /*#__PURE__*/ React.createElement(
          _link.default,
          {
            href: "/community",
            onClick: () => setMobileMenuOpen(false),
            className:
              "block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100",
          },
          "Community Feed",
        ),
        /*#__PURE__*/ React.createElement(
          _link.default,
          {
            href: "/profile",
            onClick: () => setMobileMenuOpen(false),
            className:
              "block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100",
          },
          "Profile",
        ),
      ),
  );
}
