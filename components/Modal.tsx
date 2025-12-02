import React from "react";
import { X } from "lucide-react";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  if (!isOpen) return null;
  const sizes: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div
        className={`bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full ${sizes[size]}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-700">
          {title && <h3 className="font-bold">{title}</h3>}
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <X />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
