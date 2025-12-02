import React from "react";

export function Skeleton({ className = "w-full h-4", count = 1 }: { className?: string; count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${className} bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse`} />
      ))}
    </div>
  );
}

export default Skeleton;
