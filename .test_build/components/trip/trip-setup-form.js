"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.TripSetupForm = TripSetupForm;
var React = _interopRequireWildcard(require("react"));
var _navigation = require("next/navigation");
var _authContext = require("@/lib/auth/auth-context");
var _button = require("@/components/ui/button");
var _input = require("@/components/ui/input");
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
function TripSetupForm() {
  const router = (0, _navigation.useRouter)();
  const { userLocation, requestLocationPermission } = (0,
  _authContext.useAuth)();
  const [originLabel, setOriginLabel] = React.useState(
    userLocation?.label || _authContext.DEFAULT_LOCATION.label,
  );
  const [originLat, setOriginLat] = React.useState(
    userLocation?.latitude || _authContext.DEFAULT_LOCATION.latitude,
  );
  const [originLng, setOriginLng] = React.useState(
    userLocation?.longitude || _authContext.DEFAULT_LOCATION.longitude,
  );
  const [vehicleType, setVehicleType] = React.useState("car");
  const [durationDays, setDurationDays] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    if (userLocation) {
      setOriginLabel(userLocation.label);
      setOriginLat(userLocation.latitude);
      setOriginLng(userLocation.longitude);
    }
  }, [userLocation]);
  const vehicles = [
    {
      type: "car",
      label: "Car / Sedan",
      icon: "🚗",
      desc: "Standard paved highway driving",
    },
    {
      type: "bike",
      label: "Motorcycle",
      icon: "🏍️",
      desc: "Scenic curves & ghat routes",
    },
    {
      type: "suv",
      label: "SUV / 4x4",
      icon: "🚙",
      desc: "Rugged hills & wildlife safari trails",
    },
    {
      type: "bus",
      label: "Intercity Bus",
      icon: "🚌",
      desc: "Direct expressways & booking links",
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const queryParams = new URLSearchParams({
      origin_lat: originLat.toString(),
      origin_lng: originLng.toString(),
      origin_label: originLabel,
      vehicle_type: vehicleType,
      duration_days: durationDays.toString(),
    });
    router.push(`/trip/recommendations?${queryParams.toString()}`);
  };
  return /*#__PURE__*/ React.createElement(
    "form",
    {
      onSubmit: handleSubmit,
      className:
        "p-6 md:p-8 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-6",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "space-y-2",
      },
      /*#__PURE__*/ React.createElement(
        "label",
        {
          className:
            "text-xs font-bold text-slate-800 uppercase tracking-wider block",
        },
        "1. Starting Location / City Hub",
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "flex gap-2",
        },
        /*#__PURE__*/ React.createElement(_input.Input, {
          value: originLabel,
          onChange: (e) => setOriginLabel(e.target.value),
          placeholder: "Enter starting city (e.g. Bhopal, Indore, Jabalpur)",
          required: true,
          className: "font-medium",
        }),
        /*#__PURE__*/ React.createElement(
          _button.Button,
          {
            type: "button",
            variant: "outline",
            size: "md",
            onClick: requestLocationPermission,
            title: "Use Device GPS",
            className: "shrink-0",
          },
          "\uD83D\uDCCD GPS",
        ),
      ),
    ),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "space-y-2",
      },
      /*#__PURE__*/ React.createElement(
        "label",
        {
          className:
            "text-xs font-bold text-slate-800 uppercase tracking-wider block",
        },
        "2. Travel Vehicle Preference",
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
        },
        vehicles.map((v) =>
          /*#__PURE__*/ React.createElement(
            "button",
            {
              key: v.type,
              type: "button",
              onClick: () => setVehicleType(v.type),
              className: `p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${vehicleType === v.type ? "border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs" : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"}`,
            },
            /*#__PURE__*/ React.createElement(
              "div",
              {
                className: "text-2xl mb-1",
              },
              v.icon,
            ),
            /*#__PURE__*/ React.createElement(
              "div",
              null,
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "text-xs font-bold text-slate-900",
                },
                v.label,
              ),
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "text-[10px] text-slate-500 mt-0.5 leading-tight",
                },
                v.desc,
              ),
            ),
          ),
        ),
      ),
    ),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "space-y-2",
      },
      /*#__PURE__*/ React.createElement(
        "label",
        {
          className:
            "text-xs font-bold text-slate-800 uppercase tracking-wider block",
        },
        "3. Trip Duration (Days)",
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "flex items-center gap-3",
        },
        [1, 2, 3, 4, 5].map((d) =>
          /*#__PURE__*/ React.createElement(
            "button",
            {
              key: d,
              type: "button",
              onClick: () => setDurationDays(d),
              className: `flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${durationDays === d ? "bg-emerald-600 border-emerald-600 text-white shadow-sm" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"}`,
            },
            d,
            " Day",
            d > 1 ? "s" : "",
          ),
        ),
      ),
    ),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "pt-3",
      },
      /*#__PURE__*/ React.createElement(
        _button.Button,
        {
          type: "submit",
          size: "lg",
          variant: "primary",
          isLoading: isLoading,
          className: "w-full text-base font-bold",
        },
        /*#__PURE__*/ React.createElement(
          "span",
          null,
          "\u2728 Discover AI Ranked Destinations",
        ),
      ),
    ),
  );
}
