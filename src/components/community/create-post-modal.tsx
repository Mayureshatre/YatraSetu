"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-context";
import { Destination, POST_CATEGORIES, PostCategory } from "@/types";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinations: Destination[];
  preselectedDestinationId?: string;
  onPostCreated: () => void;
}

export function CreatePostModal({
  isOpen,
  onClose,
  destinations,
  preselectedDestinationId,
  onPostCreated,
}: CreatePostModalProps) {
  const { user } = useAuth();

  // Destination State
  const [destinationId, setDestinationId] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Form State
  const [category, setCategory] =
    React.useState<PostCategory>("Travel Experience");
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Initialize selected destination
  React.useEffect(() => {
    if (preselectedDestinationId) {
      setDestinationId(preselectedDestinationId);
      const dest = destinations.find((d) => d.id === preselectedDestinationId);
      if (dest) setSearchTerm(dest.name);
    } else {
      setDestinationId("");
      setSearchTerm("");
    }
  }, [preselectedDestinationId, destinations]);

  // Handle clicking outside the dropdown to close it
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        const selected = destinations.find((d) => d.id === destinationId);
        if (selected) setSearchTerm(selected.name);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [destinationId, destinations]);

  // Filter destinations based on user typing
  const filteredDestinations = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let targetDestinationId = destinationId;
    if (!targetDestinationId && searchTerm.trim()) {
      const matched = destinations.find(
        (d) => d.name.toLowerCase() === searchTerm.trim().toLowerCase(),
      );
      if (matched) {
        targetDestinationId = matched.id;
      }
    }

    if (!targetDestinationId) {
      setError("Please select a valid destination from the dropdown list.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/destinations/${targetDestinationId}/posts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            destination_id: targetDestinationId, // <-- Added this field to satisfy the Zod/backend validation
            title: title.trim(),
            body: body.trim(),
            category,
            image_url: imageUrl.trim() || undefined,
            user_id: user?.id || "traveler-user-01",
            user_name: user?.name || "Explorer",
            user_avatar: user?.avatar_url,
          }),
        },
      );

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error?.message || "Failed to publish post");
      }

      onPostCreated();
      setTitle("");
      setBody("");
      setImageUrl("");
      setDestinationId("");
      setSearchTerm("");
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Community Discussion Post"
      description="Share authentic road experiences, ask route questions, or report live travel conditions."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 overflow-visible">
        {error && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 p-2.5 rounded-lg font-medium border border-emerald-200 dark:border-emerald-800">
            ⚠️ {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Custom Searchable Destination Selector */}
          <div className="relative" ref={dropdownRef}>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Destination / Corridor
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
                setDestinationId("");
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-2.5 text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500"
              placeholder="Search destinations..."
            />

            {/* Floating Dropdown List */}
            {isDropdownOpen && (
              <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto overscroll-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl">
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map((d) => (
                    <li
                      key={d.id}
                      onClick={() => {
                        setDestinationId(d.id);
                        setSearchTerm(d.name);
                        setIsDropdownOpen(false);
                      }}
                      className="cursor-pointer px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0"
                    >
                      {d.name}{" "}
                      <span className="text-slate-400 dark:text-slate-500 font-normal block sm:inline sm:ml-1 text-[10px] sm:text-xs">
                        ({d.category})
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                    No destinations found.
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Category Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Post Category / Tag
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-2.5 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
            >
              {POST_CATEGORIES.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                >
                  🏷️ {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Headline / Discussion Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Best morning route from Jabalpur to Bhedaghat avoiding city traffic"
          required
        />

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Discussion Body & Travel Details
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="Share specific road surface notes, scenic stops, parking advice, or ask questions to the community..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <Input
          label="Photo Image URL (Optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://images.unsplash.com/..."
        />

        <div className="pt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            disabled={!destinationId}
          >
            Publish Discussion
          </Button>
        </div>
      </form>
    </Modal>
  );
}
