import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/inventory";
import type { VehicleStatus } from "@/lib/supabase/types";

/** Customer-facing listing status pill. Derives its tone from the status value. */
export function StatusBadge({ status }: { status: VehicleStatus }) {
  const tone = status === "available" ? "available" : status === "on_order" ? "on_order" : "landed";
  return (
    <Badge tone={tone}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </Badge>
  );
}
