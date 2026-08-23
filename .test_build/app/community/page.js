"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = CommunityFeedPage;
var React = _interopRequireWildcard(require("react"));
var _communityPostCard = require("@/components/community/community-post-card");
var _createPostModal = require("@/components/community/create-post-modal");
var _button = require("@/components/ui/button");
var _skeleton = require("@/components/ui/skeleton");
var _errorState = require("@/components/ui/error-state");
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
function CommunityFeedPage() {
  const [posts, setPosts] = React.useState([]);
  const [destinations, setDestinations] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const loadFeed = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [destRes, postsRes] = await Promise.all([
        fetch("/api/destinations"),
        fetch(
          "/api/destinations/a1111111-1111-1111-1111-111111111111/community",
        ),
      ]);
      if (destRes.ok) {
        const destJson = await destRes.json();
        setDestinations(destJson.data);
      }
      if (postsRes.ok) {
        const pJson = await postsRes.json();
        setPosts(pJson.data.posts || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);
  React.useEffect(() => {
    loadFeed();
  }, [loadFeed]);
  const handleAddComment = async (postId, text) => {
    await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: text,
      }),
    });
    loadFeed();
  };
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8",
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className:
          "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        null,
        /*#__PURE__*/ React.createElement(
          "span",
          {
            className:
              "text-xs font-bold uppercase tracking-wider text-emerald-600",
          },
          "Traveler Network",
        ),
        /*#__PURE__*/ React.createElement(
          "h1",
          {
            className:
              "text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1",
          },
          "Community Experiences & Road Intel",
        ),
        /*#__PURE__*/ React.createElement(
          "p",
          {
            className: "text-xs text-slate-500 mt-1",
          },
          "Popular-first traveler stories, live road condition updates, and photography.",
        ),
      ),
      /*#__PURE__*/ React.createElement(
        _button.Button,
        {
          variant: "primary",
          size: "md",
          onClick: () => setShowCreateModal(true),
          className: "gap-1.5",
        },
        /*#__PURE__*/ React.createElement("span", null, "+"),
        /*#__PURE__*/ React.createElement("span", null, "Share Your Story"),
      ),
    ),
    isLoading &&
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "space-y-4",
        },
        /*#__PURE__*/ React.createElement(_skeleton.Skeleton, {
          className: "h-44 w-full rounded-2xl",
        }),
        /*#__PURE__*/ React.createElement(_skeleton.Skeleton, {
          className: "h-44 w-full rounded-2xl",
        }),
      ),
    error &&
      !isLoading &&
      /*#__PURE__*/ React.createElement(_errorState.ErrorState, {
        title: "Could not load community feed",
        message: error,
        onRetry: loadFeed,
      }),
    !isLoading &&
      !error &&
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "space-y-6",
        },
        posts.map((post) =>
          /*#__PURE__*/ React.createElement(
            _communityPostCard.CommunityPostCard,
            {
              key: post.id,
              post: post,
              onAddComment: handleAddComment,
            },
          ),
        ),
      ),
    /*#__PURE__*/ React.createElement(_createPostModal.CreatePostModal, {
      isOpen: showCreateModal,
      onClose: () => setShowCreateModal(false),
      destinations: destinations,
      onPostCreated: loadFeed,
    }),
  );
}
