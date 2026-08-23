"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = ProfilePage;
var React = _interopRequireWildcard(require("react"));
var _authContext = require("@/lib/auth/auth-context");
var _button = require("@/components/ui/button");
var _avatar = require("@/components/ui/avatar");
var _link = _interopRequireDefault(require("next/link"));
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
function ProfilePage() {
  const {
    user,
    signOut,
    signInWithGoogle,
    userLocation,
    requestLocationPermission,
  } = (0, _authContext.useAuth)();
  if (!user) {
    return /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "max-w-md mx-auto px-4 py-16 text-center space-y-4",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "text-4xl",
        },
        "\uD83D\uDD10",
      ),
      /*#__PURE__*/ React.createElement(
        "h2",
        {
          className: "text-2xl font-bold text-slate-900",
        },
        "Sign In to YatraSetu",
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          className: "text-xs text-slate-500",
        },
        "Sign in with your Google Account to manage trips, write reviews, and share community posts.",
      ),
      /*#__PURE__*/ React.createElement(
        _button.Button,
        {
          variant: "primary",
          size: "lg",
          onClick: signInWithGoogle,
          className: "w-full",
        },
        "Sign in with Google",
      ),
    );
  }
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className:
          "rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className:
            "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100",
        },
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "flex items-center gap-4",
          },
          /*#__PURE__*/ React.createElement(_avatar.Avatar, {
            src: user.avatar_url,
            name: user.name,
            size: "lg",
          }),
          /*#__PURE__*/ React.createElement(
            "div",
            null,
            /*#__PURE__*/ React.createElement(
              "h1",
              {
                className: "text-xl font-bold text-slate-900",
              },
              user.name,
            ),
            /*#__PURE__*/ React.createElement(
              "p",
              {
                className: "text-xs text-slate-500",
              },
              user.email,
            ),
            /*#__PURE__*/ React.createElement(
              "span",
              {
                className:
                  "inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200",
              },
              "Verified Google Account",
            ),
          ),
        ),
        /*#__PURE__*/ React.createElement(
          _button.Button,
          {
            variant: "outline",
            size: "sm",
            onClick: signOut,
          },
          "Sign Out",
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "space-y-3",
        },
        /*#__PURE__*/ React.createElement(
          "h3",
          {
            className: "text-sm font-bold text-slate-900",
          },
          "Active Location Anchor",
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className:
              "p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between",
          },
          /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "flex items-center gap-2 text-xs text-slate-700",
            },
            /*#__PURE__*/ React.createElement("span", null, "\uD83D\uDCCD"),
            /*#__PURE__*/ React.createElement(
              "span",
              {
                className: "font-semibold",
              },
              userLocation?.label || "Bhopal, Madhya Pradesh (Default)",
            ),
          ),
          /*#__PURE__*/ React.createElement(
            _button.Button,
            {
              variant: "subtle",
              size: "sm",
              onClick: requestLocationPermission,
              className: "text-xs",
            },
            "Update GPS",
          ),
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "pt-2 flex flex-col sm:flex-row gap-3",
        },
        /*#__PURE__*/ React.createElement(
          _link.default,
          {
            href: "/trip",
            className: "flex-1",
          },
          /*#__PURE__*/ React.createElement(
            _button.Button,
            {
              variant: "primary",
              size: "md",
              className: "w-full",
            },
            "Plan New Trip \u2192",
          ),
        ),
        /*#__PURE__*/ React.createElement(
          _link.default,
          {
            href: "/community",
            className: "flex-1",
          },
          /*#__PURE__*/ React.createElement(
            _button.Button,
            {
              variant: "outline",
              size: "md",
              className: "w-full",
            },
            "Explore Community Feed",
          ),
        ),
      ),
    ),
  );
}
