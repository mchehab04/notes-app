-- ==============================================================================
-- NOTES-APP: Seed Data for 8 Curated Learning-AI Projects
-- ==============================================================================

-- 1. Insert 8 Curated Projects
insert into public.projects (name, slug, description)
values
    ('Personal-Portfolio', 'personal-portfolio', 'Week-1 personal portfolio and showcase project'),
    ('Dinas-studio', 'dinas-studio', 'Week-2 handcrafted ceramics e-commerce platform & inventory system'),
    ('Automation-Pipeline-Project', 'automation-pipeline-project', 'Week-3 automated CI/CD and deployment pipeline'),
    ('e-Invoicing-Project', 'e-invoicing-project', 'Week-4 UAE e-invoicing compliance and validation engine'),
    ('Data-Science-Project', 'data-science-project', 'Week-5 data exploration, model training, and analysis'),
    ('F1-race-prediction', 'f1-race-prediction', 'Week-5 machine learning race prediction using FastF1 data'),
    ('personal-dashboard', 'personal-dashboard', 'Week-6 unified productivity and learning progress dashboard'),
    ('notes-app', 'notes-app', 'Week-6 visual connected notes and knowledge graph across projects')
on conflict (slug) do nothing;

-- 2. Create Default Sections for Each Seeded Project
do $$
declare
    proj record;
begin
    for proj in select id from public.projects loop
        insert into public.sections (project_id, name, is_custom, sort_order)
        values 
            (proj.id, 'Core', false, 1),
            (proj.id, 'Tech Stack', false, 2),
            (proj.id, 'Deep-Dives', false, 3),
            (proj.id, 'Questions & AI', false, 4)
        on conflict do nothing;
    end loop;
end $$;

-- 3. Seed Demonstrative Linked Flow in notes-app Project
do $$
declare
    p_id uuid;
    sec_core uuid;
    sec_tech uuid;
    sec_dd uuid;
    sec_q uuid;
    item_tech uuid;
    item_dd uuid;
    item_todo uuid;
    item_q uuid;
begin
    select id into p_id from public.projects where slug = 'notes-app';
    if p_id is not null then
        select id into sec_core from public.sections where project_id = p_id and name = 'Core';
        select id into sec_tech from public.sections where project_id = p_id and name = 'Tech Stack';
        select id into sec_dd from public.sections where project_id = p_id and name = 'Deep-Dives';
        select id into sec_q from public.sections where project_id = p_id and name = 'Questions & AI';

        -- Item 1: Tech Stack
        insert into public.items (project_id, section_id, type, title, content, metadata)
        values (
            p_id,
            sec_tech,
            'tech',
            'React Flow (@xyflow/react)',
            'Interactive node-based canvas engine for React.',
            '{"status": "open", "position": {"x": 80, "y": 140}, "tags": ["canvas", "frontend"]}'::jsonb
        ) returning id into item_tech;

        -- Item 2: Deep-Dive
        insert into public.items (project_id, section_id, type, title, content, metadata)
        values (
            p_id,
            sec_dd,
            'deep_dive',
            'Graph State & Custom Nodes in React Flow',
            '# Deep-Dive: React Flow Custom Node Architecture\n\nReact Flow manages node positions via viewport coordinates. By attaching custom handles (`type="source"` and `type="target"`), nodes support drag-and-drop link creation.\n\n### Sync Strategy\n- Viewport panning/zooming stays in client memory\n- Node drag stop triggers debounced sync (500ms) to Supabase `metadata.position`\n- Edges correspond directly to the `item_links` relation table',
            '{"status": "open", "position": {"x": 380, "y": 80}, "tags": ["architecture", "deep-dive"]}'::jsonb
        ) returning id into item_dd;

        -- Item 3: To-Do
        insert into public.items (project_id, section_id, type, title, content, metadata)
        values (
            p_id,
            sec_core,
            'todo',
            'Implement debounced canvas position auto-sync',
            'Save `{x, y}` coordinates to Supabase after 500ms debounce on node drag stop.',
            '{"status": "done", "position": {"x": 380, "y": 280}, "tags": ["canvas"]}'::jsonb
        ) returning id into item_todo;

        -- Item 4: Question
        insert into public.items (project_id, section_id, type, title, content, metadata)
        values (
            p_id,
            sec_q,
            'question',
            'Should links support animated gradient flow pulses?',
            'Adding subtle stroke dash animations to links indicating workflow sequence.',
            '{"status": "open", "position": {"x": 720, "y": 180}, "tags": ["ui-polish"]}'::jsonb
        ) returning id into item_q;

        -- Create Links (Edges)
        -- Link 1: Tech -> Deep-Dive (label: "explained by")
        insert into public.item_links (project_id, source_item_id, target_item_id, label)
        values (p_id, item_tech, item_dd, 'explained by')
        on conflict do nothing;

        -- Link 2: Tech -> To-Do (label: "powers")
        insert into public.item_links (project_id, source_item_id, target_item_id, label)
        values (p_id, item_tech, item_todo, 'powers')
        on conflict do nothing;

        -- Link 3: To-Do -> Question (label: "raises")
        insert into public.item_links (project_id, source_item_id, target_item_id, label)
        values (p_id, item_todo, item_q, 'raises')
        on conflict do nothing;

    end if;
end $$;

-- 4. Seed Dinas Studio Notes & Links
do $$
declare
    p_id uuid;
    s_core uuid; s_tech uuid; s_q uuid;
    t1 uuid; n1 uuid; n2 uuid; td1 uuid; td2 uuid; q1 uuid;
begin
    select id into p_id from public.projects where slug = 'dinas-studio';
    if p_id is not null then
        select id into s_core from public.sections where project_id = p_id and name = 'Core';
        select id into s_tech from public.sections where project_id = p_id and name = 'Tech Stack';
        select id into s_q from public.sections where project_id = p_id and name = 'Questions & AI';

        insert into public.items (project_id, section_id, type, title, content, metadata)
        values (p_id, s_tech, 'tech', 'Supabase (Postgres & Auth)', 'Database, user authentication, and daily keep-alive.', '{"position": {"x": 60, "y": 80}, "tags": ["database"]}'::jsonb) returning id into t1;

        insert into public.items (project_id, section_id, type, title, content, metadata)
        values (p_id, s_core, 'note', 'Sale Pricing & Inventory Rules', 'Short sets: originally 130 -> sale price 110 AED.\nKimono: original price 70 -> sale price 55 AED.', '{"position": {"x": 380, "y": 60}}'::jsonb) returning id into n1;

        insert into public.items (project_id, section_id, type, title, content, metadata)
        values (p_id, s_core, 'note', 'Regional Shipping Fee Matrix', 'Lebanon: Beirut ($5), Mount Lebanon ($10), Other (WhatsApp).\nUAE: Dubai (AED 25), Sharjah (AED 40), Rest (AED 50).', '{"position": {"x": 380, "y": 240}}'::jsonb) returning id into n2;

        insert into public.items (project_id, section_id, type, title, content, metadata)
        values (p_id, s_core, 'todo', 'Make item images swipeable / scrollable', 'Allow horizontal swipe/scroll between images on mobile and desktop.', '{"status": "open", "position": {"x": 720, "y": 60}}'::jsonb) returning id into td1;

        insert into public.items (project_id, section_id, type, title, content, metadata)
        values (p_id, s_core, 'todo', 'Add Whish Money & IBAN to footer details', 'Whish Money for Lebanon orders; IBAN for UAE orders (shared on WhatsApp).', '{"status": "open", "position": {"x": 720, "y": 240}}'::jsonb) returning id into td2;

        insert into public.items (project_id, section_id, type, title, content, metadata)
        values (p_id, s_q, 'question', 'How can admin access replies to orders@dinasstudio.com?', 'Need admin email forwarding and WhatsApp signature.', '{"status": "open", "position": {"x": 1060, "y": 140}}'::jsonb) returning id into q1;

        insert into public.item_links (project_id, source_item_id, target_item_id, label) values (p_id, t1, n1, 'stores pricing') on conflict do nothing;
        insert into public.item_links (project_id, source_item_id, target_item_id, label) values (p_id, n2, td2, 'requires footer') on conflict do nothing;
        insert into public.item_links (project_id, source_item_id, target_item_id, label) values (p_id, td1, n1, 'enhances') on conflict do nothing;
    end if;
end $$;

-- 5. Seed F1 Race Prediction Notes & Deep-Dives
do $$
declare
    p_id uuid;
    s_core uuid; s_tech uuid; s_dd uuid; s_q uuid;
    t1 uuid; dd1 uuid; dd2 uuid; td1 uuid; q1 uuid;
begin
    select id into p_id from public.projects where slug = 'f1-race-prediction';
    if p_id is not null then
        select id into s_core from public.sections where project_id = p_id and name = 'Core';
        select id into s_tech from public.sections where project_id = p_id and name = 'Tech Stack';
        select id into s_dd from public.sections where project_id = p_id and name = 'Deep-Dives';
        select id into s_q from public.sections where project_id = p_id and name = 'Questions & AI';

        insert into public.items (project_id, section_id, type, title, content, metadata)
        values (p_id, s_tech, 'tech', 'FastF1 API', 'fastf1.Cache.enable_cache, get_session, get_event_schedule', '{"position": {"x": 60, "y": 80}}'::jsonb) returning id into t1;

        insert into public.items (project_id, section_id, type, title, content, metadata)
        values (p_id, s_dd, 'deep_dive', 'FastF1 API Internals & Telemetry Caching', '# FastF1 API Internals & Telemetry Storage\n\n### How Data Pulling Decided Table Schemas\nUnderstanding how data was pulled from FastF1 directly decided table structures and column types.\n\n- `fastf1.Cache.enable_cache()`\n- `get_session()`\n- `session.load()`', '{"position": {"x": 380, "y": 60}}'::jsonb) returning id into dd1;

        insert into public.items (project_id, section_id, type, title, content, metadata)
        values (p_id, s_dd, 'deep_dive', 'Ground-Effect Era (2022-2026) & Data Cleaning', '# Ground-Effect Era & Data Cleaning Methodology\n\n- Scope: 2022-2026 regulations\n- Classified position vs position across 33 statuses\n- Null imputation: MSC 2022 R2 & STR 2023 R15 set to position 20.', '{"position": {"x": 380, "y": 280}}'::jsonb) returning id into dd2;

        insert into public.items (project_id, section_id, type, title, content, metadata)
        values (p_id, s_core, 'todo', 'Execute Teammate Head-to-Head concordance analysis', 'Run DuckDB concordance query across 2022-2025.', '{"status": "open", "position": {"x": 780, "y": 140}}'::jsonb) returning id into td1;

        insert into public.items (project_id, section_id, type, title, content, metadata)
        values (p_id, s_q, 'question', 'Teammate H2H: Quali-to-race concordance rate', 'If Driver A out-qualifies Driver B, how often do they finish ahead in the race?', '{"status": "open", "position": {"x": 1140, "y": 140}}'::jsonb) returning id into q1;

        insert into public.item_links (project_id, source_item_id, target_item_id, label) values (p_id, t1, dd1, 'documented by') on conflict do nothing;
        insert into public.item_links (project_id, source_item_id, target_item_id, label) values (p_id, dd1, dd2, 'leads to cleaning') on conflict do nothing;
        insert into public.item_links (project_id, source_item_id, target_item_id, label) values (p_id, dd2, td1, 'prepares') on conflict do nothing;
        insert into public.item_links (project_id, source_item_id, target_item_id, label) values (p_id, td1, q1, 'answers') on conflict do nothing;
    end if;
end $$;
