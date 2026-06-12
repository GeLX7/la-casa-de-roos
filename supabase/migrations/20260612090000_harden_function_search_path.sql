-- Security hardening: pin search_path on trigger functions
-- (supabase advisor lint 0011_function_search_path_mutable).
-- Applied to la-casa-de-roos production (ref eyzbjtcelekuczqobhau) on 2026-06-12.

alter function public.touch_updated_at() set search_path = public;
alter function public.prevent_booking_manual_overlap() set search_path = public;
