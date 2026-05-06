-- Add notifications table for the notification system
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  type text not null default 'info' check (type in ('info', 'warning', 'error', 'success')),
  title text not null,
  message text not null,
  read boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on notifications
alter table public.notifications enable row level security;

-- Users can only read their own notifications
create policy "Users can read own notifications"
  on public.notifications
  for select
  using (auth.uid() = user_id);

-- Create index for efficient querying
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_read on public.notifications(read);
create index if not exists idx_notifications_created_at on public.notifications(created_at);
