-- ============================================================
--  IIT Dharwad Robotics Club — Supabase setup
--  Run this once in:  Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- 1) CONTENT TABLE -------------------------------------------------
--    One table holds every content type (projects, events, people,
--    teams, achievements, timeline, highlights, values). The flexible
--    `data` JSONB column stores each record's fields.
create table if not exists public.content (
  id          uuid primary key default gen_random_uuid(),
  type        text not null,                 -- 'project' | 'event' | 'person' | ...
  position    int  not null default 0,       -- display order within a type
  data        jsonb not null default '{}',   -- all editable fields
  image_url   text,                          -- optional uploaded image
  updated_at  timestamptz not null default now()
);

create index if not exists content_type_pos_idx on public.content (type, position);

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists content_touch on public.content;
create trigger content_touch before update on public.content
  for each row execute function public.touch_updated_at();


-- 2) ROW-LEVEL SECURITY -------------------------------------------
--    Anyone can READ (the public site needs this).
--    Only a logged-in admin can INSERT / UPDATE / DELETE.
alter table public.content enable row level security;

drop policy if exists "content public read"  on public.content;
drop policy if exists "content admin write"   on public.content;
drop policy if exists "content admin update"  on public.content;
drop policy if exists "content admin delete"  on public.content;

create policy "content public read"
  on public.content for select
  using ( true );

create policy "content admin write"
  on public.content for insert to authenticated
  with check ( true );

create policy "content admin update"
  on public.content for update to authenticated
  using ( true ) with check ( true );

create policy "content admin delete"
  on public.content for delete to authenticated
  using ( true );


-- 3) IMAGE STORAGE -------------------------------------------------
--    Public bucket for uploaded photos. Public read, admin-only write.
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "site-images public read"  on storage.objects;
drop policy if exists "site-images admin write"  on storage.objects;
drop policy if exists "site-images admin update" on storage.objects;
drop policy if exists "site-images admin delete" on storage.objects;

create policy "site-images public read"
  on storage.objects for select
  using ( bucket_id = 'site-images' );

create policy "site-images admin write"
  on storage.objects for insert to authenticated
  with check ( bucket_id = 'site-images' );

create policy "site-images admin update"
  on storage.objects for update to authenticated
  using ( bucket_id = 'site-images' );

create policy "site-images admin delete"
  on storage.objects for delete to authenticated
  using ( bucket_id = 'site-images' );

-- ============================================================
--  Done. Next: create the admin user (Authentication → Users →
--  Add user) with the email in supabase-config.js, set a password,
--  then open the console and run "Import current site content".
-- ============================================================
