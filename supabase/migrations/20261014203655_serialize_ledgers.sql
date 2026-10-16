create or replace function private.sync_certificate_hours() returns trigger language plpgsql set search_path='' as $$
declare owners uuid[]; owner uuid;
begin
 if TG_OP='INSERT' then owners=array[NEW.user_id]; elsif TG_OP='DELETE' then owners=array[OLD.user_id]; else owners=array[OLD.user_id,NEW.user_id]; end if;
 -- Serialize per-profile ledgers before taking a fresh aggregate snapshot.
 for owner in select distinct u from unnest(owners) u where u is not null order by u loop
   perform 1 from public.profiles p where p.id=owner for update;
   update public.profiles p set verified_hours=coalesce((select sum(c.hours) from public.certificates c where c.user_id=owner),0) where p.id=owner;
 end loop;
 return null;
end $$;
create or replace function private.sync_application_count() returns trigger language plpgsql set search_path='' as $$
declare ids text[]; activity text;
begin
 if TG_OP='INSERT' then ids=array[NEW.activity_id]; elsif TG_OP='DELETE' then ids=array[OLD.activity_id]; else ids=array[OLD.activity_id,NEW.activity_id]; end if;
 for activity in select distinct i from unnest(ids) i order by i loop
   perform 1 from public.activities a where a.id=activity for update;
   update public.activities a set applied=a.historical_approved_count+(select count(*) from public.applications ap where ap.activity_id=activity and ap.status='approved') where a.id=activity;
 end loop;
 return null;
end $$;
