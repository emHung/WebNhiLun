alter function public.touch_updated_at() set search_path='';
revoke execute on function public.touch_updated_at() from public,anon,authenticated;
revoke execute on function public.handle_new_auth_user() from public,anon,authenticated;
grant execute on function public.handle_new_auth_user() to supabase_auth_admin;
