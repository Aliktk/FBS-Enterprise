-- Provision the owner admin login (no public signup) WITHOUT committing a credential.
--
-- The email/password are read from Postgres settings at apply time; if they are
-- not set, this migration does nothing (no default credential is created).
--
-- To create the owner via this migration, pass the settings on the push, e.g.:
--   psql "$DATABASE_URL" \
--     -c "set app.admin_email='owner@example.com'; set app.admin_password='<strong-password>';" \
--     -f supabase/migrations/0003_admin_user.sql
--
-- Preferred for production: `pnpm db:seed` (uses the service-role admin API and
-- ADMIN_EMAIL / ADMIN_PASSWORD from .env.local), or Supabase Dashboard → Authentication → Add user.
--
-- pgcrypto lives in the `extensions` schema on Supabase, so crypt/gen_salt are qualified.

do $$
declare
  v_email    text := nullif(current_setting('app.admin_email', true), '');
  v_password text := nullif(current_setting('app.admin_password', true), '');
  v_uid      uuid;
begin
  if v_email is null or v_password is null then
    raise notice 'Skipping admin user creation: set app.admin_email / app.admin_password, or run `pnpm db:seed`.';
    return;
  end if;

  if exists (select 1 from auth.users where email = v_email) then
    raise notice 'Admin user % already exists — skipping.', v_email;
    return;
  end if;

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    confirmation_token, recovery_token, email_change_token_new, email_change
  )
  values (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
    v_email, extensions.crypt(v_password, extensions.gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('role', 'owner'),
    '', '', '', ''
  )
  returning id into v_uid;

  insert into auth.identities (
    id, provider_id, user_id, identity_data, provider, created_at, updated_at, last_sign_in_at
  )
  values (
    gen_random_uuid(), v_uid::text, v_uid,
    jsonb_build_object('sub', v_uid::text, 'email', v_email, 'email_verified', true),
    'email', now(), now(), now()
  );
end $$;
