"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, FieldHint, Input, Label } from "@/components/ui/field";
import { updateSettingsAction, type SettingsActionState } from "@/lib/actions/settings";
import { formatNaira } from "@/lib/money";

const initialState: SettingsActionState = {};

export function SettingsForm({
  defaults,
  editable,
}: {
  defaults: {
    whatsapp_number: string;
    site_tagline: string;
    default_full_tank_cost_naira: string;
  };
  editable: boolean;
}) {
  const [state, formAction] = useActionState(updateSettingsAction, initialState);
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {!editable ? (
        <Alert tone="warning" title="Demonstration mode — saving is disabled">
          Settings cannot be persisted without a connected Supabase project. See the README for the
          setup steps.
        </Alert>
      ) : null}

      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Public website settings</CardTitle>
          <p className="mt-1 text-xs text-ink-400">
            These two values are the only settings exposed to public visitors.
          </p>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="whatsapp_number">Business WhatsApp number</Label>
            <Input
              id="whatsapp_number"
              name="whatsapp_number"
              defaultValue={defaults.whatsapp_number}
              disabled={editable === false}
              inputMode="numeric"
              aria-invalid={Boolean(err.whatsapp_number)}
              placeholder="2348012345678"
            />
            <FieldError>{err.whatsapp_number}</FieldError>
            <FieldHint>
              International format, digits only, including country code — no spaces, plus sign or
              leading zero. Example: a Nigerian number written locally as 0801 234 5678 becomes
              2348012345678.
            </FieldHint>
          </div>

          <div>
            <Label htmlFor="site_tagline">Public website tagline</Label>
            <Input
              id="site_tagline"
              name="site_tagline"
              defaultValue={defaults.site_tagline}
              disabled={editable === false}
              maxLength={200}
              aria-invalid={Boolean(err.site_tagline)}
            />
            <FieldError>{err.site_tagline}</FieldError>
            <FieldHint>Shown in the homepage hero and social previews.</FieldHint>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Private configuration</CardTitle>
          <p className="mt-1 text-xs text-ink-400">
            Used as the default when a vehicle&apos;s full-tank cost is left blank.
          </p>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm">
            <Label htmlFor="default_full_tank_cost_naira">Default full-tank cost (₦)</Label>
            <Input
              id="default_full_tank_cost_naira"
              name="default_full_tank_cost_naira"
              defaultValue={defaults.default_full_tank_cost_naira}
              disabled={editable === false}
              inputMode="decimal"
              aria-invalid={Boolean(err.default_full_tank_cost_naira)}
            />
            <FieldError>{err.default_full_tank_cost_naira}</FieldError>
            <FieldHint>
              Historical accuracy: each vehicle stores the full-tank cost that was applied when it
              was saved ({formatNaira(11_000_000)} by default). Changing this default only affects
              vehicles created or saved afterwards — existing records are never rewritten.
            </FieldHint>
          </div>
        </CardContent>
      </Card>

      <SaveBar disabled={editable === false} />
    </form>
  );
}

function SaveBar({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex items-center gap-4">
      <Button type="submit" size="lg" disabled={disabled || pending}>
        {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Save aria-hidden />}
        {pending ? "Saving…" : "Save settings"}
      </Button>
      <span className="text-xs text-ink-500">
        Changes are validated and applied on the server.
      </span>
    </div>
  );
}
