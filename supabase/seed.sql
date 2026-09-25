-- ============================================================================
-- TrueSpec Automotive — DEMONSTRATION SEED DATA
--
-- WARNING: This is NOT real TrueSpec Automotive inventory or financial data.
-- Every vehicle, price, mileage and cost below is invented for the audition
-- demo. Remove before production: supabase/scripts/remove_demo_data.sql
--
-- Image paths point at the generated placeholder artwork shipped in /public/demo,
-- which is labelled "DEMONSTRATION IMAGE". Replace with real photography via the
-- admin upload flow.
-- ============================================================================

insert into public.vehicles
  (id, slug, brand, model, trim, year, exterior_color, interior_color, mileage,
   features, status, customer_price_kobo, public_arrival_note)
values
  (
    'd0000000-0000-4000-8000-000000000001',
    'demo-mercedes-benz-ml-350-2015',
    'Mercedes-Benz', 'ML 350', '4MATIC', 2015,
    'Obsidian Black', 'Black Leather', 118000,
    array['Panoramic sunroof','Reverse camera','Heated front seats','Power tailgate','19-inch alloy wheels'],
    'available', 2450000000,
    'Demonstration record. Cleared and ready for inspection in Lagos.'
  ),
  (
    'd0000000-0000-4000-8000-000000000002',
    'demo-bmw-x5-xdrive40i-2019',
    'BMW', 'X5', 'xDrive40i', 2019,
    'Mineral White', 'Cognac Leather', 64000,
    array['Harman Kardon audio','Head-up display','Surround-view camera','M Sport package','20-inch alloy wheels'],
    'available', 4800000000,
    null
  ),
  (
    'd0000000-0000-4000-8000-000000000003',
    'demo-toyota-land-cruiser-2021',
    'Toyota', 'Land Cruiser', 'VXR', 2021,
    'Pearl White', 'Beige Leather', 41000,
    array['Cool box','Rear entertainment screens','Multi-terrain select','360-degree camera','Roof rails'],
    'on_order', 9200000000,
    'Demonstration record. Currently in transit to Nigeria.'
  ),
  (
    'd0000000-0000-4000-8000-000000000004',
    'demo-mercedes-benz-g63-amg-2018',
    'Mercedes-Benz', 'G-Class', 'G63 AMG', 2018,
    'Designo Night Black', 'Red Pepper Nappa', 52000,
    array['AMG performance exhaust','Carbon interior trim','Burmester sound','Adaptive damping','22-inch AMG wheels'],
    'landed', 11500000000,
    'Demonstration record. Landed and cleared earlier this year.'
  )
on conflict (id) do nothing;


-- ---------------------------------------------------------------------------
-- DEMO financial records (invented figures — see header warning)
-- Note vehicle 3 intentionally has NULL full_tank_cost_kobo so the dashboard
-- demonstrates the "incomplete cost" state.
-- ---------------------------------------------------------------------------
insert into public.vehicle_finances
  (vehicle_id, purchase_price_kobo, usa_trucking_cost_kobo, shipping_cost_kobo,
   clearing_cost_kobo, nigeria_trucking_cost_kobo, full_tank_cost_kobo,
   internal_notes, sourcing_contact)
values
  ('d0000000-0000-4000-8000-000000000001', 1350000000, 32000000, 315000000, 240000000, 45000000, 11000000,
   'DEMO: auction lot, minor bumper scuff noted on inspection.', 'DEMO: Copart agent (placeholder)'),
  ('d0000000-0000-4000-8000-000000000002', 3100000000, 38000000, 405000000, 310000000, 50000000, 11000000,
   'DEMO: single-owner lease return.', 'DEMO: Manheim buyer (placeholder)'),
  ('d0000000-0000-4000-8000-000000000003', 6300000000, 42000000, 560000000, 620000000, 60000000, null,
   'DEMO: full-tank cost not yet recorded for this unit.', 'DEMO: dealer trade-in (placeholder)'),
  ('d0000000-0000-4000-8000-000000000004', 7800000000, 45000000, 615000000, 740000000, 65000000, 13000000,
   'DEMO: arrived with aftermarket exhaust, verified.', 'DEMO: private seller (placeholder)')
on conflict (vehicle_id) do nothing;

-- ---------------------------------------------------------------------------
-- DEMO image records pointing at generated placeholder artwork
-- ---------------------------------------------------------------------------
insert into public.vehicle_images (vehicle_id, storage_path, display_order, is_cover)
select v.id, '/demo/' || v.img_key || '-' || k.variant || '.svg', k.ord, (k.ord = 0)
from (values
  ('d0000000-0000-4000-8000-000000000001'::uuid, 'ml350'),
  ('d0000000-0000-4000-8000-000000000002'::uuid, 'bmw-x5'),
  ('d0000000-0000-4000-8000-000000000003'::uuid, 'land-cruiser'),
  ('d0000000-0000-4000-8000-000000000004'::uuid, 'g-class')
) as v(id, img_key)
cross join (values ('exterior', 0), ('interior', 1), ('detail', 2)) as k(variant, ord)
where not exists (
  select 1 from public.vehicle_images vi where vi.vehicle_id = v.id
);

-- ---------------------------------------------------------------------------
-- DEMO public settings. The WhatsApp number is a clearly-marked placeholder
-- and is NOT the client's real business number.
-- ---------------------------------------------------------------------------
update public.site_settings
set whatsapp_number = '2340000000000',
    site_tagline = 'Premium vehicle sourcing, inspection and import for Nigerian buyers.'
where id = 1;
