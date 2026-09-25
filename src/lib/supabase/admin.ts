import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Service-role Supabase client. BYPASSES ROW LEVEL SECURITY.
 *
 * SECURITY: This client must NEVER be imported into any file that is
 * bundled for the browser ("use client" files) or exposed via a public
 * route. It must only be used inside server-only code (Server Actions,
 * Route Handlers, server components) AFTER the caller has already been
 * verified as the authenticated, authorized admin user via
 * `requireAdmin()` in `src/lib/auth/require-admin.ts`.
 *
 * The service-role key is read from the server-only env var
 * SUPABASE_SERVICE_ROLE_KEY, which must never be prefixed with
 * NEXT_PUBLIC_ and never sent to the client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin client misconfigured: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createSupabaseClient<Database>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
