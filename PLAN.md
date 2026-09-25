# Implementation Plan: Project Notes App (`notes-app`)

**Date:** 2026-09-25  
**Spec Reference:** [`SPEC.md`](file:///c:/Users/mcheh/OneDrive/Desktop/Learning-AI/week-6/notes-app/SPEC.md)  
**Status:** Under Review  
**Project Path:** `c:/Users/mcheh/OneDrive/Desktop/Learning-AI/week-6/notes-app`  

---

## Architecture Summary

A unified visual notes workspace for all Learning-AI projects, accessible on laptop (interactive React Flow canvas) and phone (connected vertical stream), backed by Supabase Postgres and hosted on Cloudflare Pages. AI agents (Claude, Gemini) query and append items via a zero-friction CLI authenticated through a local machine configuration (`~/.config/notes-app/config.json`).

---

## Tasks & Milestones

### Task 1: Database Schema & Seed Data (`supabase/`)
* **Goal**: Define the complete database schema with Row Level Security and seed the curated Learning-AI projects.
* **Files**:
  - `notes-app/supabase/schema.sql` (Tables: `projects`, `sections`, `items`, `item_links`, indexes, RLS policies)
  - `notes-app/supabase/seed.sql` (Seeds the 8 curated projects:
    1. `week-1/Personal-Portfolio` (`personal-portfolio`)
    2. `week-2/Dinas-studio` (`dinas-studio`)
    3. `week-3/Automation-Pipeline-Project` (`automation-pipeline-project`)
    4. `week-4/e-Invoicing-Project` (`e-invoicing-project`)
    5. `week-5/Data-Science-Project` (`data-science-project`)
    6. `week-5/F1-race-prediction` (`f1-race-prediction`)
    7. `week-6/personal-dashboard` (`personal-dashboard`)
    8. `week-6/notes-app` (`notes-app`)
  )
* **Verification**: Verify SQL syntax, foreign key constraints (`ON DELETE CASCADE`), and RLS rules against the spec.

---

### Task 2: Multi-Agent CLI Tool (`notes-app/cli/`)
* **Goal**: Build the Node.js CLI tool that AI agents and the user run from any project directory.
* **Files**:
  - `notes-app/cli/package.json`
  - `notes-app/cli/bin/notes.js` (CLI entry point)
  - `notes-app/cli/src/config.js` (Reads `~/.config/notes-app/config.json`)
  - `notes-app/cli/src/db.js` (Supabase client using service key)
  - `notes-app/cli/src/commands/`
    - `list.js`: Output project graph as human-readable table or `--format json`
    - `add.js`: Add to-dos, questions, notes, and deep-dives with optional `--linked-to`
    - `link.js`: Create directed edges between existing items
    - `import.js`: Parser for markdown files, with interactive dry-run table before writing
* **Verification**: Run `node cli/bin/notes.js --help`, test command parsing, mock database connection, and verify dry-run output formatting.

---

### Task 3: Web App Foundation & Design System (`notes-app/web/`)
* **Goal**: Scaffold the React + Vite application, install essential libraries, and establish a design system with dark/light themes.
* **Files**:
  - `notes-app/web/package.json` (React, Vite, `@xyflow/react`, `@supabase/supabase-js`, `lucide-react`)
  - `notes-app/web/src/index.css` (Curated design tokens: typography, node type accents, glassmorphic surfaces, responsive utilities)
  - `notes-app/web/src/lib/supabase.ts` (Browser Supabase client)
  - `notes-app/web/src/context/AuthContext.tsx` (Session state, login, logout)
* **Verification**: Build passes with `npm run build`; verify clean token definitions and zero styling regressions.

---

### Task 4: Navigation, Project Drawer & Authentication
* **Goal**: Provide user sign-in and project switcher supporting all 11 Learning-AI projects.
* **Files**:
  - `notes-app/web/src/components/AuthModal.tsx` (Magic link / password login)
  - `notes-app/web/src/components/ProjectSidebar.tsx` (Drawer listing projects with to-do counts, search filter, and "Add Project" button)
  - `notes-app/web/src/components/Header.tsx` (Current project title, view switcher [Canvas / Stream], user menu)
* **Verification**: Switch projects seamlessly, update active project URL slug, open/close drawer on mobile and desktop.

---

### Task 5: Laptop Interactive Canvas (`@xyflow/react`)
* **Goal**: Implement the infinite canvas view with custom nodes, handles, arrows, and persistent positions.
* **Files**:
  - `notes-app/web/src/components/canvas/NotesCanvas.tsx` (Canvas container, zoom/pan controls, background grid, minimap)
  - `notes-app/web/src/components/canvas/nodes/`
    - `TodoNode.tsx`: Checkbox toggle, status update, connector handles
    - `TechNode.tsx`: Technology pill with version/tags
    - `QuestionNode.tsx`: Amber question card with prompt icon
    - `DeepDiveNode.tsx`: Indigo card with "Read Deep-Dive" trigger button
    - `NoteNode.tsx`: Slate general note card
  - `notes-app/web/src/components/canvas/QuickAddDock.tsx` (Floating bottom dock to drop nodes at viewport center)
  - `notes-app/web/src/hooks/useCanvasSync.ts` (500ms debounced auto-save of node positions `{x, y}` to Supabase)
* **Verification**: Create items, drag nodes, draw bezier connector edges between items, reload page and confirm node positions persist.

---

### Task 6: Deep-Dive Reader & Markdown Editor Drawer
* **Goal**: Provide a distraction-free drawer to view and edit detailed technical explanations.
* **Files**:
  - `notes-app/web/src/components/DeepDiveDrawer.tsx` (Slide-out panel with smooth transition)
  - `notes-app/web/src/components/MarkdownRenderer.tsx` (Syntax highlighted code blocks, copy snippet buttons, clean prose formatting)
* **Verification**: Open deep-dive node, verify markdown formatting and code highlighting, test edit mode and save.

---

### Task 7: Phone Adaptive Connected Stream
* **Goal**: Provide a vertical stream experience for mobile devices with interactive link navigation.
* **Files**:
  - `notes-app/web/src/components/mobile/MobileStreamView.tsx` (Vertical feed grouped by section or sorted by flow)
  - `notes-app/web/src/components/mobile/StreamCard.tsx` (Compact card with type badge, content, and touch-optimized link chips)
  - `notes-app/web/src/components/mobile/QuickAddSheet.tsx` (Bottom sheet modal for rapid capture on phone)
* **Verification**: Test on viewport width $\le$ 640px; verify tap on connected chip ($\ge$ 44px touch target) smoothly scrolls and flashes target card.

---

### Task 8: Supabase Keep-Alive & Cloudflare Pages Config
* **Goal**: Ensure continuous deployment and protect the database against free-tier pausing.
* **Files**:
  - `notes-app/.github/workflows/keep-alive.yml` (Daily cron ping at 00:00 UTC)
  - `notes-app/web/public/_redirects` (`/* /index.html 200` for SPA client-side routing)
* **Verification**: Verify workflow YAML syntax and SPA redirect rule.

---

### Task 9: AI Workspace Contracts (`CLAUDE.md` / `GEMINI.md`)
* **Goal**: Configure project instructions so AI assistants automatically know how to query and append notes.
* **Files**:
  - Updates to `week-6/GEMINI.md` and `week-6/CLAUDE.md`
  - Template snippet for other project folders
* **Verification**: Verify documentation clarity and test CLI invocation from project directory.
