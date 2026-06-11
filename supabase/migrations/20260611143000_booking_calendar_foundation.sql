-- Booking calendar foundation for La Casa de Roos.
-- Prepared only; do not apply to production until Supabase project/env vars exist.

create extension if not exists pgcrypto;
create extension if not exists btree_gist;

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  airbnb_url text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.calendar_sources (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  provider text not null check (provider in ('airbnb')),
  ical_url_encrypted_or_env_key text not null,
  active boolean not null default true,
  last_synced_at timestamptz,
  last_status text,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (room_id, provider)
);

create table if not exists public.external_blocks (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  source_id uuid references public.calendar_sources(id) on delete set null,
  external_uid text not null,
  start_date date not null,
  end_date date not null,
  summary text,
  source_provider text not null default 'airbnb',
  raw_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  date_range daterange generated always as (daterange(start_date, end_date, '[)')) stored,
  check (start_date < end_date),
  unique (source_id, external_uid)
);

create table if not exists public.reservation_requests (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete restrict,
  guest_name text not null,
  guest_email text,
  guest_phone text,
  start_date date not null,
  end_date date not null,
  guests integer not null check (guests > 0 and guests <= 6),
  message text,
  status text not null default 'requested'
    check (status in ('requested', 'pending_payment', 'confirmed', 'cancelled', 'expired')),
  source text not null default 'website' check (source in ('website')),
  payment_status text not null default 'none'
    check (payment_status in ('none', 'pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  date_range daterange generated always as (daterange(start_date, end_date, '[)')) stored,
  check (start_date < end_date)
);

create table if not exists public.manual_blocks (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  date_range daterange generated always as (daterange(start_date, end_date, '[)')) stored,
  check (start_date < end_date)
);

create table if not exists public.payment_intents (
  id uuid primary key default gen_random_uuid(),
  reservation_request_id uuid not null references public.reservation_requests(id) on delete cascade,
  provider text not null default 'culqi' check (provider in ('culqi')),
  provider_payment_id text,
  amount integer not null check (amount > 0),
  currency text not null default 'PEN' check (currency = 'PEN'),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists external_blocks_room_range_idx
  on public.external_blocks using gist (room_id, date_range);
create index if not exists reservation_requests_room_range_idx
  on public.reservation_requests using gist (room_id, date_range);
create index if not exists reservation_requests_status_idx
  on public.reservation_requests (status);
create index if not exists manual_blocks_room_range_idx
  on public.manual_blocks using gist (room_id, date_range);
create index if not exists payment_intents_reservation_idx
  on public.payment_intents (reservation_request_id);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'reservation_requests_confirmed_no_overlap'
  ) then
    alter table public.reservation_requests
      add constraint reservation_requests_confirmed_no_overlap
      exclude using gist (room_id with =, date_range with &&)
      where (status in ('pending_payment', 'confirmed'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'manual_blocks_no_overlap'
  ) then
    alter table public.manual_blocks
      add constraint manual_blocks_no_overlap
      exclude using gist (room_id with =, date_range with &&);
  end if;
end $$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_rooms_updated_at on public.rooms;
create trigger touch_rooms_updated_at
before update on public.rooms
for each row execute function public.touch_updated_at();

drop trigger if exists touch_calendar_sources_updated_at on public.calendar_sources;
create trigger touch_calendar_sources_updated_at
before update on public.calendar_sources
for each row execute function public.touch_updated_at();

drop trigger if exists touch_external_blocks_updated_at on public.external_blocks;
create trigger touch_external_blocks_updated_at
before update on public.external_blocks
for each row execute function public.touch_updated_at();

drop trigger if exists touch_reservation_requests_updated_at on public.reservation_requests;
create trigger touch_reservation_requests_updated_at
before update on public.reservation_requests
for each row execute function public.touch_updated_at();

drop trigger if exists touch_manual_blocks_updated_at on public.manual_blocks;
create trigger touch_manual_blocks_updated_at
before update on public.manual_blocks
for each row execute function public.touch_updated_at();

drop trigger if exists touch_payment_intents_updated_at on public.payment_intents;
create trigger touch_payment_intents_updated_at
before update on public.payment_intents
for each row execute function public.touch_updated_at();

create or replace function public.prevent_booking_manual_overlap()
returns trigger
language plpgsql
as $$
begin
  if tg_table_name = 'reservation_requests'
     and new.status in ('pending_payment', 'confirmed')
     and exists (
       select 1 from public.manual_blocks mb
       where mb.room_id = new.room_id
         and mb.date_range && new.date_range
     ) then
    raise exception 'Reservation overlaps a manual block';
  end if;

  if tg_table_name = 'manual_blocks'
     and exists (
       select 1 from public.reservation_requests rr
       where rr.room_id = new.room_id
         and rr.status in ('pending_payment', 'confirmed')
         and rr.date_range && new.date_range
     ) then
    raise exception 'Manual block overlaps a confirmed or pending-payment reservation';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_reservation_manual_overlap on public.reservation_requests;
create trigger prevent_reservation_manual_overlap
before insert or update on public.reservation_requests
for each row execute function public.prevent_booking_manual_overlap();

drop trigger if exists prevent_manual_reservation_overlap on public.manual_blocks;
create trigger prevent_manual_reservation_overlap
before insert or update on public.manual_blocks
for each row execute function public.prevent_booking_manual_overlap();

insert into public.rooms (slug, name, airbnb_url)
values
  ('suite-queen-con-sala', 'Suite Queen con sala y vista al Centro Historico', 'https://www.airbnb.com.pe/rooms/1352543068552764001'),
  ('suite-queen-centro-historico', 'Suite Queen en el Centro Historico', 'https://www.airbnb.com.pe/rooms/1353094020937867539'),
  ('suite-queen-con-vista', 'Suite Queen con vista al Centro Historico', 'https://www.airbnb.com.pe/rooms/1352529733779964415'),
  ('mini-apartamento-familiar', 'Suite Queen familiar con vista + cama extra', 'https://www.airbnb.com.pe/rooms/1352501815600410248')
on conflict (slug) do update set
  name = excluded.name,
  airbnb_url = excluded.airbnb_url,
  updated_at = now();

alter table public.rooms enable row level security;
alter table public.calendar_sources enable row level security;
alter table public.external_blocks enable row level security;
alter table public.reservation_requests enable row level security;
alter table public.manual_blocks enable row level security;
alter table public.payment_intents enable row level security;

comment on table public.reservation_requests is
  'Guest PII. Do not expose directly to anon/public clients; use server routes with service role.';
comment on table public.calendar_sources is
  'Stores env key names or encrypted refs for private Airbnb iCal URLs, never public URLs.';
comment on table public.payment_intents is
  'Future Culqi payment intents. Never store card data.';
