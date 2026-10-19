revoke select on public.organizations from anon, authenticated;
grant select (id,name,category,status,verified,description,created_at,updated_at)
  on public.organizations to anon, authenticated;
revoke execute on function public.verify_certificate(text) from public,anon,authenticated;

do $$ begin
  if not exists (select 1 from pg_roles where rolname='volunteerhub_api') then
    create role volunteerhub_api login;
  end if;
end $$;
alter role volunteerhub_api nocreatedb nocreaterole noinherit;
do $$ begin
  if exists(select 1 from pg_roles where rolname='volunteerhub_api' and (rolsuper or rolbypassrls)) then
    raise exception 'Runtime role must not have elevated attributes';
  end if;
end $$;
alter role volunteerhub_api set statement_timeout='30s';
alter role volunteerhub_api set idle_in_transaction_session_timeout='30s';
revoke all on schema public from volunteerhub_api;
grant usage on schema public,private to volunteerhub_api;
grant select on public.profiles,public.organizations,public.categories,public.activities,
  public.activity_schedules,public.applications,public.certificates,public.notifications,
  public.audit_logs,public.favorites,public.system_themes,public.site_content,
  public.stories,public.story_likes,public.profile_documents to volunteerhub_api;
grant insert,update,delete on public.organizations,public.activities,public.activity_schedules,
  public.applications,public.certificates,public.notifications,public.favorites,
  public.system_themes,public.stories,public.story_likes,public.profile_documents to volunteerhub_api;
grant insert on public.audit_logs to volunteerhub_api;
grant update (name,phone,dob,city,avatar_url,cover_url,bio,skills,interests,role,role_title,verified_hours)
  on public.profiles to volunteerhub_api;
grant usage,select on sequence public.system_themes_id_seq to volunteerhub_api;

do $$ declare t text; begin
  foreach t in array array['profiles','organizations','categories','activities','activity_schedules',
    'applications','certificates','notifications','audit_logs','favorites','system_themes',
    'site_content','stories','story_likes','profile_documents'] loop
    execute format('create policy backend_service_access on public.%I to volunteerhub_api using (true) with check (true)',t);
  end loop;
end $$;

create table private.api_session_activity (
  session_id uuid primary key,
  user_id uuid not null,
  last_seen timestamptz not null
);
create index api_session_activity_last_seen on private.api_session_activity(last_seen);
create table private.security_limits (
  key_hash text primary key check (key_hash ~ '^[a-f0-9]{64}$'),
  used bigint not null,
  expires_at timestamptz not null
);
create index security_limits_expiry on private.security_limits(expires_at);
revoke all on private.api_session_activity,private.security_limits from public,anon,authenticated,volunteerhub_api;

create function private.check_api_session(p_user uuid,p_session uuid,p_max_age int,p_idle int,p_touch boolean)
returns boolean language plpgsql security definer set search_path='' as $$
declare s record; seen timestamptz;
begin
  if p_max_age not between 300 and 604800 or p_idle not between 60 and 86400 then return false; end if;
  select created_at,not_after into s from auth.sessions where id=p_session and user_id=p_user;
  if not found or s.created_at + make_interval(secs=>p_max_age) <= now()
    or (s.not_after is not null and s.not_after<=now()) then return false; end if;
  insert into private.api_session_activity(session_id,user_id,last_seen) values(p_session,p_user,s.created_at)
    on conflict(session_id) do nothing;
  select last_seen into seen from private.api_session_activity where session_id=p_session and user_id=p_user for update;
  if not found or seen + make_interval(secs=>p_idle)<=now() then return false; end if;
  if p_touch then update private.api_session_activity set last_seen=now() where session_id=p_session; end if;
  return true;
end $$;

create function private.take_security_limit(p_key text,p_limit bigint,p_window int,p_amount bigint default 1)
returns table(allowed boolean,retry_after int) language plpgsql security definer set search_path='' as $$
declare r record;
begin
  if p_limit<=0 or p_window not between 1 and 86400 or p_amount<=0 or p_amount>1073741824 then
    raise exception 'Invalid limiter configuration';
  end if;
  insert into private.security_limits(key_hash,used,expires_at) values(p_key,p_amount,now()+make_interval(secs=>p_window))
  on conflict(key_hash) do update set
    used=case when security_limits.expires_at<=now() then p_amount else least(security_limits.used+p_amount,p_limit+1073741824) end,
    expires_at=case when security_limits.expires_at<=now() then now()+make_interval(secs=>p_window) else security_limits.expires_at end
  returning used,expires_at into r;
  return query select r.used<=p_limit,greatest(1,ceil(extract(epoch from (r.expires_at-now())))::int);
end $$;
revoke all on function private.check_api_session(uuid,uuid,int,int,boolean) from public,anon,authenticated;
revoke all on function private.take_security_limit(text,bigint,int,bigint) from public,anon,authenticated;
grant execute on function private.check_api_session(uuid,uuid,int,int,boolean),
  private.take_security_limit(text,bigint,int,bigint) to volunteerhub_api;

do $$ declare r record; begin
  for r in select policyname from pg_policies where schemaname='storage' and tablename='objects'
    and cmd in ('INSERT','UPDATE','DELETE','ALL') and (qual like '%avatars%' or with_check like '%avatars%'
      or qual like '%activity-banners%' or with_check like '%activity-banners%'
      or qual like '%organization-docs%' or with_check like '%organization-docs%'
      or qual like '%profile-docs%' or with_check like '%profile-docs%') loop
    execute format('drop policy %I on storage.objects',r.policyname);
  end loop;
end $$;
