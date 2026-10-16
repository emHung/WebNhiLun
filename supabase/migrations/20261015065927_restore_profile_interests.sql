-- Restore missing legacy demo interests only; retain any existing profile choices.
update public.profiles set interests=array['Môi trường','Giáo dục','Cộng đồng','Trẻ em','Động vật']::text[] where legacy_id='USR-001' and coalesce(cardinality(interests),0)=0;
