-- ============================================================
-- Farhan Business Solution Enterprise — initial schema
-- Tables, RLS policies, and the gallery storage bucket.
-- Apply via: supabase db push   (or paste into the SQL editor)
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- leads (public booking requests) ----------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  service text not null,
  area text not null,
  urgency text not null default 'Normal' check (urgency in ('Normal','Urgent','Emergency')),
  status text not null default 'new' check (status in ('new','contacted','scheduled','done')),
  note text,
  internal_note text,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

-- ---------- projects (gallery / recent work) ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  service text not null default '',
  area text not null default '',
  done_on text,
  image_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

-- ---------- testimonials ----------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  meta text,
  stars int not null default 5 check (stars between 1 and 5),
  quote text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

-- ---------- services ----------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  emoji text not null default '',
  title text not null,
  description text not null default '',
  is_new boolean not null default false,
  enabled boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

-- ---------- settings (single row) ----------
create table if not exists public.settings (
  id text primary key default 'singleton',
  business_name text not null default 'Farhan Business Solution Enterprise',
  primary_phone text not null default '',
  whatsapp_number text not null default '',
  email text not null default '',
  service_areas text[] not null default '{}',
  coming_soon_areas text[] not null default '{}',
  emergency_24_7 boolean not null default true,
  facebook_url text not null default '',
  instagram_url text not null default '',
  youtube_url text not null default '',
  updated_at timestamptz
);

-- ============================================================
-- Row Level Security
-- Authenticated == admin (there is no public sign-up).
-- ============================================================
alter table public.leads enable row level security;
alter table public.projects enable row level security;
alter table public.testimonials enable row level security;
alter table public.services enable row level security;
alter table public.settings enable row level security;

-- leads: anyone may submit; only admins may read/manage.
drop policy if exists leads_insert_public on public.leads;
create policy leads_insert_public on public.leads for insert to anon, authenticated with check (true);
drop policy if exists leads_admin_select on public.leads;
create policy leads_admin_select on public.leads for select to authenticated using (true);
drop policy if exists leads_admin_update on public.leads;
create policy leads_admin_update on public.leads for update to authenticated using (true) with check (true);
drop policy if exists leads_admin_delete on public.leads;
create policy leads_admin_delete on public.leads for delete to authenticated using (true);

-- projects: public reads published; admins read/manage all.
drop policy if exists projects_public_read on public.projects;
create policy projects_public_read on public.projects for select to anon using (published = true);
drop policy if exists projects_admin_read on public.projects;
create policy projects_admin_read on public.projects for select to authenticated using (true);
drop policy if exists projects_admin_write on public.projects;
create policy projects_admin_write on public.projects for insert to authenticated with check (true);
drop policy if exists projects_admin_update on public.projects;
create policy projects_admin_update on public.projects for update to authenticated using (true) with check (true);
drop policy if exists projects_admin_delete on public.projects;
create policy projects_admin_delete on public.projects for delete to authenticated using (true);

-- testimonials: same pattern.
drop policy if exists testimonials_public_read on public.testimonials;
create policy testimonials_public_read on public.testimonials for select to anon using (published = true);
drop policy if exists testimonials_admin_read on public.testimonials;
create policy testimonials_admin_read on public.testimonials for select to authenticated using (true);
drop policy if exists testimonials_admin_write on public.testimonials;
create policy testimonials_admin_write on public.testimonials for insert to authenticated with check (true);
drop policy if exists testimonials_admin_update on public.testimonials;
create policy testimonials_admin_update on public.testimonials for update to authenticated using (true) with check (true);
drop policy if exists testimonials_admin_delete on public.testimonials;
create policy testimonials_admin_delete on public.testimonials for delete to authenticated using (true);

-- services: public reads enabled; admins read/manage all.
drop policy if exists services_public_read on public.services;
create policy services_public_read on public.services for select to anon using (enabled = true);
drop policy if exists services_admin_read on public.services;
create policy services_admin_read on public.services for select to authenticated using (true);
drop policy if exists services_admin_write on public.services;
create policy services_admin_write on public.services for insert to authenticated with check (true);
drop policy if exists services_admin_update on public.services;
create policy services_admin_update on public.services for update to authenticated using (true) with check (true);
drop policy if exists services_admin_delete on public.services;
create policy services_admin_delete on public.services for delete to authenticated using (true);

-- settings: public reads; admins update.
drop policy if exists settings_public_read on public.settings;
create policy settings_public_read on public.settings for select to anon, authenticated using (true);
drop policy if exists settings_admin_write on public.settings;
create policy settings_admin_write on public.settings for insert to authenticated with check (true);
drop policy if exists settings_admin_update on public.settings;
create policy settings_admin_update on public.settings for update to authenticated using (true) with check (true);

-- ============================================================
-- Storage: public-read gallery bucket for project photos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

drop policy if exists gallery_public_read on storage.objects;
create policy gallery_public_read on storage.objects for select to anon, authenticated using (bucket_id = 'gallery');
drop policy if exists gallery_admin_insert on storage.objects;
create policy gallery_admin_insert on storage.objects for insert to authenticated with check (bucket_id = 'gallery');
drop policy if exists gallery_admin_update on storage.objects;
create policy gallery_admin_update on storage.objects for update to authenticated using (bucket_id = 'gallery');
drop policy if exists gallery_admin_delete on storage.objects;
create policy gallery_admin_delete on storage.objects for delete to authenticated using (bucket_id = 'gallery');
