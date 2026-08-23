"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.Footer = Footer;
var _link = _interopRequireDefault(require("next/link"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function Footer() {
  return /*#__PURE__*/ React.createElement(
    "footer",
    {
      className: "border-t border-slate-200 bg-slate-50 text-slate-600 text-sm",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "grid grid-cols-1 md:grid-cols-4 gap-8 mb-8",
        },
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "md:col-span-2 space-y-3",
          },
          /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "flex items-center gap-2",
            },
            /*#__PURE__*/ React.createElement(
              "div",
              {
                className:
                  "w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-sm font-black",
              },
              "YS",
            ),
            /*#__PURE__*/ React.createElement(
              "span",
              {
                className: "text-lg font-black text-slate-900",
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
          ),
          /*#__PURE__*/ React.createElement(
            "p",
            {
              className: "text-xs text-slate-500 max-w-sm leading-relaxed",
            },
            "Unified tourism discovery, vehicle-aware route intelligence, nearby emergency services, and AI recommendations for seamless Indian road journeys.",
          ),
          /*#__PURE__*/ React.createElement(
            "p",
            {
              className: "text-[11px] text-slate-400",
            },
            "Data Freshness Policy: Live Google Maps/Places API with verified regional fallback. Factual infrastructure data is strictly verified and never synthetic.",
          ),
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          null,
          /*#__PURE__*/ React.createElement(
            "h4",
            {
              className:
                "text-xs font-bold uppercase tracking-wider text-slate-900 mb-3",
            },
            "Quick Navigation",
          ),
          /*#__PURE__*/ React.createElement(
            "ul",
            {
              className: "space-y-2 text-xs",
            },
            /*#__PURE__*/ React.createElement(
              "li",
              null,
              /*#__PURE__*/ React.createElement(
                _link.default,
                {
                  href: "/trip",
                  className: "hover:text-emerald-600",
                },
                "Start Planning",
              ),
            ),
            /*#__PURE__*/ React.createElement(
              "li",
              null,
              /*#__PURE__*/ React.createElement(
                _link.default,
                {
                  href: "/community",
                  className: "hover:text-emerald-600",
                },
                "Community Feed",
              ),
            ),
            /*#__PURE__*/ React.createElement(
              "li",
              null,
              /*#__PURE__*/ React.createElement(
                _link.default,
                {
                  href: "/profile",
                  className: "hover:text-emerald-600",
                },
                "Traveler Profile",
              ),
            ),
          ),
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          null,
          /*#__PURE__*/ React.createElement(
            "h4",
            {
              className:
                "text-xs font-bold uppercase tracking-wider text-slate-900 mb-3",
            },
            "Key Focus",
          ),
          /*#__PURE__*/ React.createElement(
            "ul",
            {
              className: "space-y-2 text-xs text-slate-500",
            },
            /*#__PURE__*/ React.createElement(
              "li",
              null,
              "100 km Radius Optimization",
            ),
            /*#__PURE__*/ React.createElement(
              "li",
              null,
              "Emergency Support (Fuel/Mechanic/Hospital)",
            ),
            /*#__PURE__*/ React.createElement(
              "li",
              null,
              "Road & Terrain Safety Alerts",
            ),
            /*#__PURE__*/ React.createElement(
              "li",
              null,
              "Multi-Category Community Reviews",
            ),
          ),
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className:
            "border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3",
        },
        /*#__PURE__*/ React.createElement(
          "p",
          null,
          "\xA9 ",
          new Date().getFullYear(),
          " YatraSetu. Built for Smart India Hackathon (SIH).",
        ),
        /*#__PURE__*/ React.createElement(
          "p",
          null,
          "Version 1.0 Production Baseline",
        ),
      ),
    ),
  );
}
