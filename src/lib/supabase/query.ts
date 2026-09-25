/**
 * Explicit response narrowing for PostgREST queries.
 *
 * WHY THIS EXISTS
 * ---------------
 * supabase-js infers a row type by parsing the `.select("col, col, ...")`
 * string argument. In this environment that inference collapses to `never`,
 * which would force us to abandon explicit column selection (the very thing we
 * want, because `select('*')` is forbidden by our security model).
 *
 * So we keep explicit column lists for the wire query and narrow the response
 * to the matching row type here. This does NOT weaken security:
 *  - the database still only reads the columns we list,
 *  - the result still passes through the allow-list serializer,
 *  - `assertNoPrivateFields` still runs before any public response.
 *
 * Phase 2 follow-up: run `supabase gen types typescript` against the live
 * project and delete this indirection once inference works cleanly.
 */

export interface NarrowableResult<T> {
  data: T[] | null;
  error: { message: string } | null;
}

export function rowsOf<T>(result: NarrowableResult<T>): { rows: T[]; error: string | null } {
  if (result.error) return { rows: [], error: result.error.message };
  return { rows: Array.isArray(result.data) ? result.data : [], error: null };
}

export interface NarrowableSingleResult<T> {
  data: T | null;
  error: { message: string } | null;
}

export function rowOf<T>(result: NarrowableSingleResult<T>): { row: T | null; error: string | null } {
  if (result.error) return { row: null, error: result.error.message };
  return { row: (result.data ?? null) as T | null, error: null };
}
