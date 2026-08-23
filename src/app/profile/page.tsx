"use client";

import * as React from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";

export default function ProfilePage() {
  const {
    user,
    signOut,
    signInWithGoogle,
    userLocation,
    requestLocationPermission,
  } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-4xl">🔐</div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Sign In to YatraSetu
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sign in with your Google Account to manage trips, write reviews, and
          share community posts.
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={signInWithGoogle}
          className="w-full"
        >
          Sign in with Google
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-4">
            <Avatar src={user.avatar_url} name={user.name} size="lg" />
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {user.name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.email}
              </p>
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                Verified Google Account
              </span>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={signOut}>
            Sign Out
          </Button>
        </div>

        {/* Location Preferences */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Active Location Anchor
          </h3>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
              <span>📍</span>
              <span className="font-semibold">
                {userLocation?.label || "Bhopal, Madhya Pradesh (Default)"}
              </span>
            </div>
            <Button
              variant="subtle"
              size="sm"
              onClick={requestLocationPermission}
              className="text-xs"
            >
              Update GPS
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link href="/trip" className="flex-1">
            <Button variant="primary" size="md" className="w-full">
              Plan New Trip →
            </Button>
          </Link>
          <Link href="/community" className="flex-1">
            <Button variant="outline" size="md" className="w-full">
              Explore Community Feed
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
