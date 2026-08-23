"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.CreatePostModal = CreatePostModal;
var React = _interopRequireWildcard(require("react"));
var _modal = require("@/components/ui/modal");
var _button = require("@/components/ui/button");
var _input = require("@/components/ui/input");
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
function CreatePostModal({
  isOpen,
  onClose,
  destinations,
  preselectedDestinationId,
  onPostCreated,
}) {
  const { user } = (0, _authContext.useAuth)();
  const [destinationId, setDestinationId] = React.useState(
    preselectedDestinationId || (destinations[0]?.id ?? ""),
  );
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    if (preselectedDestinationId) {
      setDestinationId(preselectedDestinationId);
    } else if (destinations.length > 0 && !destinationId) {
      setDestinationId(destinations[0].id);
    }
  }, [preselectedDestinationId, destinations]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/destinations/${destinationId}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          image_url: imageUrl.trim() || undefined,
          user_id: user?.id || "traveler-anon",
          user_name: user?.name || "Explorer",
          user_avatar: user?.avatar_url,
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error?.message || "Failed to publish post");
      }
      onPostCreated();
      setTitle("");
      setBody("");
      setImageUrl("");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return /*#__PURE__*/ React.createElement(
    _modal.Modal,
    {
      isOpen: isOpen,
      onClose: onClose,
      title: "Share Traveler Experience",
      description:
        "Contribute field tips, road conditions, and photos to the community.",
      maxWidth: "lg",
    },
    /*#__PURE__*/ React.createElement(
      "form",
      {
        onSubmit: handleSubmit,
        className: "space-y-4",
      },
      error &&
        /*#__PURE__*/ React.createElement(
          "p",
          {
            className:
              "text-xs text-emerald-600 bg-emerald-50 p-2.5 rounded-lg",
          },
          error,
        ),
      /*#__PURE__*/ React.createElement(
        "div",
        null,
        /*#__PURE__*/ React.createElement(
          "label",
          {
            className: "text-xs font-bold text-slate-700 block mb-1",
          },
          "Select Destination",
        ),
        /*#__PURE__*/ React.createElement(
          "select",
          {
            value: destinationId,
            onChange: (e) => setDestinationId(e.target.value),
            className:
              "w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500",
          },
          destinations.map((d) =>
            /*#__PURE__*/ React.createElement(
              "option",
              {
                key: d.id,
                value: d.id,
              },
              d.name,
              " (",
              d.category,
              ")",
            ),
          ),
        ),
      ),
      /*#__PURE__*/ React.createElement(_input.Input, {
        label: "Post Title / Headline",
        value: title,
        onChange: (e) => setTitle(e.target.value),
        placeholder: "e.g. Best sunset point & monsoon road conditions",
        required: true,
      }),
      /*#__PURE__*/ React.createElement(
        "div",
        null,
        /*#__PURE__*/ React.createElement(
          "label",
          {
            className: "text-xs font-bold text-slate-700 block mb-1",
          },
          "Story / Road Experience Details",
        ),
        /*#__PURE__*/ React.createElement("textarea", {
          value: body,
          onChange: (e) => setBody(e.target.value),
          rows: 4,
          placeholder:
            "Share useful tips about road conditions, local eateries, parking, or safety advice...",
          className:
            "w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500",
          required: true,
        }),
      ),
      /*#__PURE__*/ React.createElement(_input.Input, {
        label: "Photo Image URL (Optional)",
        value: imageUrl,
        onChange: (e) => setImageUrl(e.target.value),
        placeholder: "https://images.unsplash.com/...",
      }),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "pt-2 flex justify-end gap-2",
        },
        /*#__PURE__*/ React.createElement(
          _button.Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: onClose,
          },
          "Cancel",
        ),
        /*#__PURE__*/ React.createElement(
          _button.Button,
          {
            type: "submit",
            variant: "primary",
            size: "sm",
            isLoading: isSubmitting,
          },
          "Publish to Community",
        ),
      ),
    ),
  );
}
