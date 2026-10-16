alter table public.applications add column if not exists is_historical boolean not null default false;
alter table public.applications add column if not exists historical_date date;
lock table public.activities, public.applications, public.certificates in share row exclusive mode;
create temporary table original_counts on commit drop as select id,applied from public.activities;
-- Legacy awards precede current event dates; they are recognition history, not future shifts.
update public.applications ap set is_historical=true,historical_date=c.issue_date,status='approved',status_text='Hoàn thành (dữ liệu lịch sử)',checkin_status='checked_in',has_certificate=true,verified_hours=c.hours from public.certificates c join public.activities a on a.id=c.activity_id where c.application_id=ap.id and c.issue_date<a.event_date;
create or replace function private.sync_application_count() returns trigger language plpgsql security definer set search_path='' as $$
declare ids text[]; activity text;
begin
 if TG_OP='INSERT' then ids=array[NEW.activity_id]; elsif TG_OP='DELETE' then ids=array[OLD.activity_id]; else ids=array[OLD.activity_id,NEW.activity_id]; end if;
 for activity in select distinct i from unnest(ids) i order by i loop
   perform 1 from public.activities a where a.id=activity for update;
   update public.activities a set applied=a.historical_approved_count+(select count(*) from public.applications ap where ap.activity_id=activity and ap.status='approved' and not ap.is_historical) where a.id=activity;
 end loop;
 return null;
end $$;
revoke all on function private.sync_application_count() from public,anon,authenticated;
update public.activities a set historical_approved_count=greatest(0,oc.applied-(select count(*) from public.applications ap where ap.activity_id=a.id and ap.status='approved' and not ap.is_historical)),applied=oc.applied from original_counts oc where oc.id=a.id;
