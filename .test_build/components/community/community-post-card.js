"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.CommunityPostCard = CommunityPostCard;
var React = _interopRequireWildcard(require("react"));
var _link = _interopRequireDefault(require("next/link"));
var _avatar = require("@/components/ui/avatar");
var _button = require("@/components/ui/button");
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
function CommunityPostCard({ post, onAddComment }) {
  const [showComments, setShowComments] = React.useState(false);
  const [commentText, setCommentText] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [likes, setLikes] = React.useState(post.popularity_score);
  const [hasLiked, setHasLiked] = React.useState(false);
  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !onAddComment) return;
    setIsSubmitting(true);
    try {
      await onAddComment(post.id, commentText.trim());
      setCommentText("");
    } finally {
      setIsSubmitting(false);
    }
  };
  const dateFormatted = new Date(post.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className:
        "rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-4",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "flex items-center justify-between",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "flex items-center gap-3",
        },
        /*#__PURE__*/ React.createElement(_avatar.Avatar, {
          src: post.user_avatar,
          name: post.user_name || "Traveler",
          size: "md",
        }),
        /*#__PURE__*/ React.createElement(
          "div",
          null,
          /*#__PURE__*/ React.createElement(
            "h4",
            {
              className: "text-sm font-bold text-slate-900",
            },
            post.user_name || "Fellow Traveler",
          ),
          /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "flex items-center gap-2 text-xs text-slate-400",
            },
            post.destination_name &&
              /*#__PURE__*/ React.createElement(
                "span",
                {
                  className: "text-emerald-700 font-semibold",
                },
                "\uD83D\uDCCD ",
                post.destination_name,
              ),
            /*#__PURE__*/ React.createElement("span", null, "\u2022"),
            /*#__PURE__*/ React.createElement("span", null, dateFormatted),
          ),
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "button",
        {
          onClick: handleLike,
          className: `flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${hasLiked ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`,
        },
        /*#__PURE__*/ React.createElement("span", null, "\u2764\uFE0F"),
        /*#__PURE__*/ React.createElement("span", null, likes),
      ),
    ),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "space-y-2",
      },
      /*#__PURE__*/ React.createElement(
        _link.default,
        {
          href: `/community/${post.id}`,
          className: "group block",
        },
        /*#__PURE__*/ React.createElement(
          "h3",
          {
            className:
              "text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors",
          },
          post.title,
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "p",
        {
          className:
            "text-sm text-slate-700 leading-relaxed whitespace-pre-line line-clamp-3",
        },
        post.body,
      ),
    ),
    post.images &&
      post.images.length > 0 &&
      /*#__PURE__*/ React.createElement(
        _link.default,
        {
          href: `/community/${post.id}`,
          className:
            "block rounded-xl overflow-hidden max-h-72 border border-slate-200 bg-slate-100",
        },
        /*#__PURE__*/ React.createElement("img", {
          src: post.images[0].storage_path,
          alt: post.title,
          className:
            "w-full h-full object-cover hover:scale-102 transition-transform duration-200",
        }),
      ),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className:
          "pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500",
      },
      /*#__PURE__*/ React.createElement(
        "button",
        {
          onClick: () => setShowComments(!showComments),
          className:
            "font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5",
        },
        /*#__PURE__*/ React.createElement("span", null, "\uD83D\uDCAC"),
        /*#__PURE__*/ React.createElement(
          "span",
          null,
          post.comments?.length || post.comments_count || 0,
          " Comments",
          " ",
          showComments ? "▲" : "▼",
        ),
      ),
      /*#__PURE__*/ React.createElement(
        _link.default,
        {
          href: `/community/${post.id}`,
          className:
            "font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition-colors",
        },
        /*#__PURE__*/ React.createElement(
          "span",
          null,
          "View Discussion \u2192",
        ),
      ),
    ),
    showComments &&
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className:
            "pt-3 border-t border-slate-100 space-y-3 bg-slate-50 p-4 rounded-xl",
        },
        post.comments && post.comments.length > 0
          ? /*#__PURE__*/ React.createElement(
              "div",
              {
                className: "space-y-2.5",
              },
              post.comments.map((c) =>
                /*#__PURE__*/ React.createElement(
                  "div",
                  {
                    key: c.id,
                    className:
                      "text-xs bg-white p-3 rounded-lg border border-slate-200 space-y-1",
                  },
                  /*#__PURE__*/ React.createElement(
                    "div",
                    {
                      className:
                        "flex items-center justify-between font-bold text-slate-900",
                    },
                    /*#__PURE__*/ React.createElement(
                      "span",
                      null,
                      c.user_name || "Traveler",
                    ),
                    /*#__PURE__*/ React.createElement(
                      "span",
                      {
                        className: "text-[10px] text-slate-400 font-normal",
                      },
                      new Date(c.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    ),
                  ),
                  /*#__PURE__*/ React.createElement(
                    "p",
                    {
                      className: "text-slate-700",
                    },
                    c.body,
                  ),
                ),
              ),
            )
          : /*#__PURE__*/ React.createElement(
              "p",
              {
                className: "text-xs text-slate-400 italic",
              },
              "No comments yet. Start the conversation!",
            ),
        onAddComment &&
          /*#__PURE__*/ React.createElement(
            "form",
            {
              onSubmit: handleCommentSubmit,
              className: "flex gap-2 pt-1",
            },
            /*#__PURE__*/ React.createElement("input", {
              type: "text",
              value: commentText,
              onChange: (e) => setCommentText(e.target.value),
              placeholder: "Write a helpful reply...",
              className:
                "flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500",
            }),
            /*#__PURE__*/ React.createElement(
              _button.Button,
              {
                type: "submit",
                size: "sm",
                variant: "primary",
                isLoading: isSubmitting,
              },
              "Reply",
            ),
          ),
      ),
  );
}
