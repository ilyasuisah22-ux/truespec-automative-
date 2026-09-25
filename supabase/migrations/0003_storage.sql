-- ============================================================================
-- TrueSpec Automotive — 0003 storage bucket and object policies
--
-- Bucket: vehicle-images (public read; writes restricted to administrators).
-- Uploads in the app are performed by the server (service role) AFTER an
-- explicit requireAdmin() check, so browser code never holds a private key.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vehicle-images',
  'vehicle-images',
  true,                       -- public READ of approved vehicle photography
  5242880,                    -- 5 MB hard limit per object
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public read of vehicle imagery.
drop policy if exists "vehicle_images_public_read_storage" on storage.objects;
create policy "vehicle_images_public_read_storage"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'vehicle-images');

-- Only administrators may write/replace/delete objects in this bucket.
drop policy if exists "vehicle_images_admin_write_storage" on storage.objects;
create policy "vehicle_images_admin_write_storage"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'vehicle-images' and public.is_admin());

drop policy if exists "vehicle_images_admin_update_storage" on storage.objects;
create policy "vehicle_images_admin_update_storage"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'vehicle-images' and public.is_admin())
  with check (bucket_id = 'vehicle-images' and public.is_admin());

drop policy if exists "vehicle_images_admin_delete_storage" on storage.objects;
create policy "vehicle_images_admin_delete_storage"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'vehicle-images' and public.is_admin());
