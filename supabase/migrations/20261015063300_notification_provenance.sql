-- Keep generated notifications tied to their originating activity.
alter table public.notifications add column if not exists source_activity_id text references public.activities(id) on delete cascade;
create index if not exists notifications_source_activity_idx on public.notifications(source_activity_id) where source_activity_id is not null;
