"use client";
import { AlertTriangle, Info, CheckCircle, XCircle, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Variant = "warning" | "info" | "success" | "error";

const config: Record<Variant, { icon: typeof AlertTriangle; bg: string; text: string; border: string }> = {
  warning: { icon: AlertTriangle, bg: "bg-amber-500/10", text: "text-amber-300", border: "border-amber-500/30" },
  info: { icon: Info, bg: "bg-blue-500/10", text: "text-blue-300", border: "border-blue-500/30" },
  success: { icon: CheckCircle, bg: "bg-emerald-500/10", text: "text-emerald-300", border: "border-emerald-500/30" },
  error: { icon: XCircle, bg: "bg-red-500/10", text: "text-red-300", border: "border-red-500/30" },
};

interface Props {
  variant?: Variant;
  title?: string;
  message: string;
  dismissible?: boolean;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export default function AlertBanner({
  variant = "info",
  title,
  message,
  dismissible = false,
  action,
  className,
}: Props) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const { icon: Icon, bg, text, border } = config[variant];

  return (
    <div className={cn("border rounded-lg p-3 flex items-start gap-3", bg, border, className)}>
      <Icon className={cn("w-4 h-4 flex-shrink-0 mt-0.5", text)} />
      <div className="flex-1 min-w-0">
        {title && <p className={cn("text-sm font-semibold", text)}>{title}</p>}
        <p className={cn("text-xs leading-relaxed", title ? "text-gray-400 mt-0.5" : text)}>
          {message}
        </p>
        {action && (
          <button
            onClick={action.onClick}
            className={cn("text-xs font-medium mt-2 underline", text)}
          >
            {action.label}
          </button>
        )}
      </div>
      {dismissible && (
        <button onClick={() => setDismissed(true)} className="text-gray-500 hover:text-gray-300">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
