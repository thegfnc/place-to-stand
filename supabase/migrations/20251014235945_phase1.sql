-- Project UNIFY Phase 1 schema
-- Generated October 14, 2025

-- Enable required extensions
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Enumerations
create type public.user_role as enum ('admin', 'worker', 'client');
create type public.task_status as enum (
  'backlog',
  'on_deck',
  'in_progress',
  'blocked',
  'awaiting_review',
  'done'
);

-- Profiles store role metadata and display details for every auth user
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.user_role not null default 'worker',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  status text not null default 'active',
  notes text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  name text not null,
  code text unique,
  summary text,
  status text not null default 'active',
  budget_hours numeric(10,2),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_hour_blocks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  purchased_hours numeric(10,2) not null check (purchased_hours > 0),
  effective_date date not null default current_date,
  note text,
  recorded_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  description text,
  status public.task_status not null default 'backlog',
  assignee_id uuid references public.profiles (id),
  reviewer_id uuid references public.profiles (id),
  due_date date,
  start_date date,
  position integer not null default 0,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  person_id uuid not null references public.profiles (id),
  minutes integer not null check (minutes > 0),
  entry_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.task_status_history (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  previous_status public.task_status,
  new_status public.task_status not null,
  changed_by uuid references public.profiles (id),
  changed_at timestamptz not null default now()
);

-- Maintain updated_at columns
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_clients_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger set_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

-- RLS policies
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.project_hour_blocks enable row level security;
alter table public.tasks enable row level security;
alter table public.time_entries enable row level security;
alter table public.task_status_history enable row level security;

-- Helper expression: returns true if current user has one of the roles
create or replace function public.current_user_has_role(allowed_roles public.user_role[])
returns boolean as $$
declare
  matches integer;
begin
  select count(*)
  into matches
  from public.profiles p
  where p.id = auth.uid()
    and p.role = any(allowed_roles);
  return coalesce(matches, 0) > 0;
end;
$$ language plpgsql security definer;

grant execute on function public.current_user_has_role to authenticated;

grant usage on type public.user_role to authenticated;

grant usage on type public.task_status to authenticated;

-- Profiles policies
create policy "Profiles are viewable by internal users"
  on public.profiles
  for select
  using (
    auth.uid() = id
    or public.current_user_has_role(array['admin', 'worker']::public.user_role[])
  );

create policy "Only admins can update other profiles"
  on public.profiles
  for update
  using (public.current_user_has_role(array['admin']::public.user_role[]));

create policy "Profiles can update themselves"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Clients policies
create policy "Internal users can view clients"
  on public.clients
  for select
  using (public.current_user_has_role(array['admin','worker']::public.user_role[]));

create policy "Admins manage clients"
  on public.clients
  for all
  using (public.current_user_has_role(array['admin']::public.user_role[]));

-- Projects policies
create policy "Internal users can view projects"
  on public.projects
  for select
  using (public.current_user_has_role(array['admin','worker']::public.user_role[]));

create policy "Admins manage projects"
  on public.projects
  for all
  using (public.current_user_has_role(array['admin']::public.user_role[]));

-- Hour blocks policies
create policy "Internal can view hour blocks"
  on public.project_hour_blocks
  for select
  using (public.current_user_has_role(array['admin','worker']::public.user_role[]));

create policy "Admins manage hour blocks"
  on public.project_hour_blocks
  for all
  using (public.current_user_has_role(array['admin']::public.user_role[]));

-- Tasks policies
create policy "Internal users can view tasks"
  on public.tasks
  for select
  using (public.current_user_has_role(array['admin','worker']::public.user_role[]));

create policy "Internal users can insert tasks"
  on public.tasks
  for insert
  with check (public.current_user_has_role(array['admin','worker']::public.user_role[]));

create policy "Workers can update their tasks"
  on public.tasks
  for update
  using (public.current_user_has_role(array['admin','worker']::public.user_role[]));

create policy "Admins remove tasks"
  on public.tasks
  for delete
  using (public.current_user_has_role(array['admin']::public.user_role[]));

-- Time entry policies
create policy "Internal users can view time entries"
  on public.time_entries
  for select
  using (public.current_user_has_role(array['admin','worker']::public.user_role[]));

create policy "Workers can insert time entries"
  on public.time_entries
  for insert
  with check (public.current_user_has_role(array['admin','worker']::public.user_role[]));

create policy "Workers manage their own time entries"
  on public.time_entries
  for update using (
    public.current_user_has_role(array['admin']::public.user_role[]) or person_id = auth.uid()
  )
  with check (
    public.current_user_has_role(array['admin']::public.user_role[]) or person_id = auth.uid()
  );

create policy "Admins delete time entries"
  on public.time_entries
  for delete
  using (public.current_user_has_role(array['admin']::public.user_role[]));

-- Task status history policies (read-only for internal)
create policy "Internal users can view status history"
  on public.task_status_history
  for select
  using (public.current_user_has_role(array['admin','worker']::public.user_role[]));

create policy "Internal users can insert status history"
  on public.task_status_history
  for insert
  with check (public.current_user_has_role(array['admin','worker']::public.user_role[]));

-- Ensure every authenticated user has a profile row
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce((new.raw_app_meta_data->>'role')::public.user_role, 'worker'))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
