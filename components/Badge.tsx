import React from "react";

export function Badge({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: string; size?: string }) {
  const variants: Record<string, string> = {
    primary:
      "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-200",
    success: "bg-success-100 text-success-700",
    warning: "bg-warning-100 text-warning-700",
    error: "bg-error-100 text-error-700",
    neutral: "bg-neutral-100 text-neutral-700",
  };
  const sizes: Record<string, string> = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 ${
        variants[variant] || variants.primary
      } ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
