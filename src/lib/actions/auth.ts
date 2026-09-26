"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, fieldErrors } from "@/lib/validation/schemas";
import { isSupabaseConfigured } from "@/lib/data/public";
import { logAdminActivity } from "@/lib/data/admin";

export interface LoginState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Best-effort login throttle.
 *
 * Supabase Auth applies its own provider-side rate limiting and abuse
 * protection, which is the primary control. This lightweight in-memory counter
 * is defence-in-depth for the demo deployment and is intentionally simple:
 * Phase 2 replaces it with a durable store (e.g. Upstash/Postgres) if needed.
 */
const attempts = new Map<string, { count: number; firstAt: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 8;

function throttled(key: string): boolean {
  const now = Date.now();
  const record = attempts.get(key);
  if (!record || now - record.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now });
    return false;
  }
  record.count += 1;
  return record.count > MAX_ATTEMPTS;
}

export async function signInAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Sign-in is unavailable because Supabase is not configured for this deployment. An administrator must set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  const { email, password } = parsed.data;

  if (throttled(email)) {
    return { error: "Too many sign-in attempts. Please wait one minute and try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  // Deliberately generic message — never reveal whether the email exists.
  if (error || !data.user) {
    return { error: "Incorrect email or password." };
  }

  // Being authenticated is NOT enough: the user must be on the admin allow-list.
  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!adminRow) {
    await supabase.auth.signOut();
    return {
      error:
        "This account is not authorised for the dashboard. Ask the project owner to add it to the administrator allow-list.",
    };
  }

  attempts.delete(email);

  await logAdminActivity({
    actorUserId: data.user.id,
    actorEmail: data.user.email,
    action: "admin.login",
    entityType: "session",
  });

  redirect("/admin");
}

export async function signOutAction(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
