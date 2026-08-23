import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 dark:bg-emerald-700 flex items-center justify-center text-white text-sm font-black">
                YS
              </div>
              <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                Yatra
                <span className="text-emerald-600 dark:text-emerald-500">
                  Setu
                </span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Unified tourism discovery, vehicle-aware route intelligence,
              nearby emergency services, and AI recommendations for seamless
              Indian road journeys.
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Data Freshness Policy: Live Google Maps/Places API with verified
              regional fallback. Factual infrastructure data is strictly
              verified and never synthetic.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/trip"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Start Planning
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Community Feed
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Traveler Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Key Focus
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>100 km Radius Optimization</li>
              <li>Emergency Support (Fuel/Mechanic/Hospital)</li>
              <li>Road & Terrain Safety Alerts</li>
              <li>Multi-Category Community Reviews</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-3">
          <p>
            © {new Date().getFullYear()} YatraSetu. Built for Smart India
            Hackathon (SIH).
          </p>
          <p>Version 1.0 Production Baseline</p>
        </div>
      </div>
    </footer>
  );
}
