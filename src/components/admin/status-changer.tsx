"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { setVehicleStatusAction } from "@/lib/actions/vehicles";
import type { VehicleStatus } from "@/lib/supabase/types";

/**
 * Quick listing-status changer on the vehicle record header.
 * Submits to a server action that re-authorises the request server-side.
 */
export function StatusChanger({
  vehicleId,
  current,
  editable,
}: {
  vehicleId: string;
  current: VehicleStatus;
  editable: boolean;
}) {
  return (
    <form action={setVehicleStatusAction} className="flex items-center gap-2">
      <input type="hidden" name="id" value={vehicleId} />
      <label htmlFor="status-quick" className="text-xs uppercase tracking-widest text-ink-500">
        Status
      </label>
      <Select
        id="status-quick"
        name="status"
        defaultValue={current}
        disabled={!editable}
        className="h-9 w-auto text-xs"
      >
        <option value="available">Available</option>
        <option value="on_order">On Order</option>
        <option value="landed">Landed</option>
      </Select>
      <SubmitStatusButton disabled={!editable} />
    </form>
  );
}

function SubmitStatusButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" size="sm" disabled={disabled || pending}>
      {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
      {pending ? "Saving…" : "Apply"}
    </Button>
  );
}
