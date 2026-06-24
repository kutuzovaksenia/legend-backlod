create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  assignee text,
  team text,
  priority text not null default 'Средний',
  status text not null default 'Бэклог',
  due_date date,
  source text not null default 'manual',
  archived boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

alter table tasks enable row level security;
create policy "public read" on tasks for select using (true);
create policy "public write" on tasks for all using (true);
