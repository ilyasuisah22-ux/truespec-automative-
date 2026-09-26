"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { authorizeAdmin } from "@/lib/auth/authorize-admin";
import { logAdminActivity } from "@/lib/data/admin";
import { settingsFormSchema, fieldErrors } from "@/lib/validation/schemas";
import { isSupabaseConfigured } from "@/lib/data/public";

export interface SettingsActionState {
  ok?: boolean;
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Updates the business settings.
 *
 * Security notes:
 *  - authorization is verified server-side before any read or write,
 *  - only these three columns are ever written,
 *  - the default full-tank cost is stored privately and is NOT exposed through
 *    the public settings response (see supabase/migrations/0002_rls.sql),
 *  - changing the default does not rewrite any existing vehicle record, because
 *    each vehicle snapshots the value applied when it was saved.
 */
export async function updateSettingsAction(
  _prev: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const auth = await authorizeAdmin();
  if (!auth.ok) return { error: auth.message };

  if (!isSupabaseConfigured()) {
    return {
      error:
        "Demonstration mode: settings changes require a connected Supabase project. See the README setup steps.",
    };
  }

  const parsed = settingsFormSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      whatsapp_number: parsed.data.whatsapp_number,
      site_tagline: parsed.data.site_tagline,
      default_full_tank_cost_kobo: parsed.data.default_full_tank_cost_naira,
    })
    .eq("id", 1);

  if (error) {
    console.error("[admin] settings update failed:", error.message);
    return { error: "Unable to save settings. Nothing was changed." };
  }

  await logAdminActivity({
    actorUserId: auth.userId,
    actorEmail: auth.email,
    action: "settings.update",
    entityType: "site_settings",
    entityId: null,
    // Deliberately records WHICH settings changed, never the values.
    metadata: { changed: ["whatsapp_number", "site_tagline", "default_full_tank_cost_kobo"] },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");

  return { ok: true, success: "Settings saved." };
}
