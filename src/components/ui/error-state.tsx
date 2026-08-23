import * as React from "react";
import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
      <div>
        <h4 className="font-bold text-base mb-0.5">{title}</h4>
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button variant="destructive" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
