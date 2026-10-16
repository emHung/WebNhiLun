-- Preserve imported attendance counts explicitly instead of inventing users.
alter table public.activities add column if not exists historical_approved_count integer not null default 0 check (historical_approved_count>=0);
alter table public.activities add column if not exists idempotency_key uuid;
alter table public.activities add column if not exists short_description text not null default '';
alter table public.profiles add column if not exists cover_url text;
alter table public.profiles add column if not exists interests text[] not null default '{}';
create unique index if not exists activity_creation_request on public.activities(created_by,idempotency_key) where idempotency_key is not null;
-- This migration runner records executions, so the baseline is captured once.
update public.activities a set historical_approved_count=greatest(0,a.applied-(select count(*) from public.applications ap where ap.activity_id=a.id and ap.status='approved'));
update public.applications a set user_id=c.user_id from public.certificates c where c.application_id=a.id and a.user_id is null and c.user_id is not null;
update public.applications a set checkin_status='checked_in',has_certificate=true,verified_hours=c.hours from public.certificates c where c.application_id=a.id;
create schema if not exists private;
revoke all on schema private from public,anon,authenticated;
create or replace function private.sync_application_count() returns trigger language plpgsql set search_path='' as $$
begin
 if TG_OP<>'INSERT' then
   update public.activities a set applied=a.historical_approved_count+(select count(*) from public.applications ap where ap.activity_id=a.id and ap.status='approved') where a.id=OLD.activity_id;
 end if;
 if TG_OP<>'DELETE' then
   update public.activities a set applied=a.historical_approved_count+(select count(*) from public.applications ap where ap.activity_id=a.id and ap.status='approved') where a.id=NEW.activity_id;
 end if;
 return null;
end $$;
create trigger applications_sync_counter after insert or update or delete on public.applications for each row execute function private.sync_application_count();
create or replace function private.sync_certificate_hours() returns trigger language plpgsql set search_path='' as $$
begin
 if TG_OP<>'INSERT' then
   update public.profiles p set verified_hours=coalesce((select sum(c.hours) from public.certificates c where c.user_id=p.id),0) where p.id=OLD.user_id;
 end if;
 if TG_OP<>'DELETE' then
   update public.profiles p set verified_hours=coalesce((select sum(c.hours) from public.certificates c where c.user_id=p.id),0) where p.id=NEW.user_id;
 end if;
 return null;
end $$;
create trigger certificates_sync_hours after insert or update or delete on public.certificates for each row execute function private.sync_certificate_hours();
update public.profiles p set verified_hours=coalesce((select sum(c.hours) from public.certificates c where c.user_id=p.id),0);

create table public.change_events(id bigint generated always as identity primary key,entity text not null,owner_id uuid,created_at timestamptz not null default now());
create index change_events_owner_time on public.change_events(owner_id,created_at);
alter table public.change_events enable row level security;
revoke all on public.change_events from anon,authenticated;
grant select on public.change_events to anon,authenticated;
create policy changes_visible on public.change_events for select to anon,authenticated using (owner_id is null or owner_id=(select auth.uid()));
create or replace function private.notify_change() returns trigger language plpgsql set search_path='' as $$
declare r jsonb; u uuid; org_owner uuid;
begin
 r=case when TG_OP='DELETE' then to_jsonb(OLD) else to_jsonb(NEW) end;
 if TG_TABLE_NAME in ('activities','system_themes','site_content','stories','story_likes') then
   insert into public.change_events(entity) values(TG_TABLE_NAME);
 else
   u=case when TG_TABLE_NAME='profiles' then (r->>'id')::uuid when TG_TABLE_NAME='organizations' then (r->>'owner_id')::uuid else (r->>'user_id')::uuid end;
   if u is not null then insert into public.change_events(entity,owner_id) values(TG_TABLE_NAME,u); end if;
   if TG_TABLE_NAME in ('applications','organizations','profile_documents') then
     insert into public.change_events(entity,owner_id) select TG_TABLE_NAME,p.id from public.profiles p where p.role='admin' and p.id is distinct from u;
   end if;
   if TG_TABLE_NAME='applications' then
     select o.owner_id into org_owner from public.activities a join public.organizations o on o.id=a.organization_id where a.id=r->>'activity_id';
     if org_owner is not null and org_owner is distinct from u then insert into public.change_events(entity,owner_id) values(TG_TABLE_NAME,org_owner); end if;
   end if;
 end if;
 delete from public.change_events where created_at<now()-interval '2 days';
 return null;
end $$;
create table public.stories(id text primary key default gen_random_uuid()::text,user_id uuid references public.profiles(id) on delete set null,title text not null,body text not null,category text not null default 'all',legacy_likes integer not null default 0,created_at timestamptz not null default now());
create table public.story_likes(story_id text references public.stories(id) on delete cascade,user_id uuid references public.profiles(id) on delete cascade,primary key(story_id,user_id));
create table public.profile_documents(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles(id) on delete cascade,name text not null,path text not null,created_at timestamptz not null default now());
alter table public.stories enable row level security;
alter table public.story_likes enable row level security;
alter table public.profile_documents enable row level security;
revoke all on public.stories,public.story_likes,public.profile_documents from anon,authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('profile-docs','profile-docs',false,15728640,array['application/pdf','image/jpeg','image/png']) on conflict(id) do nothing;
do $$ declare t text; begin
 foreach t in array array['profiles','organizations','activities','applications','certificates','notifications','favorites','system_themes','site_content','stories','story_likes','profile_documents'] loop
   execute format('create trigger emit_change after insert or update or delete on public.%I for each row execute function private.notify_change()',t);
 end loop;
 if not exists(select 1 from pg_publication where pubname='supabase_realtime') then create publication supabase_realtime; end if;
 if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and tablename='change_events') then alter publication supabase_realtime add table public.change_events; end if;
end $$;
