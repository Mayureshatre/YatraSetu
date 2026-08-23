"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = PostDetailPage;
var React = _interopRequireWildcard(require("react"));
var _navigation = require("next/navigation");
var _link = _interopRequireDefault(require("next/link"));
var _avatar = require("@/components/ui/avatar");
var _button = require("@/components/ui/button");
var _skeleton = require("@/components/ui/skeleton");
var _errorState = require("@/components/ui/error-state");
var _authContext = require("@/lib/auth/auth-context");
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
function PostDetailPage() {
  const params = (0, _navigation.useParams)();
  const router = (0, _navigation.useRouter)();
  const { user } = (0, _authContext.useAuth)();
  const postId = params.id;
  const [post, setPost] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [commentText, setCommentText] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [likes, setLikes] = React.useState(0);
  const [hasLiked, setHasLiked] = React.useState(false);
  const loadPost = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${postId}`);
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error?.message || "Post not found");
      }
      const json = await res.json();
      setPost(json.data);
      setLikes(json.data.popularity_score || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);
  React.useEffect(() => {
    loadPost();
  }, [loadPost]);
  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: commentText.trim(),
          user_id: user?.id || "traveler-anon",
          user_name: user?.name || "Fellow Traveler",
          user_avatar: user?.avatar_url,
        }),
      });
      if (res.ok) {
        setCommentText("");
        await loadPost();
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6",
      },
      /*#__PURE__*/ React.createElement(_skeleton.Skeleton, {
        className: "h-6 w-32 rounded-lg",
      }),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className:
            "rounded-3xl border border-slate-200 bg-white p-6 space-y-4",
        },
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "flex items-center gap-3",
          },
          /*#__PURE__*/ React.createElement(_skeleton.Skeleton, {
            className: "h-12 w-12 rounded-full",
          }),
          /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "space-y-2",
            },
            /*#__PURE__*/ React.createElement(_skeleton.Skeleton, {
              className: "h-4 w-36",
            }),
            /*#__PURE__*/ React.createElement(_skeleton.Skeleton, {
              className: "h-3 w-24",
            }),
          ),
        ),
        /*#__PURE__*/ React.createElement(_skeleton.Skeleton, {
          className: "h-8 w-3/4",
        }),
        /*#__PURE__*/ React.createElement(_skeleton.Skeleton, {
          className: "h-24 w-full",
        }),
        /*#__PURE__*/ React.createElement(_skeleton.Skeleton, {
          className: "h-64 w-full rounded-2xl",
        }),
      ),
    );
  }
  if (error || !post) {
    return /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "max-w-3xl mx-auto px-4 py-16",
      },
      /*#__PURE__*/ React.createElement(_errorState.ErrorState, {
        title: "Could not load community post",
        message:
          error || "The requested post was not found or has been removed.",
        onRetry: loadPost,
      }),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "mt-4 text-center",
        },
        /*#__PURE__*/ React.createElement(
          _link.default,
          {
            href: "/community",
          },
          /*#__PURE__*/ React.createElement(
            _button.Button,
            {
              variant: "outline",
              size: "sm",
            },
            "\u2190 Return to Community Feed",
          ),
        ),
      ),
    );
  }
  const dateFormatted = new Date(post.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "flex items-center justify-between",
      },
      /*#__PURE__*/ React.createElement(
        _link.default,
        {
          href: "/community",
          className:
            "text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 transition-colors",
        },
        /*#__PURE__*/ React.createElement("span", null, "\u2190"),
        /*#__PURE__*/ React.createElement(
          "span",
          null,
          "Back to Community Feed",
        ),
      ),
      post.destination_id &&
        /*#__PURE__*/ React.createElement(
          _link.default,
          {
            href: `/destinations/${post.destination_id}`,
          },
          /*#__PURE__*/ React.createElement(
            "span",
            {
              className:
                "inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors",
            },
            "\uD83D\uDCCD View Destination",
          ),
        ),
    ),
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
            "flex items-center justify-between pb-4 border-b border-slate-100",
        },
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "flex items-center gap-3.5",
          },
          /*#__PURE__*/ React.createElement(_avatar.Avatar, {
            src: post.user_avatar,
            name: post.user_name || "Traveler",
            size: "lg",
          }),
          /*#__PURE__*/ React.createElement(
            "div",
            null,
            /*#__PURE__*/ React.createElement(
              "h3",
              {
                className: "text-base font-bold text-slate-900",
              },
              post.user_name || "Fellow Traveler",
            ),
            /*#__PURE__*/ React.createElement(
              "div",
              {
                className: "flex items-center gap-2 text-xs text-slate-500",
              },
              post.destination_name &&
                /*#__PURE__*/ React.createElement(
                  "span",
                  {
                    className: "font-semibold text-emerald-700",
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
            className: `flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${hasLiked ? "bg-emerald-50 text-emerald-700 border border-emerald-200 scale-105" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`,
          },
          /*#__PURE__*/ React.createElement("span", null, "\u2764\uFE0F"),
          /*#__PURE__*/ React.createElement(
            "span",
            null,
            likes,
            " ",
            likes === 1 ? "Endorsement" : "Endorsements",
          ),
        ),
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "space-y-4",
        },
        /*#__PURE__*/ React.createElement(
          "h1",
          {
            className:
              "text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight",
          },
          post.title,
        ),
        /*#__PURE__*/ React.createElement(
          "p",
          {
            className:
              "text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line",
          },
          post.body,
        ),
      ),
      post.images &&
        post.images.length > 0 &&
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "space-y-2 pt-2",
          },
          /*#__PURE__*/ React.createElement(
            "h4",
            {
              className:
                "text-xs font-bold uppercase tracking-wider text-slate-400",
            },
            "Attached Photos",
          ),
          /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
            },
            post.images.map((img) =>
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  key: img.id,
                  className:
                    "rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-80 shadow-xs",
                },
                /*#__PURE__*/ React.createElement("img", {
                  src: img.storage_path,
                  alt: post.title,
                  className:
                    "w-full h-full object-cover hover:scale-102 transition-transform duration-200",
                }),
              ),
            ),
          ),
        ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "pt-6 border-t border-slate-200 space-y-6",
        },
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "flex items-center justify-between",
          },
          /*#__PURE__*/ React.createElement(
            "h3",
            {
              className: "text-lg font-bold text-slate-900",
            },
            "Community Responses (",
            post.comments?.length || post.comments_count || 0,
            ")",
          ),
        ),
        /*#__PURE__*/ React.createElement(
          "form",
          {
            onSubmit: handleCommentSubmit,
            className:
              "space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200",
          },
          /*#__PURE__*/ React.createElement(
            "label",
            {
              className: "text-xs font-bold text-slate-700 block",
            },
            "Join the discussion / reply",
          ),
          /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "flex gap-2",
            },
            /*#__PURE__*/ React.createElement("input", {
              type: "text",
              value: commentText,
              onChange: (e) => setCommentText(e.target.value),
              placeholder:
                "Share your experience or ask a question about this route...",
              className:
                "flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500",
              required: true,
            }),
            /*#__PURE__*/ React.createElement(
              _button.Button,
              {
                type: "submit",
                size: "sm",
                variant: "primary",
                isLoading: isSubmitting,
              },
              "Post Reply",
            ),
          ),
        ),
        post.comments && post.comments.length > 0
          ? /*#__PURE__*/ React.createElement(
              "div",
              {
                className: "space-y-3",
              },
              post.comments.map((c) =>
                /*#__PURE__*/ React.createElement(
                  "div",
                  {
                    key: c.id,
                    className:
                      "p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5",
                  },
                  /*#__PURE__*/ React.createElement(
                    "div",
                    {
                      className: "flex items-center justify-between",
                    },
                    /*#__PURE__*/ React.createElement(
                      "div",
                      {
                        className: "flex items-center gap-2",
                      },
                      /*#__PURE__*/ React.createElement(_avatar.Avatar, {
                        src: c.user_avatar,
                        name: c.user_name || "Traveler",
                        size: "sm",
                      }),
                      /*#__PURE__*/ React.createElement(
                        "span",
                        {
                          className: "text-xs font-bold text-slate-900",
                        },
                        c.user_name || "Fellow Traveler",
                      ),
                    ),
                    /*#__PURE__*/ React.createElement(
                      "span",
                      {
                        className: "text-[10px] text-slate-400",
                      },
                      new Date(c.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    ),
                  ),
                  /*#__PURE__*/ React.createElement(
                    "p",
                    {
                      className: "text-xs text-slate-700 pl-8 leading-relaxed",
                    },
                    c.body,
                  ),
                ),
              ),
            )
          : /*#__PURE__*/ React.createElement(
              "p",
              {
                className: "text-xs text-slate-400 italic text-center py-6",
              },
              "No replies yet. Be the first to leave a comment!",
            ),
      ),
    ),
  );
}
