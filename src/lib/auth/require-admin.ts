import "server-only";
import { createClient } from "@/lib/supabase/server";

export class UnauthenticatedError extends Error {
  constructor() {
    super("Unauthenticated");
    this.name = "UnauthenticatedError";
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

/**
 * Server-only authorization guard.
 *
 * Verifies:
 *  1. There is an authenticated Supabase session (else throws UnauthenticatedError -> caller returns 401).
 *  2. The authenticated user's id exists in the `admin_users` allow-list table
 *     (else throws UnauthorizedError -> caller returns 403).
 *
 * IMPORTANT: A valid Supabase session alone does NOT prove the user is the
 * business owner/administrator. Every protected server action, API route
 * handler, or server component that touches financial data or performs a
 * mutation MUST call this function and MUST NOT proceed if it throws.
 *
 * Uses the request-scoped (RLS-respecting) client to check the session,
 * then a narrow query against admin_users, which itself is protected by RLS
 * so that only a user's own admin row (if any) is readable.
 */
export async function requireAdmin() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    throw new UnauthenticatedError();
  }

  const { data: adminRow, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (adminError || !adminRow) {
    throw new UnauthorizedError();
  }

  return { user: userData.user };
}
