"use client";

import React, { useState, useEffect } from "react";

export function InitialLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fading out slightly before removing the loader from the DOM
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 900); // Triggers fade at 0.9s

    const removeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1300); // Fully removes at 1.3s

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isLoading) return <>{children}</>;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-500 ease-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center space-y-6 animate-pulse">
        {/* Animated Logo Container with Emerald Gradient */}
        <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-xl shadow-emerald-950/50">
          <span className="text-3xl font-black tracking-wider text-white">
            YS
          </span>
          {/* Spinning decorative ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-emerald-300/40 border-t-transparent animate-spin" />
        </div>

        {/* Animated Brand Name */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Yatra<span className="text-emerald-400">Setu</span>
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            Travel Intelligence Platform
          </p>
        </div>
      </div>
    </div>
  );
}
