-- ============================================================================
-- TrueSpec Automotive — 0002 Row Level Security + column-level privileges
--
-- Model:
--   anon / authenticated  -> may READ public inventory columns and public
--                            image metadata ONLY. No financial access, ever.
--   service_role          -> full access. Used ONLY by server-side code after
--                            requireAdmin() has verified the caller.
--   authenticated non-admin -> treated the same as anon for private data
--                            (being logged in does NOT grant financial access).
-- ============================================================================

alter table public.vehicles            enable row level security;
alter table public.vehicle_finances    enable row level security;
alter table public.vehicle_images      enable row level security;
alter table public.admin_activity_logs enable row level security;
alter table public.site_settings       enable row level security;
alter table public.admin_users         enable row level security;

-- ---------------------------------------------------------------------------
-- is_admin(): SECURITY DEFINER so it can read admin_users inside RLS policies
-- without granting clients direct access to admin_users rows.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.admin_users a where a.user_id = auth.uid()
  );
$$;

-- Only authenticated users may call it; anonymous callers get false.
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Reset broad grants. Supabase grants ALL to anon/authenticated by default,
-- which we explicitly take back and then re-grant column-by-column.
-- ---------------------------------------------------------------------------
revoke all on all tables in schema public from anon, authenticated;

-- ---------------------------------------------------------------------------
-- vehicles: public read of a fixed set of columns only.
-- ---------------------------------------------------------------------------
grant select (
  id, slug, brand, model, trim, year,
  exterior_color, interior_color, mileage, features,
  status, customer_price_kobo, public_arrival_note, created_at, updated_at
) on public.vehicles to anon, authenticated;

drop policy if exists "vehicles_public_read" on public.vehicles;
create policy "vehicles_public_read"
  on public.vehicles for select
  to anon, authenticated
  using (true);
-- No INSERT/UPDATE/DELETE policy exists for anon/authenticated, and no such
-- privileges are granted, so public users cannot mutate inventory.


-- ---------------------------------------------------------------------------
-- vehicle_finances: NO grants and NO policies for anon. Financial data is
-- reachable only by an administrator (RLS-checked) or the service role.
-- ---------------------------------------------------------------------------
revoke all on public.vehicle_finances from anon;

drop policy if exists "vehicle_finances_admin_all" on public.vehicle_finances;
create policy "vehicle_finances_admin_all"
  on public.vehicle_finances for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert, update, delete on public.vehicle_finances to authenticated;
-- Note: anon receives NO privilege on this table at all, so anonymous requests
-- fail at the privilege layer before RLS is even evaluated.

-- ---------------------------------------------------------------------------
-- vehicle_images: public read of metadata; writes are server-side only.
-- ---------------------------------------------------------------------------
grant select (id, vehicle_id, storage_path, display_order, is_cover, created_at)
  on public.vehicle_images to anon, authenticated;

drop policy if exists "vehicle_images_public_read" on public.vehicle_images;
create policy "vehicle_images_public_read"
  on public.vehicle_images for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- admin_users: a user may only see their OWN allow-list row (needed by the
-- requireAdmin() guard) and may never modify the allow-list.
-- ---------------------------------------------------------------------------
grant select (user_id, created_at) on public.admin_users to authenticated;

drop policy if exists "admin_users_self_read" on public.admin_users;
create policy "admin_users_self_read"
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- admin_activity_logs: administrators read the audit trail; nobody but the
-- service role may write it. Anonymous callers have no access at all.
-- ---------------------------------------------------------------------------
grant select on public.admin_activity_logs to authenticated;

drop policy if exists "admin_logs_admin_read" on public.admin_activity_logs;
create policy "admin_logs_admin_read"
  on public.admin_activity_logs for select
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- site_settings: the public may read ONLY the two public columns. The private
-- default_full_tank_cost_kobo column is never granted to anon, so it cannot be
-- retrieved by anonymous clients even though the row is a singleton.
-- ---------------------------------------------------------------------------
grant select (whatsapp_number, site_tagline) on public.site_settings to anon;

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read"
  on public.site_settings for select
  to anon
  using (true);

-- Administrators may read the full settings row (including the private default).
grant select on public.site_settings to authenticated;

drop policy if exists "site_settings_admin_read" on public.site_settings;
create policy "site_settings_admin_read"
  on public.site_settings for select
  to authenticated
  using (public.is_admin());
