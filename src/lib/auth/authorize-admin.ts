import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/data/public";

export type AdminAuthResult =
  | { ok: true; userId: string; email: string | null }
  | { ok: false; status: 401 | 403; message: string; configured: boolean };

/**
 * Centralised server-side authorization check used by every admin Server
 * Action and admin API route handler.
 *
 * Returns a discriminated result instead of throwing so callers can map it to
 * the correct HTTP semantics (401 unauthenticated / 403 authenticated-but-not-
 * authorised) and so it is directly unit-testable.
 *
 * Order of checks:
 *   1. Is Supabase configured at all? (no → 401, unauthenticated by definition)
 *   2. Is there a valid Supabase session? (no → 401)
 *   3. Does the session user appear in the admin_users allow-list? (no → 403)
 *
 * Being authenticated is explicitly NOT sufficient — step 3 is the real gate.
 */
export async function authorizeAdmin(): Promise<AdminAuthResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      status: 401,
      configured: false,
      message:
        "Supabase is not configured for this deployment, so dashboard operations are disabled.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return {
      ok: false,
      status: 401,
      configured: true,
      message: "You must be signed in to perform this action.",
    };
  }

  const { data: adminRow, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (adminError || !adminRow) {
    return {
      ok: false,
      status: 403,
      configured: true,
      message: "Your account is not authorised to perform administrator operations.",
    };
  }

  return { ok: true, userId: data.user.id, email: data.user.email ?? null };
}
