"use client";

import * as React from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { AlertTriangle, Loader2, Pencil, Search, Trash2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatNaira } from "@/lib/money";
import { STATUS_LABELS } from "@/lib/inventory";
import type { VehicleStatus } from "@/lib/supabase/types";
import { deleteVehicleAction } from "@/lib/actions/vehicles";
import { cn } from "@/lib/utils";

export interface InventoryTableRow {
  id: string;
  slug: string;
  title: string;
  status: VehicleStatus;
  customerPriceKobo: number;
  landedCostKobo: number | null;
  profitKobo: number | null;
}

type StatusFilter = VehicleStatus | "all";

function statusTone(status: VehicleStatus) {
  return status === "available" ? "available" : status === "on_order" ? "on_order" : "landed";
}

/**
 * Admin inventory table.
 *
 * Search and filtering run against the real records loaded for this admin
 * session. Delete requires an explicit confirmation dialog and is disabled
 * entirely when the deployment has no connected database.
 */
export function InventoryTable({
  rows,
  editable,
}: {
  rows: InventoryTableRow[];
  editable: boolean;
}) {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [pendingDelete, setPendingDelete] = React.useState<InventoryTableRow | null>(null);

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (status !== "all" && row.status !== status) return false;
      if (!q) return true;
      return row.title.toLowerCase().includes(q) || row.slug.toLowerCase().includes(q);
    });
  }, [rows, query, status]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-lg border border-graphite-700 bg-graphite-900 p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label htmlFor="admin-search">Search inventory</Label>
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-500"
            />
            <Input
              id="admin-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Brand, model or slug"
              className="pl-9"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <Label htmlFor="admin-status-filter">Status</Label>
          <Select
            id="admin-status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
          >
            <option value="all">All statuses</option>
            <option value="available">Available</option>
            <option value="on_order">On Order</option>
            <option value="landed">Landed</option>
          </Select>
        </div>
      </div>

      <p role="status" className="text-sm text-ink-400">
        Showing {visible.length} of {rows.length} {rows.length === 1 ? "vehicle" : "vehicles"}.
      </p>

      {visible.length === 0 ? (
        <EmptyState
          title="No vehicles match these filters"
          description="Adjust the search or status filter to see more records."
        />
      ) : (
        <>
          <DesktopTable
            rows={visible}
            editable={editable}
            onDeleteRequest={setPendingDelete}
          />
          <MobileCards
            rows={visible}
            editable={editable}
            onDeleteRequest={setPendingDelete}
          />
        </>
      )}

      {pendingDelete ? (
        <DeleteConfirmation row={pendingDelete} onCancel={() => setPendingDelete(null)} />
      ) : null}
    </div>
  );
}

function DesktopTable({
  rows,
  editable,
  onDeleteRequest,
}: {
  rows: InventoryTableRow[];
  editable: boolean;
  onDeleteRequest: (row: InventoryTableRow) => void;
}) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-graphite-700 md:block">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">
          Inventory with customer price, landed cost and projected profit
        </caption>
        <thead className="bg-graphite-850 text-xs uppercase tracking-wider text-ink-400">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Vehicle
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Status
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Customer price
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Landed cost
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Projected profit
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-graphite-800">
              <th scope="row" className="px-4 py-3 font-normal">
                <Link
                  href={`/admin/inventory/${row.id}`}
                  className="font-medium text-ink-50 hover:text-gold-200"
                >
                  {row.title}
                </Link>
                <span className="mt-1 block text-xs text-ink-500">{row.slug}</span>
              </th>
              <td className="px-4 py-3">
                <Badge tone={statusTone(row.status)}>{STATUS_LABELS[row.status]}</Badge>
              </td>
              <td className="px-4 py-3 text-right font-medium text-ink-100">
                {row.customerPriceKobo === 0
                  ? "Price on request"
                  : formatNaira(row.customerPriceKobo)}
              </td>
              <td className="px-4 py-3 text-right text-ink-300">
                {row.landedCostKobo === null ? "—" : formatNaira(row.landedCostKobo)}
              </td>
              <td
                className={cn(
                  "px-4 py-3 text-right font-medium",
                  row.profitKobo === null
                    ? "text-ink-400"
                    : row.profitKobo >= 0
                      ? "text-status-available"
                      : "text-danger"
                )}
              >
                {row.profitKobo === null ? "—" : formatNaira(row.profitKobo)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <ButtonLink href={`/admin/inventory/${row.id}`} variant="ghost" size="sm">
                    <Pencil aria-hidden />
                    Edit
                  </ButtonLink>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!editable}
                    onClick={() => onDeleteRequest(row)}
                    className="text-danger"
                  >
                    <Trash2 aria-hidden />
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function MobileCards({
  rows,
  editable,
  onDeleteRequest,
}: {
  rows: InventoryTableRow[];
  editable: boolean;
  onDeleteRequest: (row: InventoryTableRow) => void;
}) {
  return (
    <ul className="space-y-3 md:hidden">
      {rows.map((row) => (
        <li
          key={row.id}
          className="rounded-lg border border-graphite-700 bg-graphite-850 p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <Link
                href={`/admin/inventory/${row.id}`}
                className="font-medium text-ink-50 hover:text-gold-200"
              >
                {row.title}
              </Link>
              <p className="text-xs text-ink-500">{row.slug}</p>
            </div>
            <Badge tone={statusTone(row.status)}>{STATUS_LABELS[row.status]}</Badge>
          </div>

          <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-graphite-700/60 pt-3 text-xs">
            <div>
              <dt className="text-ink-500">Price</dt>
              <dd className="mt-0.5 font-medium text-ink-100">
                {row.customerPriceKobo === 0 ? "Request" : formatNaira(row.customerPriceKobo)}
              </dd>
            </div>
            <div>
              <dt className="text-ink-500">Landed</dt>
              <dd className="mt-0.5 text-ink-300">
                {row.landedCostKobo === null ? "—" : formatNaira(row.landedCostKobo)}
              </dd>
            </div>
            <div>
              <dt className="text-ink-500">Profit</dt>
              <dd
                className={cn(
                  "mt-0.5 font-medium",
                  row.profitKobo === null
                    ? "text-ink-400"
                    : row.profitKobo >= 0
                      ? "text-status-available"
                      : "text-danger"
                )}
              >
                {row.profitKobo === null ? "—" : formatNaira(row.profitKobo)}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex items-center gap-2">
            <ButtonLink href={`/admin/inventory/${row.id}`} variant="outline" size="sm">
              <Pencil aria-hidden />
              Edit
            </ButtonLink>
            <Button
              variant="ghost"
              size="sm"
              disabled={!editable}
              onClick={() => onDeleteRequest(row)}
              className="text-danger"
            >
              <Trash2 aria-hidden />
              Delete
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}


/**
 * Explicit delete confirmation. Keyboard users get focus on open and can
 * dismiss with Escape; the destructive button shows a pending state so the
 * action cannot be double-submitted.
 */
function DeleteConfirmation({
  row,
  onCancel,
}: {
  row: InventoryTableRow;
  onCancel: () => void;
}) {
  const dialogRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    dialogRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-graphite-950/80 p-4">
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
        tabIndex={-1}
        className="w-full max-w-md rounded-lg border border-danger/40 bg-graphite-900 p-6"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle aria-hidden className="mt-0.5 size-5 shrink-0 text-danger" />
          <div>
            <h2 id="delete-title" className="font-display text-lg tracking-wide text-ink-50">
              Delete this listing?
            </h2>
            <p id="delete-description" className="mt-2 text-sm text-ink-300">
              <strong className="text-ink-100">{row.title}</strong> will be permanently removed,
              together with its financial records and photographs. This cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <form action={deleteVehicleAction}>
            <input type="hidden" name="id" value={row.id} />
            <SubmitDeleteButton />
          </form>
        </div>
      </div>
    </div>
  );
}

function SubmitDeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="danger" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Trash2 aria-hidden />}
      {pending ? "Deleting…" : "Delete permanently"}
    </Button>
  );
}

