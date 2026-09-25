-- ==============================================================================
-- NOTES-APP: Database Schema (Supabase / Postgres)
-- ==============================================================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Projects Table
create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    name text not null,
    slug text not null unique,
    description text default '',
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Sections Table (e.g. Core, Schemas, Prompts, Architecture)
create table if not exists public.sections (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references public.projects(id) on delete cascade not null,
    name text not null,
    is_custom boolean default false not null,
    sort_order int default 0 not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. Items Table (Nodes: to-dos, notes, tech stack, deep-dives, questions, custom)
create table if not exists public.items (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references public.projects(id) on delete cascade not null,
    section_id uuid references public.sections(id) on delete set null,
    type text not null check (type in ('todo', 'note', 'tech', 'deep_dive', 'question', 'custom')),
    title text not null,
    content text default '',
    metadata jsonb default '{}'::jsonb not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 4. Item Links Table (Directed Graph Edges)
create table if not exists public.item_links (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references public.projects(id) on delete cascade not null,
    source_item_id uuid references public.items(id) on delete cascade not null,
    target_item_id uuid references public.items(id) on delete cascade not null,
    label text default '',
    created_at timestamptz default timezone('utc'::text, now()) not null,
    constraint unique_directed_link unique (source_item_id, target_item_id)
);

-- Indexes for lightning fast graph lookups
create index if not exists idx_projects_slug on public.projects(slug);
create index if not exists idx_items_project on public.items(project_id);
create index if not exists idx_items_type on public.items(type);
create index if not exists idx_sections_project on public.sections(project_id);
create index if not exists idx_links_project on public.item_links(project_id);
create index if not exists idx_links_source on public.item_links(source_item_id);
create index if not exists idx_links_target on public.item_links(target_item_id);

-- Auto-update updated_at timestamp function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
    before update on public.projects
    for each row execute function public.handle_updated_at();

drop trigger if exists set_items_updated_at on public.items;
create trigger set_items_updated_at
    before update on public.items
    for each row execute function public.handle_updated_at();

-- Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.sections enable row level security;
alter table public.items enable row level security;
alter table public.item_links enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Access projects" on public.projects;
drop policy if exists "Access sections" on public.sections;
drop policy if exists "Access items" on public.items;
drop policy if exists "Access item_links" on public.item_links;

-- Policies: Single user or public template if user_id is null
create policy "Access projects" on public.projects
    for all using (user_id is null or user_id = auth.uid());

create policy "Access sections" on public.sections
    for all using (project_id in (select id from public.projects where user_id is null or user_id = auth.uid()));

create policy "Access items" on public.items
    for all using (project_id in (select id from public.projects where user_id is null or user_id = auth.uid()));

create policy "Access item_links" on public.item_links
    for all using (project_id in (select id from public.projects where user_id is null or user_id = auth.uid()));

-- Enable Supabase Realtime for instant canvas sync across surfaces
alter publication supabase_realtime add table public.projects;
alter publication supabase_realtime add table public.sections;
alter publication supabase_realtime add table public.items;
alter publication supabase_realtime add table public.item_links;
