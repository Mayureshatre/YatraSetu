"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TripSetupForm } from "@/components/trip/trip-setup-form";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 bg-slate-950 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(3, 7, 18, 0.75), rgba(15, 23, 42, 0.65), rgba(2, 6, 23, 0.75)), url('https://www.pixelstalk.net/wp-content/uploads/2016/04/Desktop-landscape-wallpaper-HD-1.jpg')`,
        }}
      >
        {/* Radial Pattern Grid */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:24px_24px] z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Pillars */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
              <span>🚀</span>
              <span>Unified Travel Discovery & Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Every road trip, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">
                AI-ranked & route-ready.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Stop switching between maps, review sites, and local listings.
              Discover top destinations within 100 km of any starting location,
              verified fuel & mechanics, live road safety, and personalized AI
              itineraries.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-left">
              <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-slate-800/40 border border-white/10 dark:border-slate-700 backdrop-blur-xs">
                <div className="text-xl mb-1">📍</div>
                <div className="text-xs font-bold text-white">
                  Dynamic 100 km Radius
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Calculated from your exact origin
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-slate-800/40 border border-white/10 dark:border-slate-700 backdrop-blur-xs">
                <div className="text-xl mb-1">🚨</div>
                <div className="text-xs font-bold text-white">
                  Emergency Services
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Fuel, Mechanics, Hospitals
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-slate-800/40 border border-white/10 dark:border-slate-700 backdrop-blur-xs col-span-2 sm:col-span-1">
                <div className="text-xl mb-1">🤖</div>
                <div className="text-xs font-bold text-white">
                  Vehicle-Aware AI
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Match scores & itineraries
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Trip Setup Form */}
          <div className="lg:col-span-5">
            <TripSetupForm />
          </div>
        </div>
      </section>

      {/* Featured Destination Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Explore Highlights & Hidden Gems
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              Popular Tourist Landmarks in Madhya Pradesh
            </h2>
          </div>
          <Link href="/trip">
            <Button variant="outline" size="sm" className="font-bold">
              Explore All Destinations →
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Pachmarhi (Queen of Satpura)",
              category: "Hill Station & Nature",
              img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
              score: 96,
              highlight: "Waterfalls & Dhoopgarh Sunset",
              id: "a1111111-1111-1111-1111-111111111111",
            },
            {
              name: "Sanchi Stupa & Monastic Caves",
              category: "UNESCO World Heritage",
              img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
              score: 95,
              highlight: "3rd Century BCE Buddhist Relics",
              id: "c3333333-3333-3333-3333-333333333333",
            },
            {
              name: "Bhedaghat Marble Rocks & Falls",
              category: "Geological Gorge & River",
              img: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=600&q=80",
              score: 93,
              highlight: "Dhuandhar Falls & Gorge Boating",
              id: "e5555555-5555-5555-5555-555555555555",
            },
          ].map((d) => (
            <Link
              key={d.id}
              href={`/destinations/${d.id}`}
              className="group block"
            >
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200">
                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <img
                    src={d.img}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-emerald-600 dark:bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                    {d.score}% Match
                  </div>
                </div>
                <div className="p-4 space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {d.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {d.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    ✨ {d.highlight}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
