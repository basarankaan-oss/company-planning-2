create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role='admin');
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view own profile or admin can view all" on public.profiles
for select to authenticated using (auth.uid()=id or public.is_admin());

drop policy if exists "Employees can view their own shifts" on public.shifts;
create policy "Employees can view own shifts or admin can view all" on public.shifts
for select to authenticated using (auth.uid()=employee_id or public.is_admin());

drop policy if exists "Employees can update their own shifts" on public.shifts;
create policy "Employees can update own shifts or admin can update all" on public.shifts
for update to authenticated using (auth.uid()=employee_id or public.is_admin())
with check (auth.uid()=employee_id or public.is_admin());

drop policy if exists "Employees can delete their own shifts" on public.shifts;
create policy "Employees can delete own shifts or admin can delete all" on public.shifts
for delete to authenticated using (auth.uid()=employee_id or public.is_admin());

-- Admin hesabını oluşturduktan sonra:
-- UPDATE public.profiles SET role='admin'
-- WHERE id=(SELECT id FROM auth.users WHERE email='ADMIN_EMAIL');
