-- Auth deletes cascade under supabase_auth_admin, not the FastAPI DB role.
-- These trigger-only functions live in an unexposed schema and cannot be called by clients.
alter function private.notify_change() security definer;
alter function private.sync_application_count() security definer;
alter function private.sync_certificate_hours() security definer;
revoke all on function private.notify_change(),private.sync_application_count(),private.sync_certificate_hours() from public,anon,authenticated;
