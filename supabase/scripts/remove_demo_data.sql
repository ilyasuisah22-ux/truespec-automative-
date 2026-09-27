-- ============================================================================
-- TrueSpec Automotive — REMOVE ALL DEMONSTRATION DATA
--
-- Run this ONCE before going live with real client inventory.
-- It removes only the eight demo vehicles (fixed demo UUIDs) and their related
-- financial and image rows. Real inventory created through the admin dashboard
-- is left untouched.
--
-- Usage:  psql "<your connection string>" -f supabase/scripts/remove_demo_data.sql
--    or:  paste into the Supabase SQL editor
-- ============================================================================

begin;

-- vehicle_finances and vehicle_images rows are removed automatically by the
-- ON DELETE CASCADE foreign keys, but we delete them explicitly so the effect
-- is obvious in logs and safe even if a constraint were ever changed.
delete from public.vehicle_images
where vehicle_id = any (array[
  'd0000000-0000-4000-8000-000000000001'::uuid,
  'd0000000-0000-4000-8000-000000000002'::uuid,
  'd0000000-0000-4000-8000-000000000003'::uuid,
  'd0000000-0000-4000-8000-000000000004'::uuid,
  'd0000000-0000-4000-8000-000000000005'::uuid,
  'd0000000-0000-4000-8000-000000000006'::uuid,
  'd0000000-0000-4000-8000-000000000007'::uuid,
  'd0000000-0000-4000-8000-000000000008'::uuid
]);

delete from public.vehicle_finances
where vehicle_id = any (array[
  'd0000000-0000-4000-8000-000000000001'::uuid,
  'd0000000-0000-4000-8000-000000000002'::uuid,
  'd0000000-0000-4000-8000-000000000003'::uuid,
  'd0000000-0000-4000-8000-000000000004'::uuid,
  'd0000000-0000-4000-8000-000000000005'::uuid,
  'd0000000-0000-4000-8000-000000000006'::uuid,
  'd0000000-0000-4000-8000-000000000007'::uuid,
  'd0000000-0000-4000-8000-000000000008'::uuid
]);

delete from public.vehicles
where id = any (array[
  'd0000000-0000-4000-8000-000000000001'::uuid,
  'd0000000-0000-4000-8000-000000000002'::uuid,
  'd0000000-0000-4000-8000-000000000003'::uuid,
  'd0000000-0000-4000-8000-000000000004'::uuid,
  'd0000000-0000-4000-8000-000000000005'::uuid,
  'd0000000-0000-4000-8000-000000000006'::uuid,
  'd0000000-0000-4000-8000-000000000007'::uuid,
  'd0000000-0000-4000-8000-000000000008'::uuid
]);

-- Also clear demo audit entries created while exploring the dashboard.
delete from public.admin_activity_logs
where entity_id = any (array[
  'd0000000-0000-4000-8000-000000000001'::uuid,
  'd0000000-0000-4000-8000-000000000002'::uuid,
  'd0000000-0000-4000-8000-000000000003'::uuid,
  'd0000000-0000-4000-8000-000000000004'::uuid,
  'd0000000-0000-4000-8000-000000000005'::uuid,
  'd0000000-0000-4000-8000-000000000006'::uuid,
  'd0000000-0000-4000-8000-000000000007'::uuid,
  'd0000000-0000-4000-8000-000000000008'::uuid
]);

commit;

-- Finally, set DEMO_DATA=false in your Vercel/environment configuration so the
-- application stops falling back to the in-repo demo dataset.
