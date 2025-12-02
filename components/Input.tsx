import React from "react";
import { AlertCircle } from "lucide-react";

export function Input({
  label,
  error,
  hint,
  icon,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`w-full px-4 py-2.5 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition ${
            icon ? "pl-10" : ""
          } ${error ? "border-error-500" : ""} ${className}`}
          {...(props as any)}
        />
      </div>
      {error ? (
        <div className="flex items-center gap-1 mt-2 text-sm text-error-600 dark:text-error-400">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      ) : hint ? (
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default Input;
