"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Calculator, Loader2, Lock, Save, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, FieldHint, Input, Label, Select, Textarea } from "@/components/ui/field";
import {
  calculateLandedCost,
  calculateProjectedProfit,
  formatNaira,
  nairaToKobo,
} from "@/lib/money";
import {
  createVehicleAction,
  updateVehicleAction,
  type VehicleActionState,
} from "@/lib/actions/vehicles";
import type { VehicleStatus } from "@/lib/supabase/types";

export interface VehicleFormValues {
  brand: string;
  model: string;
  trim: string;
  year: string;
  exterior_color: string;
  interior_color: string;
  mileage: string;
  features: string;
  status: VehicleStatus;
  customer_price_naira: string;
  public_arrival_note: string;
  purchase_price_naira: string;
  usa_trucking_cost_naira: string;
  shipping_cost_naira: string;
  clearing_cost_naira: string;
  nigeria_trucking_cost_naira: string;
  full_tank_cost_naira: string;
  internal_notes: string;
  sourcing_contact: string;
}

const initialState: VehicleActionState = {};

type MoneyField =
  | "customer_price_naira"
  | "purchase_price_naira"
  | "usa_trucking_cost_naira"
  | "shipping_cost_naira"
  | "clearing_cost_naira"
  | "nigeria_trucking_cost_naira"
  | "full_tank_cost_naira";

function toKoboOrNull(value: string): number | null {
  if (!value.trim()) return null;
  try {
    return nairaToKobo(value);
  } catch {
    return null;
  }
}

/**
 * Create / edit vehicle form.
 *
 * Section 1 holds public showroom fields; Section 3 holds private financial
 * fields. The live landed-cost and profit panel mirrors the server-side math
 * for immediate feedback, but the server always re-derives the authoritative
 * figures from the individual cost components on submission.
 */
export function VehicleForm({
  mode,
  vehicleId,
  defaults,
  defaultFullTankNaira,
  editable,
}: {
  mode: "create" | "edit";
  vehicleId?: string;
  defaults: VehicleFormValues;
  defaultFullTankNaira: number;
  editable: boolean;
}) {
  const action = mode === "create" ? createVehicleAction : updateVehicleAction;
  const [state, formAction] = useActionState(action, initialState);

  const [money, setMoney] = React.useState<Record<MoneyField, string>>(() => ({
    customer_price_naira: defaults.customer_price_naira,
    purchase_price_naira: defaults.purchase_price_naira,
    usa_trucking_cost_naira: defaults.usa_trucking_cost_naira,
    shipping_cost_naira: defaults.shipping_cost_naira,
    clearing_cost_naira: defaults.clearing_cost_naira,
    nigeria_trucking_cost_naira: defaults.nigeria_trucking_cost_naira,
    full_tank_cost_naira: defaults.full_tank_cost_naira,
  }));

  const setMoneyField = (field: MoneyField, value: string) =>
    setMoney((current) => ({ ...current, [field]: value }));

  const live = React.useMemo(() => {
    const fullTankKobo = toKoboOrNull(money.full_tank_cost_naira);
    const effectiveFullTank = fullTankKobo ?? defaultFullTankNaira * 100;

    const landed = calculateLandedCost({
      purchasePriceKobo: toKoboOrNull(money.purchase_price_naira) ?? 0,
      usaTruckingCostKobo: toKoboOrNull(money.usa_trucking_cost_naira) ?? 0,
      shippingCostKobo: toKoboOrNull(money.shipping_cost_naira) ?? 0,
      clearingCostKobo: toKoboOrNull(money.clearing_cost_naira) ?? 0,
      nigeriaTruckingCostKobo: toKoboOrNull(money.nigeria_trucking_cost_naira) ?? 0,
      fullTankCostKobo: effectiveFullTank,
    });

    const profit = calculateProjectedProfit(
      toKoboOrNull(money.customer_price_naira) ?? 0,
      landed
    );

    return {
      landedCostKobo: landed.totalLandedCostKobo,
      profitKobo: profit.projectedProfitKobo,
      usesDefaultFullTank: fullTankKobo === null,
    };
  }, [money, defaultFullTankNaira]);

  const err = state.fieldErrors ?? {};
  const disabled = !editable;

  return (
    <form action={formAction} className="space-y-8" noValidate>
      {vehicleId ? <input type="hidden" name="id" value={vehicleId} /> : null}

      {disabled ? (
        <Alert tone="warning" title="Demonstration mode — editing is disabled">
          This deployment is not connected to Supabase, so saving is switched off rather than
          pretending to succeed. See the README to connect your project and enable full inventory
          management.
        </Alert>
      ) : null}

      {state.error ? <Alert tone="error">{state.error}</Alert> : null}

      <PublicSection
        defaults={defaults}
        err={err}
        disabled={disabled}
        money={money.customer_price_naira}
        onCustomerPriceChange={(value) => setMoneyField("customer_price_naira", value)}
      />

      <FinancialSection
        defaults={defaults}
        err={err}
        disabled={disabled}
        money={money}
        setMoneyField={setMoneyField}
        live={live}
        defaultFullTankNaira={defaultFullTankNaira}
      />

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton
          disabled={disabled}
          label={mode === "create" ? "Create listing" : "Save changes"}
        />
        <span className="text-xs text-ink-500">
          Landed cost and profit are recalculated on the server when you save.
        </span>
      </div>
    </form>
  );
}

function PublicSection({
  defaults,
  err,
  disabled,
  money,
  onCustomerPriceChange,
}: {
  defaults: VehicleFormValues;
  err: Record<string, string>;
  disabled: boolean;
  money: string;
  onCustomerPriceChange: (value: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <ShieldCheck aria-hidden className="size-4 text-status-available" />
          Section 1 — Public vehicle information
        </CardTitle>
        <p className="mt-1 text-xs text-ink-400">
          Everything here is visible to customers on the public showroom.
        </p>
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2">
        <FormInput
          label="Brand"
          name="brand"
          defaultValue={defaults.brand}
          error={err.brand}
          disabled={disabled}
          required
          maxLength={80}
        />
        <FormInput
          label="Model"
          name="model"
          defaultValue={defaults.model}
          error={err.model}
          disabled={disabled}
          required
          maxLength={80}
        />
        <FormInput
          label="Trim"
          name="trim"
          defaultValue={defaults.trim}
          error={err.trim}
          disabled={disabled}
          maxLength={80}
          hint="Optional, e.g. 4MATIC or G63 AMG"
        />
        <FormInput
          label="Year"
          name="year"
          type="number"
          inputMode="numeric"
          min={1950}
          max={2100}
          defaultValue={defaults.year}
          error={err.year}
          disabled={disabled}
          required
        />
        <FormInput
          label="Exterior colour"
          name="exterior_color"
          defaultValue={defaults.exterior_color}
          error={err.exterior_color}
          disabled={disabled}
          required
          maxLength={60}
        />
        <FormInput
          label="Interior colour"
          name="interior_color"
          defaultValue={defaults.interior_color}
          error={err.interior_color}
          disabled={disabled}
          required
          maxLength={60}
        />
        <FormInput
          label="Mileage (km)"
          name="mileage"
          type="number"
          inputMode="numeric"
          min={0}
          max={2000000}
          defaultValue={defaults.mileage}
          error={err.mileage}
          disabled={disabled}
          required
        />
        <div>
          <Label htmlFor="status">Listing status</Label>
          <Select id="status" name="status" defaultValue={defaults.status} disabled={disabled}>
            <option value="available">Available — in stock</option>
            <option value="on_order">On Order — in transit</option>
            <option value="landed">Landed — cleared this year</option>
          </Select>
          <FieldError>{err.status}</FieldError>
        </div>


        <div className="sm:col-span-2">
          <Label htmlFor="features">Notable features and options</Label>
          <Textarea
            id="features"
            name="features"
            rows={5}
            defaultValue={defaults.features}
            disabled={disabled}
            aria-describedby="features-hint"
          />
          <FieldHint>
            <span id="features-hint">
              One feature per line. These appear on the public vehicle page.
            </span>
          </FieldHint>
        </div>

        <div>
          <Label htmlFor="customer_price_naira">Customer-facing doorstep price (₦)</Label>
          <Input
            id="customer_price_naira"
            name="customer_price_naira"
            inputMode="decimal"
            value={money}
            onChange={(e) => onCustomerPriceChange(e.target.value)}
            disabled={disabled}
            aria-invalid={Boolean(err.customer_price_naira)}
            placeholder="e.g. 24500000"
          />
          <FieldError>{err.customer_price_naira}</FieldError>
          <FieldHint>Leave blank to display &ldquo;Price on request&rdquo;.</FieldHint>
        </div>

        <div>
          <Label htmlFor="public_arrival_note">Public arrival note</Label>
          <Input
            id="public_arrival_note"
            name="public_arrival_note"
            defaultValue={defaults.public_arrival_note}
            disabled={disabled}
            maxLength={500}
            placeholder="Optional, shown to customers"
          />
          <FieldError>{err.public_arrival_note}</FieldError>
        </div>
      </CardContent>
    </Card>
  );
}


function FinancialSection({
  defaults,
  err,
  disabled,
  money,
  setMoneyField,
  live,
  defaultFullTankNaira,
}: {
  defaults: VehicleFormValues;
  err: Record<string, string>;
  disabled: boolean;
  money: Record<MoneyField, string>;
  setMoneyField: (field: MoneyField, value: string) => void;
  live: { landedCostKobo: number | null; profitKobo: number | null; usesDefaultFullTank: boolean };
  defaultFullTankNaira: number;
}) {
  const costFields: Array<{ field: MoneyField; label: string; error?: string }> = [
    { field: "purchase_price_naira", label: "Purchase price", error: err.purchase_price_naira },
    {
      field: "usa_trucking_cost_naira",
      label: "USA inland trucking cost",
      error: err.usa_trucking_cost_naira,
    },
    { field: "shipping_cost_naira", label: "Shipping cost", error: err.shipping_cost_naira },
    { field: "clearing_cost_naira", label: "Clearing cost", error: err.clearing_cost_naira },
    {
      field: "nigeria_trucking_cost_naira",
      label: "Nigeria inland trucking cost",
      error: err.nigeria_trucking_cost_naira,
    },
  ];

  return (
    <Card className="border-gold-700/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Lock aria-hidden className="size-4 text-gold-400" />
          Section 3 — Private financial information
        </CardTitle>
        <p className="mt-1 text-xs text-ink-400">
          Never shown to customers. Stored in a separate table that anonymous visitors and
          non-administrator accounts cannot read.
        </p>
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2">
        {costFields.map(({ field, label, error }) => (
          <MoneyInput
            key={field}
            id={field}
            label={label}
            value={money[field]}
            onChange={(value) => setMoneyField(field, value)}
            error={error}
            disabled={disabled}
          />
        ))}

        <MoneyInput
          id="full_tank_cost_naira"
          label="Full-tank cost"
          value={money.full_tank_cost_naira}
          onChange={(value) => setMoneyField("full_tank_cost_naira", value)}
          error={err.full_tank_cost_naira}
          disabled={disabled}
          hint={`Leave blank to apply the configured default of ${formatNaira(
            defaultFullTankNaira * 100
          )}. The applied value is saved with this vehicle, so changing the default later does not alter existing records.`}
        />


        <div className="sm:col-span-2">
          <Label htmlFor="sourcing_contact">Sourcing contact information</Label>
          <Input
            id="sourcing_contact"
            name="sourcing_contact"
            defaultValue={defaults.sourcing_contact}
            disabled={disabled}
            maxLength={300}
            placeholder="Dealer, auction agent or supplier reference"
          />
          <FieldError>{err.sourcing_contact}</FieldError>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="internal_notes">Internal notes</Label>
          <Textarea
            id="internal_notes"
            name="internal_notes"
            rows={4}
            defaultValue={defaults.internal_notes}
            disabled={disabled}
            maxLength={4000}
            placeholder="Condition notes, negotiation history, follow-up actions"
          />
          <FieldError>{err.internal_notes}</FieldError>
        </div>

        <div className="sm:col-span-2">
          <CalculatorPanel
            landedCostKobo={live.landedCostKobo}
            profitKobo={live.profitKobo}
            usesDefaultFullTank={live.usesDefaultFullTank}
            defaultFullTankNaira={defaultFullTankNaira}
          />
        </div>
      </CardContent>
    </Card>
  );
}


function CalculatorPanel({
  landedCostKobo,
  profitKobo,
  usesDefaultFullTank,
  defaultFullTankNaira,
}: {
  landedCostKobo: number | null;
  profitKobo: number | null;
  usesDefaultFullTank: boolean;
  defaultFullTankNaira: number;
}) {
  return (
    <div className="rounded-md border border-graphite-600 bg-graphite-850 p-4">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-400">
        <Calculator aria-hidden className="size-3.5 text-gold-400" />
        Live financial calculation
      </p>

      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-ink-500">Total landed cost</dt>
          <dd className="mt-1 font-display text-2xl text-ink-50">
            {landedCostKobo === null ? "—" : formatNaira(landedCostKobo)}
          </dd>
          <p className="mt-1 text-[0.7rem] text-ink-500">
            Purchase + USA trucking + shipping + clearing + Nigeria trucking + full tank
          </p>
        </div>
        <div>
          <dt className="text-xs text-ink-500">Projected profit</dt>
          <dd
            className={
              profitKobo === null
                ? "mt-1 font-display text-2xl text-ink-400"
                : profitKobo >= 0
                  ? "mt-1 font-display text-2xl text-status-available"
                  : "mt-1 font-display text-2xl text-danger"
            }
          >
            {profitKobo === null ? "—" : formatNaira(profitKobo)}
          </dd>
          <p className="mt-1 text-[0.7rem] text-ink-500">
            Customer doorstep price minus total landed cost
          </p>
        </div>
      </dl>

      <p className="mt-4 border-t border-graphite-700 pt-3 text-[0.7rem] leading-relaxed text-ink-500">
        {usesDefaultFullTank
          ? `Full-tank cost is blank, so the configured default of ${formatNaira(
              defaultFullTankNaira * 100
            )} is applied and saved with this vehicle.`
          : "Calculated from the cost components above. The server recalculates on save using these same components — never a client-submitted total."}
      </p>
    </div>
  );
}


function MoneyInput({
  id,
  label,
  value,
  onChange,
  error,
  disabled,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled: boolean;
  hint?: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label} (₦)</Label>
      <Input
        id={id}
        name={id}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        placeholder="0"
      />
      <FieldError>{error}</FieldError>
      {hint ? <FieldHint>{hint}</FieldHint> : null}
    </div>
  );
}

function SubmitButton({ disabled, label }: { disabled: boolean; label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={disabled || pending}>
      {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Save aria-hidden />}
      {pending ? "Saving…" : label}
    </Button>
  );
}

function FormInput({
  label,
  name,
  error,
  hint,
  ...props
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...props}
      />
      <FieldError>{error ? <span id={errorId}>{error}</span> : null}</FieldError>
      {hint ? (
        <FieldHint>
          <span id={hintId}>{hint}</span>
        </FieldHint>
      ) : null}
    </div>
  );
}

