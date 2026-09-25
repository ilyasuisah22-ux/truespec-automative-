import * as React from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-graphite-600 bg-graphite-900/60 px-6 py-14 text-center",
        className
      )}
    >
      {icon ? <div className="mb-4 text-ink-500">{icon}</div> : null}
      <p className="font-display text-lg tracking-wide text-ink-100">{title}</p>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-ink-400">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
