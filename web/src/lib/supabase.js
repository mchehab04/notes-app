import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isLiveSupabase = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isLiveSupabase
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial 8 Curated Projects
export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Personal-Portfolio',
    slug: 'personal-portfolio',
    description: 'Week-1 personal portfolio and showcase project',
    created_at: '2026-09-01T00:00:00Z'
  },
  {
    id: 'proj-2',
    name: 'Dinas-studio',
    slug: 'dinas-studio',
    description: 'Week-2 handcrafted ceramics e-commerce platform & inventory system',
    created_at: '2026-09-07T00:00:00Z'
  },
  {
    id: 'proj-3',
    name: 'Automation-Pipeline-Project',
    slug: 'automation-pipeline-project',
    description: 'Week-3 automated CI/CD and deployment pipeline',
    created_at: '2026-09-14T00:00:00Z'
  },
  {
    id: 'proj-4',
    name: 'e-Invoicing-Project',
    slug: 'e-invoicing-project',
    description: 'Week-4 UAE e-invoicing compliance and validation engine',
    created_at: '2026-09-18T00:00:00Z'
  },
  {
    id: 'proj-5',
    name: 'Data-Science-Project',
    slug: 'data-science-project',
    description: 'Week-5 data exploration, model training, and analysis',
    created_at: '2026-09-21T00:00:00Z'
  },
  {
    id: 'proj-6',
    name: 'F1-race-prediction',
    slug: 'f1-race-prediction',
    description: 'Week-5 machine learning race prediction using FastF1 data',
    created_at: '2026-09-22T00:00:00Z'
  },
  {
    id: 'proj-7',
    name: 'personal-dashboard',
    slug: 'personal-dashboard',
    description: 'Week-6 unified productivity and learning progress dashboard',
    created_at: '2026-09-24T00:00:00Z'
  },
  {
    id: 'proj-8',
    name: 'notes-app',
    slug: 'notes-app',
    description: 'Week-6 visual connected notes and knowledge graph across projects',
    created_at: '2026-09-25T00:00:00Z'
  }
];

// Seed Items for notes-app, dinas-studio, e-invoicing-project, and f1-race-prediction
export const INITIAL_ITEMS = [
  // ─── NOTES-APP (proj-8) ───────────────────────────────────────────────────
  {
    id: 'item-1',
    project_id: 'proj-8',
    type: 'tech',
    title: 'React Flow (@xyflow/react)',
    content: 'Interactive node-based canvas engine for React.',
    metadata: {
      status: 'open',
      position: { x: 80, y: 140 },
      tags: ['canvas', 'frontend']
    }
  },
  {
    id: 'item-2',
    project_id: 'proj-8',
    type: 'deep_dive',
    title: 'Graph State & Custom Nodes in React Flow',
    content: `# Deep-Dive: React Flow Custom Node Architecture\n\nReact Flow manages node positions via viewport coordinates. By attaching custom handles (\`type="source"\` and \`type="target"\`), nodes support drag-and-drop link creation.\n\n### Sync Strategy\n- Viewport panning/zooming stays in client memory\n- Node drag stop triggers debounced sync (500ms) to Supabase \`metadata.position\`\n- Edges correspond directly to the \`item_links\` relation table`,
    metadata: {
      status: 'open',
      position: { x: 440, y: 80 },
      tags: ['architecture', 'deep-dive']
    }
  },
  {
    id: 'item-3',
    project_id: 'proj-8',
    type: 'todo',
    title: 'Implement debounced canvas position auto-sync',
    content: 'Save {x, y} coordinates to Supabase after 500ms debounce on node drag stop.',
    metadata: {
      status: 'done',
      position: { x: 440, y: 280 },
      tags: ['canvas']
    }
  },
  {
    id: 'item-4',
    project_id: 'proj-8',
    type: 'question',
    title: 'Should links support animated gradient flow pulses?',
    content: 'Adding subtle stroke dash animations to links indicating workflow sequence.',
    metadata: {
      status: 'open',
      position: { x: 800, y: 180 },
      tags: ['ui-polish']
    }
  },

  // ─── DINAS-STUDIO (proj-2) ────────────────────────────────────────────────
  {
    id: 'dinas-tech-1',
    project_id: 'proj-2',
    type: 'tech',
    title: 'Supabase (Postgres & Auth)',
    content: 'Database, user authentication, and daily keep-alive.',
    metadata: { position: { x: 60, y: 80 }, tags: ['database', 'backend'] }
  },
  {
    id: 'dinas-tech-2',
    project_id: 'proj-2',
    type: 'tech',
    title: 'Cloudflare & Netlify',
    content: 'Edge website hosting and CDN distribution.',
    metadata: { position: { x: 60, y: 240 }, tags: ['hosting', 'edge'] }
  },
  {
    id: 'dinas-note-1',
    project_id: 'proj-2',
    type: 'note',
    title: 'Sale Pricing & Inventory Rules',
    content: 'Short sets: originally 130 -> sale price 110 AED.\nKimono: original price 70 -> sale price 55 AED.',
    metadata: { position: { x: 380, y: 60 }, tags: ['pricing', 'sales'] }
  },
  {
    id: 'dinas-note-2',
    project_id: 'proj-2',
    type: 'note',
    title: 'Regional Shipping Fee Matrix',
    content: 'Lebanon orders: Beirut ($5), Mount Lebanon ($10), Other (WhatsApp) - show prices in USD only.\nUAE orders: Dubai (AED 25), Sharjah (AED 40), Rest (AED 50) - show both USD and AED.',
    metadata: { position: { x: 380, y: 240 }, tags: ['shipping', 'checkout'] }
  },
  {
    id: 'dinas-todo-1',
    project_id: 'proj-2',
    type: 'todo',
    title: 'Make item images swipeable / scrollable',
    content: 'Currently after clicking an item, user must tap small dot circle. Allow horizontal swipe/scroll.',
    metadata: { status: 'open', position: { x: 720, y: 60 } }
  },
  {
    id: 'dinas-todo-2',
    project_id: 'proj-2',
    type: 'todo',
    title: 'Show password requirements as typed',
    content: 'Display checklist: uppercase letter, number, and special character. Check off as typed.',
    metadata: { status: 'open', position: { x: 720, y: 220 } }
  },
  {
    id: 'dinas-todo-3',
    project_id: 'proj-2',
    type: 'todo',
    title: 'Support Enter key on Sign In & Sign Up',
    content: 'Pressing enter key should submit form directly rather than requiring explicit button click.',
    metadata: { status: 'done', position: { x: 720, y: 380 } }
  },
  {
    id: 'dinas-todo-4',
    project_id: 'proj-2',
    type: 'todo',
    title: 'Add Whish Money & IBAN to footer details',
    content: 'Whish Money number for Lebanon orders; IBAN for UAE orders (shared on WhatsApp from checkout number).',
    metadata: { status: 'open', position: { x: 380, y: 420 } }
  },
  {
    id: 'dinas-q-1',
    project_id: 'proj-2',
    type: 'question',
    title: 'How can admin access replies to orders@dinasstudio.com?',
    content: 'For confirmation emails, replies go to orders@dinasstudio.com. Need admin access and phone signature.',
    metadata: { status: 'open', position: { x: 1060, y: 120 } }
  },
  {
    id: 'dinas-q-2',
    project_id: 'proj-2',
    type: 'question',
    title: 'Should revenue update only when flipped to Delivered?',
    content: 'Since orders are Cash on Delivery (COD) and Bank Transfer (BT), revenue should count upon delivery.',
    metadata: { status: 'open', position: { x: 1060, y: 300 } }
  },

  // ─── E-INVOICING (proj-4) ─────────────────────────────────────────────────
  {
    id: 'einv-q-1',
    project_id: 'proj-4',
    type: 'question',
    title: 'Hamoudi: Manual fixes in accounting exports?',
    content: 'When generating export for accounting/audit, is there anything manually typed or fixed by hand before it is usable?',
    metadata: { status: 'open', position: { x: 60, y: 80 }, tags: ['interview', 'hamoudi'] }
  },
  {
    id: 'einv-q-2',
    project_id: 'proj-4',
    type: 'question',
    title: 'Hamoudi: Credit note invoice linking strictly enforced?',
    content: 'When weight deduction or price adjustment occurs, does ERP force selecting original invoice or is it typed in remarks?',
    metadata: { status: 'open', position: { x: 60, y: 260 }, tags: ['interview', 'hamoudi'] }
  },
  {
    id: 'einv-q-3',
    project_id: 'proj-4',
    type: 'question',
    title: 'Hamoudi: Domestic Reverse Charge 0% VAT handling',
    content: 'For local scrap sales under Domestic Reverse Charge, is there an RCM dropdown checkbox or manual 0% rate change?',
    metadata: { status: 'open', position: { x: 420, y: 80 }, tags: ['interview', 'hamoudi'] }
  },
  {
    id: 'einv-q-4',
    project_id: 'proj-4',
    type: 'question',
    title: 'Hamoudi: Are 15-digit TRN and Trade License mandatory?',
    content: 'In customer master list, are TRN and Trade License mandatory fields to save a customer record?',
    metadata: { status: 'open', position: { x: 420, y: 260 }, tags: ['interview', 'hamoudi'] }
  },
  {
    id: 'einv-q-5',
    project_id: 'proj-4',
    type: 'question',
    title: 'Abid: How does 10% retention money get deducted?',
    content: 'On milestone progress invoices to main contractors, does 10% retention appear as a negative line item or bottom note?',
    metadata: { status: 'open', position: { x: 780, y: 80 }, tags: ['interview', 'abid'] }
  },
  {
    id: 'einv-q-6',
    project_id: 'proj-4',
    type: 'question',
    title: 'Abid: Are line item units standardized or Lump Sum?',
    content: 'For electrical works, how are units listed on invoice lines (meters/pieces vs Lump Sum / Milestone 1)?',
    metadata: { status: 'open', position: { x: 780, y: 260 }, tags: ['interview', 'abid'] }
  },
  {
    id: 'einv-todo-1',
    project_id: 'proj-4',
    type: 'todo',
    title: 'Analyze redacted dummy sales tax invoice PDF against MoF rules',
    content: 'Test contracting line items, retention deductions, and mandatory fields against UAE Ministry of Finance mandate.',
    metadata: { status: 'open', position: { x: 1140, y: 160 } }
  },

  // ─── F1-RACE-PREDICTION (proj-6) ──────────────────────────────────────────
  {
    id: 'f1-tech-1',
    project_id: 'proj-6',
    type: 'tech',
    title: 'FastF1 API',
    content: 'fastf1.Cache.enable_cache, get_session, get_event_schedule',
    metadata: { position: { x: 60, y: 80 }, tags: ['api', 'f1'] }
  },
  {
    id: 'f1-tech-2',
    project_id: 'proj-6',
    type: 'tech',
    title: 'DuckDB In-Memory OLAP',
    content: 'duckdb.connect(f1.db), con.execute(SQL), duckdb UI',
    metadata: { position: { x: 60, y: 260 }, tags: ['database', 'olap'] }
  },
  {
    id: 'f1-dd-1',
    project_id: 'proj-6',
    type: 'deep_dive',
    title: 'FastF1 API Internals & Schema Mapping',
    content: `# FastF1 API Internals & Telemetry Storage\n\n### How Data Pulling Decided Table Schemas\nUnderstanding how data was pulled from FastF1 directly decided how the database tables and columns were designed.\n\n### Core Methods\n- \`fastf1.Cache.enable_cache('cache_dir')\`: Local caching layer\n- \`fastf1.get_session(year, round, session_type)\`: Fetches session metadata\n- \`session.load()\`: Loads laps, car telemetry, weather, and results\n\n### DuckDB Connection\n\`duckdb.connect('f1.db')\` serves as the fast analytical query layer with duckdb UI for interactive inspection.`,
    metadata: { position: { x: 380, y: 60 }, tags: ['deep-dive', 'architecture'] }
  },
  {
    id: 'f1-dd-2',
    project_id: 'proj-6',
    type: 'deep_dive',
    title: 'Ground-Effect Era (2022-2026) & Data Cleaning Methodology',
    content: `# Ground-Effect Era & Data Cleaning Methodology\n\n### Scope\nDecision taken to only include seasons for ground-effect regulations (2022–2026).\n\n### Position vs Classified Position\n- \`position\`: exact numbered finishing order (even non-finishers)\n- \`classified_position\`: varchar with number or ('R', 'D', 'W')\n- \`SELECT DISTINCT status FROM race_results\` revealed 33 distinct values. Anything with 'Finished', 'Lapped', '+1 Lap' mapped to \`varchar(position)\`. 'Did not start' / 'Withdrew' mapped to 'W', 'Disqualified' to 'D'.\n\n### Handling Null Grid Positions (MSC & STR)\nFound 2 null cases:\n1. MSC 2022 Round 2 (qualified P14, withdrew)\n2. STR 2023 Round 15 (qualified P20, withdrew)\nBoth races shifted grid up leaving P20 empty. Replaced nulls with \`grid_position = 20\` and \`position = 20\`.`,
    metadata: { position: { x: 380, y: 280 }, tags: ['data-cleaning', 'deep-dive'] }
  },
  {
    id: 'f1-q-1',
    project_id: 'proj-6',
    type: 'question',
    title: 'Teammate H2H: Quali-to-race concordance rate',
    content: 'If Driver A out-qualifies Driver B, how often does Driver A also finish ahead in the race?',
    metadata: { status: 'open', position: { x: 780, y: 60 }, tags: ['eda', 'teammate'] }
  },
  {
    id: 'f1-q-2',
    project_id: 'proj-6',
    type: 'question',
    title: 'Rolling 3-race or 5-race finish average momentum',
    content: 'Does recent rolling momentum correlate with next race outcome more than overall season average?',
    metadata: { status: 'open', position: { x: 780, y: 220 }, tags: ['eda', 'momentum'] }
  },
  {
    id: 'f1-q-3',
    project_id: 'proj-6',
    type: 'question',
    title: 'Circuit Chaos: Rank tracks by DNF rate & safety cars',
    content: 'Rank circuits by retirement rate. Highlights high-variance tracks (Baku, Spa) vs procession tracks (Monaco).',
    metadata: { status: 'open', position: { x: 780, y: 380 }, tags: ['eda', 'circuits'] }
  },
  {
    id: 'f1-todo-1',
    project_id: 'proj-6',
    type: 'todo',
    title: 'Execute DuckDB Teammate H2H concordance analysis',
    content: 'Run concordance SQL query across ground-effect seasons 2022-2025.',
    metadata: { status: 'open', position: { x: 1140, y: 120 } }
  },
  {
    id: 'f1-todo-2',
    project_id: 'proj-6',
    type: 'todo',
    title: 'Compute rolling 3-race finish averages per driver',
    content: 'Build window function over race order to test momentum hypothesis.',
    metadata: { status: 'open', position: { x: 1140, y: 280 } }
  }
];

// Initial Graph Links
export const INITIAL_LINKS = [
  // Notes App Links
  { id: 'link-1', project_id: 'proj-8', source_item_id: 'item-1', target_item_id: 'item-2', label: 'explained by' },
  { id: 'link-2', project_id: 'proj-8', source_item_id: 'item-1', target_item_id: 'item-3', label: 'powers' },
  { id: 'link-3', project_id: 'proj-8', source_item_id: 'item-3', target_item_id: 'item-4', label: 'raises' },

  // Dinas Studio Links
  { id: 'dinas-l-1', project_id: 'proj-2', source_item_id: 'dinas-tech-1', target_item_id: 'dinas-note-1', label: 'stores pricing' },
  { id: 'dinas-l-2', project_id: 'proj-2', source_item_id: 'dinas-note-2', target_item_id: 'dinas-todo-4', label: 'requires footer' },
  { id: 'dinas-l-3', project_id: 'proj-2', source_item_id: 'dinas-todo-1', target_item_id: 'dinas-note-1', label: 'enhances' },
  { id: 'dinas-l-4', project_id: 'proj-2', source_item_id: 'dinas-q-1', target_item_id: 'dinas-tech-1', label: 'relies on' },
  { id: 'dinas-l-5', project_id: 'proj-2', source_item_id: 'dinas-todo-2', target_item_id: 'dinas-todo-3', label: 'pairs with' },

  // e-Invoicing Links
  { id: 'einv-l-1', project_id: 'proj-4', source_item_id: 'einv-q-1', target_item_id: 'einv-todo-1', label: 'informs' },
  { id: 'einv-l-2', project_id: 'proj-4', source_item_id: 'einv-q-2', target_item_id: 'einv-todo-1', label: 'tests' },
  { id: 'einv-l-3', project_id: 'proj-4', source_item_id: 'einv-q-5', target_item_id: 'einv-todo-1', label: 'validates' },
  { id: 'einv-l-4', project_id: 'proj-4', source_item_id: 'einv-q-6', target_item_id: 'einv-todo-1', label: 'provides sample' },

  // F1 Race Prediction Links
  { id: 'f1-l-1', project_id: 'proj-6', source_item_id: 'f1-tech-1', target_item_id: 'f1-dd-1', label: 'documented by' },
  { id: 'f1-l-2', project_id: 'proj-6', source_item_id: 'f1-dd-1', target_item_id: 'f1-dd-2', label: 'leads to cleaning' },
  { id: 'f1-l-3', project_id: 'proj-6', source_item_id: 'f1-dd-2', target_item_id: 'f1-todo-1', label: 'prepares' },
  { id: 'f1-l-4', project_id: 'proj-6', source_item_id: 'f1-todo-1', target_item_id: 'f1-q-1', label: 'answers' },
  { id: 'f1-l-5', project_id: 'proj-6', source_item_id: 'f1-tech-2', target_item_id: 'f1-todo-2', label: 'powers' },
  { id: 'f1-l-6', project_id: 'proj-6', source_item_id: 'f1-todo-2', target_item_id: 'f1-q-2', label: 'answers' }
];
