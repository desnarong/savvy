import React from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export function Alert({
  type = "info",
  title,
  message,
}: {
  type?: string;
  title?: string;
  message: string;
}) {
  const icons: Record<string, React.ReactNode> = {
    success: <CheckCircle2 />,
    error: <AlertCircle />,
    info: <Info />,
    warning: <AlertCircle />,
  };

  return (
    <div className="p-4 rounded-lg border flex gap-3 items-start bg-primary-50 dark:bg-primary-900/10">
      {icons[type] || icons.info}
      <div>
        {title && <div className="font-semibold">{title}</div>}
        <div className="text-sm">{message}</div>
      </div>
    </div>
  );
}

export default Alert;
