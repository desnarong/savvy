import React, { useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

export function Toast({
  type = "info",
  message,
  duration = 3000,
  onClose,
}: {
  type?: string;
  message: string;
  duration?: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const icons: Record<string, React.ReactNode> = {
    success: <CheckCircle2 />,
    error: <AlertCircle />,
    info: <Info />,
    warning: <AlertCircle />,
  };

  return (
    <div className="fixed bottom-4 right-4 p-3 rounded-lg shadow-lg bg-white dark:bg-neutral-800 flex items-center gap-3 z-50">
      {icons[type] || icons.info}
      <div className="font-medium">{message}</div>
      <button onClick={onClose} className="ml-4 p-1">
        <X />
      </button>
    </div>
  );
}

export default Toast;
