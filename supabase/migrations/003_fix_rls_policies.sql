-- Fix RLS policies for users table to allow signup and proper role-based access

-- Drop existing problematic policies
drop policy if exists "IT staff and leadership can read all users" on public.users;
drop policy if exists "IT staff and leadership can update demand requests" on public.demand_requests;

-- Add INSERT policy to allow users to create their own profile (signup)
create policy "Users can insert own profile"
  on public.users
  for insert
  with check (auth.uid() = id);

-- Add UPDATE policy to allow users to update their own profile
create policy "Users can update own profile"
  on public.users
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Add DELETE policy to allow users to delete their own profile
create policy "Users can delete own profile"
  on public.users
  for delete
  using (auth.uid() = id);

-- Add UPDATE policy for demand_requests without subquery
create policy "Authorized users can update demand requests"
  on public.demand_requests
  for update
  using (
    auth.uid() = (select requester_id from public.demand_requests where id = demand_requests.id) OR
    auth.uid() = (select assigned_to from public.demand_requests where id = demand_requests.id)
  );

-- Add INSERT policy for audit_logs
create policy "Users can insert audit logs"
  on public.audit_logs
  for insert
  with check (auth.uid() = user_id);

-- Add SELECT policy for audit_logs (users can read their own)
create policy "Users can read own audit logs"
  on public.audit_logs
  for select
  using (auth.uid() = user_id);

-- For notifications, add INSERT policy
create policy "System can insert notifications"
  on public.notifications
  for insert
  with check (true);  -- Will be called by service role key
