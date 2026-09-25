import * as React from "react";
import { cn } from "@/lib/utils";

type AlertTone = "info" | "success" | "warning" | "error";

const toneClasses: Record<AlertTone, string> = {
  info: "border-graphite-600 bg-graphite-850 text-ink-200",
  success: "border-status-available/40 bg-status-available/10 text-ink-100",
  warning: "border-status-onorder/40 bg-status-onorder/10 text-ink-100",
  error: "border-danger/50 bg-danger/10 text-ink-100",
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
  title?: string;
}

/** Inline status/error surface. Uses role="status" (announced politely) unless tone is error. */
export function Alert({ tone = "info", title, className, children, ...props }: AlertProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("rounded-md border px-4 py-3 text-sm", toneClasses[tone], className)}
      {...props}
    >
      {title ? <p className="mb-1 font-semibold text-ink-50">{title}</p> : null}
      {children}
    </div>
  );
}
