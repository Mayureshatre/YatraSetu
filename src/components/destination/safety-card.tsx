import * as React from "react";

interface SafetyCardProps {
  roadCondition?: string | null;
  safetyTips?: string[];
}

export function SafetyCard({
  roadCondition,
  safetyTips = [],
}: SafetyCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 md:p-6 space-y-4 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/50">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>🛡️</span> Road & Travel Safety Intelligence
        </h3>
        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
          Verified Field Intel
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Current Road & Terrain Condition
          </h4>
          <p className="text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed font-medium">
            {roadCondition ||
              "Well-paved state highway with standard tarmac connectivity."}
          </p>
        </div>

        {safetyTips && safetyTips.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Practical Traveler Precautions
            </h4>
            <ul className="space-y-2">
              {safetyTips.map((tip, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                >
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
