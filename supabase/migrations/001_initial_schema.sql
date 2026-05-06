-- Create users table with role-based access control
create table if not exists public.users (
  id uuid not null primary key references auth.users (id) on delete cascade,
  email text not null unique,
  name text,
  role text not null default 'analyst' check (role in ('analyst', 'it_staff', 'leadership')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create demand_requests table
create table if not exists public.demand_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'delayed', 'cancelled')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  category text not null,
  requester_id uuid not null references public.users (id) on delete cascade,
  assigned_to uuid references public.users (id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  due_date timestamp with time zone,
  completed_at timestamp with time zone,
  notes text
);

-- Create audit_logs table for tracking changes
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  action text not null,
  table_name text not null,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamp with time zone default now()
);

-- Enable RLS (Row Level Security)
alter table public.users enable row level security;
alter table public.demand_requests enable row level security;
alter table public.audit_logs enable row level security;

-- Users can read their own record
create policy "Users can read own profile"
  on public.users
  for select
  using (auth.uid() = id);

-- IT staff and leadership can read all users
create policy "IT staff and leadership can read all users"
  on public.users
  for select
  using (
    (select role from public.users where id = auth.uid()) in ('it_staff', 'leadership')
  );

-- All authenticated users can read demand requests
create policy "Authenticated users can read demand requests"
  on public.demand_requests
  for select
  using (auth.role() = 'authenticated');

-- Users can create demand requests
create policy "Users can create demand requests"
  on public.demand_requests
  for insert
  with check (auth.uid() = requester_id);

-- IT staff and leadership can update demand requests
create policy "IT staff and leadership can update demand requests"
  on public.demand_requests
  for update
  using (
    (select role from public.users where id = auth.uid()) in ('it_staff', 'leadership')
  );

-- Create indexes for performance
create index if not exists idx_demand_requests_status on public.demand_requests(status);
create index if not exists idx_demand_requests_priority on public.demand_requests(priority);
create index if not exists idx_demand_requests_category on public.demand_requests(category);
create index if not exists idx_demand_requests_created_at on public.demand_requests(created_at);
create index if not exists idx_audit_logs_user_id on public.audit_logs(user_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at);
