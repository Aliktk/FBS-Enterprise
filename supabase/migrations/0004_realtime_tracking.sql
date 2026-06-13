-- Live tracking: a per-lead token lets the anonymous customer poll ONLY their own
-- lead's status (via a security-definer RPC), and admins get realtime lead updates.

alter table public.leads add column if not exists tracking_token uuid;

-- Enable Supabase Realtime on leads (admin dashboard subscribes; RLS still applies).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'leads'
  ) then
    alter publication supabase_realtime add table public.leads;
  end if;
end $$;

-- Returns the status for a given tracking token only — no table read access granted to anon.
create or replace function public.get_lead_status(p_token uuid)
returns text
language sql
security definer
set search_path = public
as $$
  select status from public.leads where tracking_token = p_token limit 1;
$$;

revoke all on function public.get_lead_status(uuid) from public;
grant execute on function public.get_lead_status(uuid) to anon, authenticated;
