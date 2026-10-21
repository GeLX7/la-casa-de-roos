-- Internal (admin-only) name per room, e.g. the owner's own label for each
-- Airbnb listing. Additive and nullable: the public site never reads it.
alter table public.rooms
  add column if not exists internal_name text;

comment on column public.rooms.internal_name is
  'Owner-facing label used in the admin panel and future integrations. Not shown on the public site.';
