-- Admin catalog foundation for La Casa de Roos.
-- Extends 20260611143000_booking_calendar_foundation.sql (rooms, calendar_sources,
-- reservation_requests, manual_blocks, payment_intents already exist).
-- Prepared only; do not apply to production until a Supabase project exists
-- and the owner approves (docs/runbooks/admin-supabase-setup.md).

-- ---------------------------------------------------------------------------
-- 1. Extend rooms with the editable catalog fields shown on the public suite
--    pages (title lives in rooms.name from the previous migration).
-- ---------------------------------------------------------------------------

alter table public.rooms
  add column if not exists subtitle text not null default '',
  add column if not exists airbnb_listing_id text,
  add column if not exists capacity integer not null default 2,
  add column if not exists beds text not null default '',
  add column if not exists bath text not null default 'Baño privado',
  add column if not exists checkin text not null default '14:00',
  add column if not exists checkout text not null default '11:00',
  add column if not exists quiet_hours text not null default '23:00 a 06:00',
  add column if not exists description_title text not null default 'La suite',
  add column if not exists short_description text not null default '',
  add column if not exists long_description text[] not null default '{}',
  add column if not exists price_label text not null default 'Consultar precio',
  add column if not exists guest_favorite boolean not null default false,
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists sort_order integer not null default 0,
  add column if not exists deleted_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'rooms_capacity_range'
  ) then
    alter table public.rooms
      add constraint rooms_capacity_range check (capacity > 0 and capacity <= 10);
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Repeatable content tables (features, not-included notes, house rules).
-- ---------------------------------------------------------------------------

create table if not exists public.room_features (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  icon text not null default 'check',
  label text not null,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.room_not_included (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  label text not null,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.room_rules (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  label text not null,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. Gallery images. Paths point at assets under public/images/ for now;
--    Supabase Storage upload is a documented later step, this schema already
--    accepts absolute URLs when that lands.
-- ---------------------------------------------------------------------------

create table if not exists public.room_images (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  src text not null,
  alt text not null default '',
  category text not null default 'Habitación'
    check (category in ('Sala', 'Habitación', 'Cocina', 'Baño', 'Áreas comunes', 'Entorno', 'Detalles')),
  is_cover boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 4. Airbnb-sourced ratings (display-only; never schema.org aggregateRating).
-- ---------------------------------------------------------------------------

create table if not exists public.room_ratings (
  room_id uuid primary key references public.rooms(id) on delete cascade,
  rating numeric(3, 2) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  cleanliness numeric(3, 2) not null default 0 check (cleanliness >= 0 and cleanliness <= 5),
  accuracy numeric(3, 2) not null default 0 check (accuracy >= 0 and accuracy <= 5),
  checkin numeric(3, 2) not null default 0 check (checkin >= 0 and checkin <= 5),
  communication numeric(3, 2) not null default 0 check (communication >= 0 and communication <= 5),
  location numeric(3, 2) not null default 0 check (location >= 0 and location <= 5),
  value numeric(3, 2) not null default 0 check (value >= 0 and value <= 5),
  source text not null default 'airbnb' check (source in ('airbnb')),
  checked_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.room_ratings is
  'Airbnb-sourced public listing scores. Display-only and attributed; never expose as schema.org aggregateRating without explicit approval.';

-- ---------------------------------------------------------------------------
-- 5. Admin allowlist. A Supabase Auth user is an admin only if their id has a
--    row here. Rows are inserted manually with the service role / SQL editor
--    (docs/runbooks/admin-supabase-setup.md) — there is no self-signup path.
-- ---------------------------------------------------------------------------

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  note text,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Allowlist of admin Supabase Auth users. Insert rows manually; no public write path exists.';

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 6. updated_at triggers (touch_updated_at comes from the previous migration).
-- ---------------------------------------------------------------------------

drop trigger if exists touch_room_features_updated_at on public.room_features;
create trigger touch_room_features_updated_at
before update on public.room_features
for each row execute function public.touch_updated_at();

drop trigger if exists touch_room_not_included_updated_at on public.room_not_included;
create trigger touch_room_not_included_updated_at
before update on public.room_not_included
for each row execute function public.touch_updated_at();

drop trigger if exists touch_room_rules_updated_at on public.room_rules;
create trigger touch_room_rules_updated_at
before update on public.room_rules
for each row execute function public.touch_updated_at();

drop trigger if exists touch_room_images_updated_at on public.room_images;
create trigger touch_room_images_updated_at
before update on public.room_images
for each row execute function public.touch_updated_at();

drop trigger if exists touch_room_ratings_updated_at on public.room_ratings;
create trigger touch_room_ratings_updated_at
before update on public.room_ratings
for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 7. Indexes for the public read path.
-- ---------------------------------------------------------------------------

create index if not exists rooms_active_sort_idx
  on public.rooms (sort_order) where active and deleted_at is null;
create index if not exists room_features_room_idx on public.room_features (room_id, sort_order);
create index if not exists room_not_included_room_idx on public.room_not_included (room_id, sort_order);
create index if not exists room_rules_room_idx on public.room_rules (room_id, sort_order);
create index if not exists room_images_room_idx on public.room_images (room_id, sort_order);

-- ---------------------------------------------------------------------------
-- 8. Row Level Security.
--    Public (anon) may read active catalog content only. All writes require
--    an authenticated user present in admin_users. Booking tables from the
--    previous migration stay service-role-only (RLS enabled, no policies).
-- ---------------------------------------------------------------------------

alter table public.room_features enable row level security;
alter table public.room_not_included enable row level security;
alter table public.room_rules enable row level security;
alter table public.room_images enable row level security;
alter table public.room_ratings enable row level security;
alter table public.admin_users enable row level security;

-- admin_users: a signed-in user may check their own membership; nothing else.
drop policy if exists "Admins read own row" on public.admin_users;
create policy "Admins read own row" on public.admin_users
  for select to authenticated
  using (user_id = auth.uid());

-- rooms (RLS already enabled by the previous migration).
drop policy if exists "Public reads active rooms" on public.rooms;
create policy "Public reads active rooms" on public.rooms
  for select to anon, authenticated
  using ((active = true and deleted_at is null) or public.is_admin());

drop policy if exists "Admins manage rooms" on public.rooms;
create policy "Admins manage rooms" on public.rooms
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- room_features
drop policy if exists "Public reads enabled features" on public.room_features;
create policy "Public reads enabled features" on public.room_features
  for select to anon, authenticated
  using (
    public.is_admin()
    or (
      enabled = true
      and exists (
        select 1 from public.rooms r
        where r.id = room_id and r.active and r.deleted_at is null
      )
    )
  );

drop policy if exists "Admins manage features" on public.room_features;
create policy "Admins manage features" on public.room_features
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- room_not_included
drop policy if exists "Public reads enabled notes" on public.room_not_included;
create policy "Public reads enabled notes" on public.room_not_included
  for select to anon, authenticated
  using (
    public.is_admin()
    or (
      enabled = true
      and exists (
        select 1 from public.rooms r
        where r.id = room_id and r.active and r.deleted_at is null
      )
    )
  );

drop policy if exists "Admins manage notes" on public.room_not_included;
create policy "Admins manage notes" on public.room_not_included
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- room_rules
drop policy if exists "Public reads enabled rules" on public.room_rules;
create policy "Public reads enabled rules" on public.room_rules
  for select to anon, authenticated
  using (
    public.is_admin()
    or (
      enabled = true
      and exists (
        select 1 from public.rooms r
        where r.id = room_id and r.active and r.deleted_at is null
      )
    )
  );

drop policy if exists "Admins manage rules" on public.room_rules;
create policy "Admins manage rules" on public.room_rules
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- room_images
drop policy if exists "Public reads active images" on public.room_images;
create policy "Public reads active images" on public.room_images
  for select to anon, authenticated
  using (
    public.is_admin()
    or (
      active = true
      and exists (
        select 1 from public.rooms r
        where r.id = room_id and r.active and r.deleted_at is null
      )
    )
  );

drop policy if exists "Admins manage images" on public.room_images;
create policy "Admins manage images" on public.room_images
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- room_ratings
drop policy if exists "Public reads ratings" on public.room_ratings;
create policy "Public reads ratings" on public.room_ratings
  for select to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.rooms r
      where r.id = room_id and r.active and r.deleted_at is null
    )
  );

drop policy if exists "Admins manage ratings" on public.room_ratings;
create policy "Admins manage ratings" on public.room_ratings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());
