import React from "react";

export function Card({
  children,
  variant = "default",
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "elevated" | "outlined";
}) {
  const variants: Record<string, string> = {
    default:
      "bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 shadow-sm",
    elevated:
      "bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700",
    outlined:
      "bg-transparent rounded-xl border-2 border-neutral-200 dark:border-neutral-700",
  };
  return (
    <div
      className={`${variants[variant]} transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
