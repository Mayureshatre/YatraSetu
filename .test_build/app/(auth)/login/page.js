"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = LoginPage;
var React = _interopRequireWildcard(require("react"));
var _authContext = require("@/lib/auth/auth-context");
var _button = require("@/components/ui/button");
var _navigation = require("next/navigation");
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
function LoginPage() {
  const { user, signInWithGoogle } = (0, _authContext.useAuth)();
  const router = (0, _navigation.useRouter)();
  React.useEffect(() => {
    if (user) {
      router.push("/trip");
    }
  }, [user, router]);
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "min-h-[75vh] flex items-center justify-center px-4 py-12",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className:
          "max-w-md w-full p-8 rounded-3xl border border-slate-200 bg-white shadow-xl text-center space-y-6",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className:
            "w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white text-2xl font-black shadow-sm",
        },
        "YS",
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "space-y-1",
        },
        /*#__PURE__*/ React.createElement(
          "h1",
          {
            className: "text-2xl font-black text-slate-900",
          },
          "Welcome to YatraSetu",
        ),
        /*#__PURE__*/ React.createElement(
          "p",
          {
            className: "text-xs text-slate-500",
          },
          "Sign in securely with Google to unlock AI-assisted recommendations, route safety intelligence, and community reviews.",
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "space-y-3 pt-2",
        },
        /*#__PURE__*/ React.createElement(
          _button.Button,
          {
            variant: "primary",
            size: "lg",
            onClick: signInWithGoogle,
            className: "w-full gap-2.5 font-bold shadow-md",
          },
          /*#__PURE__*/ React.createElement(
            "svg",
            {
              className: "w-5 h-5",
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
            "Continue with Google",
          ),
        ),
        /*#__PURE__*/ React.createElement(
          "p",
          {
            className: "text-[11px] text-slate-400",
          },
          "By signing in, you agree to YatraSetu\u2019s terms of service and travel safety guidelines.",
        ),
      ),
    ),
  );
}
