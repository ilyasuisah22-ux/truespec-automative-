import { z } from "zod";
import { nairaToKobo, isValidKoboAmount } from "@/lib/money";

/**
 * Server-side input validation. Every mutation parses its input through these
 * schemas. Client-provided totals are NEVER trusted: only the source cost
 * components and the customer price are accepted, and landed cost / profit are
 * recomputed on the server from those components.
 */

/** Accepts "24500000", "24,500,000" or 24500000 and yields integer kobo. */
const nairaAmount = (label: string, { required = true }: { required?: boolean } = {}) =>
  z
    .union([z.string(), z.number()])
    .optional()
    .transform((value, ctx) => {
      if (value === undefined || value === "" || value === null) {
        if (required) {
          ctx.addIssue({ code: "custom", message: `${label} is required` });
          return z.NEVER;
        }
        return null;
      }
      let kobo: number;
      try {
        kobo = nairaToKobo(value as string | number);
      } catch {
        ctx.addIssue({ code: "custom", message: `${label} must be a non-negative amount` });
        return z.NEVER;
      }
      if (!isValidKoboAmount(kobo)) {
        ctx.addIssue({ code: "custom", message: `${label} is outside the supported range` });
        return z.NEVER;
      }
      return kobo;
    });

const trimmed = (min: number, max: number, label: string) =>
  z
    .string()
    .transform((v) => v.trim())
    .refine((v) => v.length >= min && v.length <= max, {
      message: `${label} must be between ${min} and ${max} characters`,
    });

export const vehicleStatusSchema = z.enum(["available", "on_order", "landed"]);

export const vehicleFormSchema = z.object({
  // ---- Section 1: public information ----
  brand: trimmed(1, 80, "Brand"),
  model: trimmed(1, 80, "Model"),
  trim: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? v.trim().slice(0, 80) : null)),
  year: z.coerce
    .number()
    .int("Year must be a whole number")
    .min(1950, "Year must be 1950 or later")
    .max(2100, "Year must be 2100 or earlier"),
  exterior_color: trimmed(1, 60, "Exterior colour"),
  interior_color: trimmed(1, 60, "Interior colour"),
  mileage: z.coerce
    .number()
    .int("Mileage must be a whole number")
    .min(0, "Mileage cannot be negative")
    .max(2_000_000, "Mileage is outside the supported range"),
  features: z
    .string()
    .optional()
    .transform((v) =>
      (v ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .slice(0, 60)
        .map((line) => line.slice(0, 120))
    ),
  status: vehicleStatusSchema,
  customer_price_kobo: nairaAmount("Customer-facing doorstep price", { required: false }),
  public_arrival_note: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? v.trim().slice(0, 500) : null)),

  // ---- Section 3: private financial information ----
  purchase_price_kobo: nairaAmount("Purchase price"),
  usa_trucking_cost_kobo: nairaAmount("USA inland trucking cost"),
  shipping_cost_kobo: nairaAmount("Shipping cost"),
  clearing_cost_kobo: nairaAmount("Clearing cost"),
  nigeria_trucking_cost_kobo: nairaAmount("Nigeria inland trucking cost"),
  full_tank_cost_kobo: nairaAmount("Full-tank cost", { required: false }),
  internal_notes: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? v.trim().slice(0, 4000) : null)),
  sourcing_contact: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? v.trim().slice(0, 300) : null)),
});

export type VehicleFormInput = z.infer<typeof vehicleFormSchema>;

export const settingsFormSchema = z.object({
  whatsapp_number: z
    .string()
    .transform((v) => v.replace(/[^\d]/g, ""))
    .refine((v) => /^\d{8,15}$/.test(v), {
      message: "Enter the number in international format, digits only (e.g. 2348012345678)",
    }),
  site_tagline: trimmed(1, 200, "Public tagline"),
  default_full_tank_cost_kobo: nairaAmount("Default full-tank cost"),
});

export type SettingsFormInput = z.infer<typeof settingsFormSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required").max(200),
});

/**
 * Converts a zod error into a flat `{ field: message }` map for form rendering.
 */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
