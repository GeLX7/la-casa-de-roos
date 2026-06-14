-- Room image storage: adds Supabase Storage support to the catalog.
--
-- Idempotent and additive. Existing seeded rows keep working: their `src`
-- stays a local "/images/..." path and `source_type` defaults to 'local'.
-- Uploaded images store the public Storage URL in `src`, the object path in
-- `storage_path`, and 'supabase_storage' in `source_type` (so deletes can also
-- remove the object). Cover stays one-per-room, enforced in the server action.

alter table public.room_images
  add column if not exists storage_path text;

alter table public.room_images
  add column if not exists source_type text not null default 'local';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'room_images_source_type_check'
  ) then
    alter table public.room_images
      add constraint room_images_source_type_check
      check (source_type in ('local', 'supabase_storage', 'airbnb_seed'));
  end if;
end $$;

-- Public bucket for owner-uploaded room photos. Public read is intentional:
-- these images render on the public website, so public URLs (CDN-cached, no
-- signed-URL expiry to manage) are the simplest reliable option. Writes happen
-- server-side with the service role (bypasses RLS); the public flag handles
-- reads, so no custom storage.objects policy is required. Size/MIME limits are
-- enforced here as defense in depth, in addition to the server action.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'room-images',
  'room-images',
  true,
  10485760, -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;
