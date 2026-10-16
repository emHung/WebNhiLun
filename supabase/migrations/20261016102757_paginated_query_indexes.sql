-- Support bounded Stories lists and organizer ownership joins without changing access grants.
create index if not exists stories_created_id_idx on public.stories(created_at desc,id desc);
create index if not exists stories_category_created_id_idx on public.stories(category,created_at desc,id desc);
create index if not exists activities_organization_idx on public.activities(organization_id,id);
