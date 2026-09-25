-- ============================================================================
-- TrueSpec Automotive — 0001 initial schema
-- Apply with: supabase db push   (or paste into the Supabase SQL editor)
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Shared trigger: keep updated_at accurate on every UPDATE
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- admin_users — explicit administrator allow-list (owner only)
-- A Supabase-authenticated user is NOT an admin unless a row exists here.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- vehicles — PUBLIC inventory data ONLY. No financial columns may be added here.
-- ---------------------------------------------------------------------------
create table if not exists public.vehicles (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text not null unique,
  brand                text not null check (length(trim(brand)) between 1 and 80),
  model                text not null check (length(trim(model)) between 1 and 80),
  trim                 text,
  year                 integer not null check (year between 1950 and 2100),
  exterior_color       text not null check (length(trim(exterior_color)) between 1 and 60),
  interior_color       text not null check (length(trim(interior_color)) between 1 and 60),
  mileage              integer not null check (mileage >= 0 and mileage <= 2000000),
  features             text[] not null default '{}',
  status               text not null check (status in ('available', 'on_order', 'landed')),
  customer_price_kobo  bigint not null default 0
                         check (customer_price_kobo >= 0 and customer_price_kobo <= 100000000000),
  public_arrival_note  text check (length(public_arrival_note) <= 500),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);


-- ---------------------------------------------------------------------------
-- vehicle_finances — PRIVATE financial data. One row per vehicle.
-- ---------------------------------------------------------------------------
create table if not exists public.vehicle_finances (
  vehicle_id                 uuid primary key references public.vehicles (id) on delete cascade,
  purchase_price_kobo        bigint not null default 0
                               check (purchase_price_kobo >= 0 and purchase_price_kobo <= 100000000000),
  usa_trucking_cost_kobo     bigint not null default 0
                               check (usa_trucking_cost_kobo >= 0 and usa_trucking_cost_kobo <= 100000000000),
  shipping_cost_kobo         bigint not null default 0
                               check (shipping_cost_kobo >= 0 and shipping_cost_kobo <= 100000000000),
  clearing_cost_kobo         bigint not null default 0
                               check (clearing_cost_kobo >= 0 and clearing_cost_kobo <= 100000000000),
  nigeria_trucking_cost_kobo bigint not null default 0
                               check (nigeria_trucking_cost_kobo >= 0 and nigeria_trucking_cost_kobo <= 100000000000),
  -- NULL means "not yet known". Intentionally nullable so the app can surface an
  -- INCOMPLETE COST state instead of silently treating it as a real zero cost.
  full_tank_cost_kobo        bigint check (
                               full_tank_cost_kobo is null
                               or (full_tank_cost_kobo >= 0 and full_tank_cost_kobo <= 100000000000)
                             ),
  internal_notes             text check (length(internal_notes) <= 4000),
  sourcing_contact           text check (length(sourcing_contact) <= 300),
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

drop trigger if exists vehicle_finances_set_updated_at on public.vehicle_finances;
create trigger vehicle_finances_set_updated_at
  before update on public.vehicle_finances
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- vehicle_images — public image metadata only (never financial data)
-- ---------------------------------------------------------------------------
create table if not exists public.vehicle_images (
  id            uuid primary key default gen_random_uuid(),
  vehicle_id    uuid not null references public.vehicles (id) on delete cascade,
  storage_path  text not null check (length(trim(storage_path)) between 1 and 512),
  display_order integer not null default 0 check (display_order >= 0),
  is_cover      boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- admin_activity_logs — audit trail. Never store secrets or financial bodies.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_activity_logs (
  id            uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null references auth.users (id) on delete set null,
  action        text not null check (length(trim(action)) between 1 and 80),
  entity_type   text not null check (length(trim(entity_type)) between 1 and 60),
  entity_id     uuid,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists admin_activity_logs_created_idx
  on public.admin_activity_logs (created_at desc);

-- ---------------------------------------------------------------------------
-- site_settings — singleton configuration row (id is always 1)
-- NOTE on historical accuracy: this holds the *default* full-tank cost, but
-- each vehicle's applied full-tank cost is snapshotted into
-- vehicle_finances.full_tank_cost_kobo when the vehicle is saved. Changing the
-- default here therefore never rewrites existing vehicle financial records.
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id                          smallint primary key default 1 check (id = 1),
  whatsapp_number             text not null default '2340000000000'
                                check (whatsapp_number ~ '^[0-9]{8,15}$'),
  site_tagline                text not null default 'Premium vehicle sourcing and import.'
                                check (length(site_tagline) <= 200),
  default_full_tank_cost_kobo bigint not null default 11000000
                                check (default_full_tank_cost_kobo >= 0
                                       and default_full_tank_cost_kobo <= 100000000000),
  updated_at                  timestamptz not null default now()
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

insert into public.site_settings (id) values (1)
  on conflict (id) do nothing;


create index if not exists vehicle_images_vehicle_idx
  on public.vehicle_images (vehicle_id, display_order);
-- At most one cover image per vehicle.
create unique index if not exists vehicle_images_one_cover_idx
  on public.vehicle_images (vehicle_id) where is_cover;

create index if not exists vehicles_status_idx on public.vehicles (status);
create index if not exists vehicles_created_at_idx on public.vehicles (created_at desc);

drop trigger if exists vehicles_set_updated_at on public.vehicles;
create trigger vehicles_set_updated_at
  before update on public.vehicles
  for each row execute function public.set_updated_at();
