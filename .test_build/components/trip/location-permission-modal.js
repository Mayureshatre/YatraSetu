"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.LocationPermissionModal = LocationPermissionModal;
var React = _interopRequireWildcard(require("react"));
var _modal = require("@/components/ui/modal");
var _button = require("@/components/ui/button");
var _authContext = require("@/lib/auth/auth-context");
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
function LocationPermissionModal() {
  const {
    showLocationModal,
    requestLocationPermission,
    setManualLocation,
    dismissLocationPrompt,
  } = (0, _authContext.useAuth)();
  const [isRequesting, setIsRequesting] = React.useState(false);
  const POPULAR_HUBS = [
    {
      label: "Bhopal, Madhya Pradesh",
      lat: 23.2599,
      lng: 77.4126,
    },
    {
      label: "Indore, Madhya Pradesh",
      lat: 22.7196,
      lng: 75.8577,
    },
    {
      label: "Jabalpur, Madhya Pradesh",
      lat: 23.1815,
      lng: 79.9864,
    },
    {
      label: "Gwalior, Madhya Pradesh",
      lat: 26.2183,
      lng: 78.1828,
    },
    {
      label: "Ujjain, Madhya Pradesh",
      lat: 23.1765,
      lng: 75.7885,
    },
  ];
  const handleGrantGps = async () => {
    setIsRequesting(true);
    await requestLocationPermission();
    setIsRequesting(false);
  };
  const handleManualSelect = (hub) => {
    setManualLocation({
      latitude: hub.lat,
      longitude: hub.lng,
      label: hub.label,
    });
  };
  return /*#__PURE__*/ React.createElement(
    _modal.Modal,
    {
      isOpen: showLocationModal,
      onClose: dismissLocationPrompt,
      title: "Enable Location for Travel Discovery",
      description:
        "YatraSetu prioritizes remarkable tourist destinations within a preferred 100 km radius of your location.",
      maxWidth: "md",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "space-y-5",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className:
            "p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1.5",
        },
        /*#__PURE__*/ React.createElement(
          "p",
          {
            className: "font-bold",
          },
          "Why we need your location:",
        ),
        /*#__PURE__*/ React.createElement(
          "ul",
          {
            className: "space-y-1 list-disc list-inside text-emerald-800",
          },
          /*#__PURE__*/ React.createElement(
            "li",
            null,
            "Calculate accurate vehicle driving times & route safety conditions.",
          ),
          /*#__PURE__*/ React.createElement(
            "li",
            null,
            "Locate nearby fuel stations, 24/7 mechanics, and emergency medical trauma care.",
          ),
          /*#__PURE__*/ React.createElement(
            "li",
            null,
            "Rank destinations within easy 100 km day-trip proximity.",
          ),
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "space-y-2",
        },
        /*#__PURE__*/ React.createElement(
          _button.Button,
          {
            variant: "primary",
            size: "lg",
            onClick: handleGrantGps,
            isLoading: isRequesting,
            className: "w-full gap-2 text-sm font-bold",
          },
          /*#__PURE__*/ React.createElement("span", null, "\uD83D\uDCCD"),
          /*#__PURE__*/ React.createElement(
            "span",
            null,
            "Allow Browser Location Access",
          ),
        ),
        /*#__PURE__*/ React.createElement(
          "p",
          {
            className: "text-center text-[11px] text-slate-400 font-medium",
          },
          "\u2014 Or pick your starting city manually below \u2014",
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "space-y-2 pt-1 border-t border-slate-100",
        },
        /*#__PURE__*/ React.createElement(
          "label",
          {
            className: "text-xs font-bold text-slate-700 block",
          },
          "Select Starting Hub:",
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "grid grid-cols-1 gap-1.5",
          },
          POPULAR_HUBS.map((hub) =>
            /*#__PURE__*/ React.createElement(
              "button",
              {
                key: hub.label,
                type: "button",
                onClick: () => handleManualSelect(hub),
                className:
                  "text-left text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 font-semibold text-slate-800 transition-colors flex items-center justify-between",
              },
              /*#__PURE__*/ React.createElement(
                "span",
                null,
                "\uD83D\uDCCD ",
                hub.label,
              ),
              /*#__PURE__*/ React.createElement(
                "span",
                {
                  className: "text-[10px] text-emerald-700 font-bold",
                },
                "Select \u2192",
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
