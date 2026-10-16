update storage.buckets set public=false where id='certificates';
drop policy if exists certificate_public_read on storage.objects;
