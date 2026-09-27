-- ============================================================================
-- TrueSpec Automotive — DEMONSTRATION SEED DATA
--
-- WARNING: This is NOT real TrueSpec Automotive inventory or financial data.
-- Every vehicle, price, mileage and cost below is invented for the audition
-- demo. Remove before production: supabase/scripts/remove_demo_data.sql
--
-- Image paths point at the sample photography shipped in /public/demo/vehicles,
-- which is served as static public assets (one exterior and one interior frame
-- per vehicle). Replace with real stock photographs via the admin upload flow.
--
-- These slugs/ids mirror src/lib/demo/demo-data.ts exactly, so a database-seeded
-- deployment and the in-repo DEMO_DATA fallback describe the same inventory.
-- ============================================================================

insert into public.vehicles
  (id, slug, brand, model, trim, year, exterior_color, interior_color, mileage,
   features, status, customer_price_kobo, public_arrival_note)
values
  (
    'd0000000-0000-4000-8000-000000000001',
    'demo-mercedes-benz-gle-450-2024',
    'Mercedes-Benz', 'GLE 450', '4MATIC AMG Line', 2024,
    'Obsidian Black Metallic', 'Macchiato Beige / Black Nappa', 6200,
    array['Panoramic sliding sunroof','Burmester Surround Sound system','Airmatic air suspension with adaptive damping','Active Distance Assist DISTRONIC','Multibeam LED intelligent lighting','21-inch AMG multi-spoke alloy wheels'],
    'available', 7100000000,
    'DEMO RECORD - Representative inventory. Cleared and ready for inspection at Victoria Island showroom.'
  ),
  (
    'd0000000-0000-4000-8000-000000000002',
    'demo-bmw-x5-xdrive40i-2023',
    'BMW', 'X5', 'xDrive40i M Sport', 2023,
    'Mineral White Metallic', 'Tartufo Extended Merino Leather', 18500,
    array['M Sport aerodynamic package','Sky Lounge panoramic glass roof','Harman Kardon premium sound','Live Cockpit Professional with curved display','BMW Laserlight system','22-inch M double-spoke bi-color wheels'],
    'available', 5400000000,
    'DEMO RECORD - Representative inventory. Inspected before shipment; Lagos customs documentation verified.'
  ),
  (
    'd0000000-0000-4000-8000-000000000003',
    'demo-lexus-rx-350-2024',
    'Lexus', 'RX 350', 'F SPORT Handling AWD', 2024,
    'Sonic Titanium', 'Circuit Red NuLuxe', 8900,
    array['Lexus Safety System+ 3.0','Mark Levinson 21-speaker PurePlay sound','14-inch touchscreen multimedia display','Adaptive Variable Suspension (AVS)','Color head-up display','Triple-beam ultra-compact LED headlamps'],
    'available', 6000000000,
    null
  ),
  (
    'd0000000-0000-4000-8000-000000000004',
    'demo-range-rover-sport-dynamic-se-2023',
    'Range Rover', 'Sport', 'Dynamic SE P400', 2023,
    'Santorini Black', 'Ebony / Light Cloud Semi-Aniline', 14200,
    array['Dynamic Air Suspension with switchable volume','Meridian 3D surround sound system','Pixel LED headlights with signature DRL','ClearSight interior rear view mirror','Deployable side access steps','23-inch Style 5135 gloss black wheels'],
    'available', 10400000000,
    'DEMO RECORD - Representative inventory. Direct UK spec, fully duty-paid with transparent doorstep pricing.'
  ),
  (
    'd0000000-0000-4000-8000-000000000005',
    'demo-toyota-land-cruiser-vxr-2024',
    'Toyota', 'Land Cruiser', 'LC300 VXR Twin-Turbo V6', 2024,
    'Precious White Pearl', 'Neutral Beige Semi-Aniline Leather', 4300,
    array['Electronic Kinetic Dynamic Suspension (E-KDSS)','JBL 14-speaker premium reference audio','Rear dual 11.6-inch entertainment displays','Multi-terrain monitor with 3D under-floor view','Integrated center console cool box','Adaptive high-beam system'],
    'on_order', 14500000000,
    'DEMO RECORD - Representative inventory. Currently in transit; tracking updates provided through vessel arrival.'
  ),
  (
    'd0000000-0000-4000-8000-000000000006',
    'demo-mercedes-benz-c300-2022',
    'Mercedes-Benz', 'C300', 'AMG Line Premium Plus', 2022,
    'Mojave Silver Metallic', 'Sienna Brown Leather', 28400,
    array['AMG Line body styling and sport brakes','Panoramic tilting/sliding sunroof','Burmester 3D sound system','11.9-inch central portrait multimedia touchscreen','64-color ambient lighting system','19-inch AMG multi-spoke bi-color alloys'],
    'on_order', 3650000000,
    'DEMO RECORD - Representative inventory. Allocated and currently undergoing ocean transit to Lagos.'
  ),
  (
    'd0000000-0000-4000-8000-000000000007',
    'demo-porsche-cayenne-2023',
    'Porsche', 'Cayenne', 'Base AWD Sport Chrono', 2023,
    'Crayon / Chalk Grey', 'Black / Bordeaux Red Two-Tone', 16100,
    array['Sport Chrono Package with mode switch','Adaptive air suspension with PASM','Panoramic roof system','BOSE Surround Sound system','LED-Matrix Design headlights with PDLS+','21-inch RS Spyder Design wheels'],
    'landed', 9100000000,
    'DEMO RECORD - Representative inventory. Cleared and delivered to client specification earlier this quarter.'
  ),
  (
    'd0000000-0000-4000-8000-000000000008',
    'demo-bmw-740i-2024',
    'BMW', '7 Series', '740i M Sport', 2024,
    'Carbon Black Metallic', 'Smoke White BMW Individual Merino', 5100,
    array['31.3-inch BMW Theatre Screen in rear cabin','Bowers & Wilkins Diamond surround sound','Sky Lounge panoramic glass roof with LED patterns','Automatic doors with soft-close function','BMW Interaction Bar with ambient backlighting','Executive lounge seating with massage function'],
    'landed', 12200000000,
    'DEMO RECORD - Representative inventory. Sourced, imported, inspected and delivered through our flagship white-glove service.'
  )
on conflict (id) do nothing;


-- ---------------------------------------------------------------------------
-- DEMO financial records (invented figures — see header warning)
-- Note vehicle 5 (Land Cruiser) intentionally has NULL full_tank_cost_kobo so
-- the dashboard demonstrates the "incomplete cost" state.
-- ---------------------------------------------------------------------------
insert into public.vehicle_finances
  (vehicle_id, purchase_price_kobo, usa_trucking_cost_kobo, shipping_cost_kobo,
   clearing_cost_kobo, nigeria_trucking_cost_kobo, full_tank_cost_kobo,
   internal_notes, sourcing_contact)
values
  ('d0000000-0000-4000-8000-000000000001', 5200000000, 45000000, 480000000, 520000000, 55000000, 12000000,
   'DEMO: verified dealer trade-in, comprehensive pre-purchase inspection passed.', 'DEMO: Manheim Luxury Division (placeholder)'),
  ('d0000000-0000-4000-8000-000000000002', 3900000000, 40000000, 420000000, 460000000, 50000000, 11000000,
   'DEMO: single-owner corporate lease return, spotless maintenance logs.', 'DEMO: BMW Financial Services remarketing (placeholder)'),
  ('d0000000-0000-4000-8000-000000000003', 4400000000, 42000000, 430000000, 480000000, 50000000, 11000000,
   'DEMO: pristine condition, original paint verified.', 'DEMO: Texas wholesale partner (placeholder)'),
  ('d0000000-0000-4000-8000-000000000004', 7800000000, 48000000, 540000000, 680000000, 60000000, 13000000,
   'DEMO: dynamic spec with full deployable steps and factory warranty records.', 'DEMO: JLR Certified remarketing (placeholder)'),
  ('d0000000-0000-4000-8000-000000000005', 11000000000, 55000000, 680000000, 850000000, 70000000, null,
   'DEMO: full-tank cost pending final delivery documentation.', 'DEMO: Middle East / Gulf export partner (placeholder)'),
  ('d0000000-0000-4000-8000-000000000006', 2600000000, 35000000, 340000000, 360000000, 45000000, 10000000,
   'DEMO: AMG Line styling package, low mileage certified.', 'DEMO: Florida dealership trade (placeholder)'),
  ('d0000000-0000-4000-8000-000000000007', 6800000000, 46000000, 520000000, 640000000, 60000000, 13000000,
   'DEMO: Porsche Sport Chrono pack with adaptive air suspension.', 'DEMO: Porsche Centre West consignment (placeholder)'),
  ('d0000000-0000-4000-8000-000000000008', 9200000000, 50000000, 600000000, 760000000, 65000000, 14000000,
   'DEMO: rear executive lounge theatre screen specification.', 'DEMO: Munich direct allocation (placeholder)')
on conflict (vehicle_id) do nothing;

-- ---------------------------------------------------------------------------
-- DEMO image records: INTENTIONALLY OMITTED.
--
-- This seed used to insert two `vehicle_images` rows per demo vehicle pointing
-- at `public/demo/vehicles/<model>-{exterior,interior}.jpg`. Those files did not
-- depict the vehicles they were named after — `lexus-rx-exterior.jpg` held a
-- Lamborghini, `mercedes-c300-exterior.jpg` a BMW M4, `range-rover-sport-
-- exterior.jpg` an Audi A3, `land-cruiser-exterior.jpg` a Ford — and every
-- "-interior.jpg" was an exterior shot, six of the eight shared across
-- vehicles. Presenting those images as the listed car is a misrepresentation
-- of the goods, so the files were deleted and the rows withdrawn from the
-- database.
--
-- Demo vehicles therefore seed with no photography and render the honest
-- "photography pending" state. Attach real per-vehicle photographs through
-- Admin -> Inventory -> [vehicle] -> Images, or place files in the
-- `vehicle-images` Storage bucket and insert `vehicle_images` rows yourself.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- DEMO public settings. The WhatsApp number is a clearly-marked placeholder
-- and is NOT the client's real business number.
-- ---------------------------------------------------------------------------
update public.site_settings
set whatsapp_number = '2340000000000',
    site_tagline = 'Premium vehicle sourcing, inspection and import for Nigerian buyers.'
where id = 1;
