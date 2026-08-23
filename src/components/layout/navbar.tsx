"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle"; // 1. Import the toggle

export function Navbar() {
  const {
    user,
    signInWithGoogle,
    signOut,
    userLocation,
    requestLocationPermission,
  } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white text-lg font-black shadow-sm group-hover:scale-105 transition-transform">
              YS
            </div>
            <div>
              {/* 3. Text color adapts to dark mode */}
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                Yatra
                <span className="text-emerald-600 dark:text-emerald-500">
                  Setu
                </span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-700 px-1.5 py-0.2 rounded ml-1.5">
                SIH MVP
              </span>
            </div>
          </Link>

          {/* 4. Desktop navigation text adapts */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Link
              href="/trip"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Plan Trip
            </Link>
            <Link
              href="/community"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Community Feed
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* 5. INSERTED THEME TOGGLE HERE */}
          <ThemeToggle />

          {userLocation && (
            <button
              onClick={requestLocationPermission}
              title="Click to refresh GPS location"
              className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-full transition-colors"
            >
              <span className="text-emerald-600 dark:text-emerald-400">📍</span>
              <span className="max-w-[150px] truncate font-medium">
                {userLocation.label}
              </span>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <Avatar src={user.avatar_url} name={user.name} size="sm" />
                <span className="hidden sm:inline">
                  {user.name.split(" ")[0]}
                </span>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={signInWithGoogle}
              className="gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </Button>
          )}

          {/* 6. Mobile menu button adapts to dark mode */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        // 7. Mobile dropdown menu adapts to dark mode
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2">
          <Link
            href="/trip"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Plan Trip
          </Link>
          <Link
            href="/community"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Community Feed
          </Link>
          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Profile
          </Link>
        </div>
      )}
    </header>
  );
}
