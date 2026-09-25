#!/usr/bin/env node

import path from 'node:path';
import fs from 'node:fs';
import readline from 'node:readline';
import { SupabaseClient } from '../src/api.js';
import { loadConfig, saveConfig, getConfigPath } from '../src/config.js';
import { parseNotesFile } from '../src/importer.js';

const client = new SupabaseClient();

function getHelpText() {
  return `
╔════════════════════════════════════════════════════════════════════════════╗
║               NOTES CLI — Visual Learning-AI Project Notes                 ║
╚════════════════════════════════════════════════════════════════════════════╝

Usage:
  notes <command> [arguments...] [options]

Commands:
  projects                               List all registered projects
  list [slug] [--type <type>] [--format json]  List items and links in a project
  add-todo [slug] "<title>"              Add a to-do item (optional: --linked-to <id>)
  add-question [slug] "<question>"      Add a question for AI (optional: --linked-to <id>)
  add-note [slug] "<title>"              Add a general note (optional: --content "<markdown>")
  add-tech [slug] "<name>"               Add a technology pill (optional: --linked-to <id>)
  add-deep-dive [slug] "<title>" --file <file>  Add a technical deep-dive from markdown file
  link [slug] <source-id> <target-id>    Create a directed link between two items
  rename-project <slug> "<new-name>"     Rename an existing project
  delete-project <slug>                  Delete a project and its connections
  import [slug] <file> [--dry-run]       Parse & import legacy notes (shows preview table)
  init-config <url> <service-key>        Set up ~/.config/notes-app/config.json
  config                                 Display configuration path and status

Options:
  --linked-to <id>    Link the new item to an existing item ID
  --format json       Output results in raw JSON format (ideal for AI agents)
  --type <type>       Filter by type: todo, question, note, tech, deep_dive
  --dry-run           Preview imported items without writing to the database
  -h, --help          Show this help message

Auto-Slug:
  If [slug] is omitted, the CLI automatically detects the project from your
  current directory name (e.g. 'week-2/Dinas-studio' -> 'dinas-studio').
`;
}

function resolveSlug(rawArg) {
  if (rawArg && !rawArg.startsWith('--')) {
    return rawArg.toLowerCase().trim();
  }
  // Auto-detect from folder name
  const currentDir = path.basename(process.cwd()).toLowerCase();
  return currentDir;
}

function parseFlags(args) {
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        flags[key] = args[i + 1];
        i++;
      } else {
        flags[key] = true;
      }
    }
  }
  return flags;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h' || command === 'help') {
    console.log(getHelpText());
    process.exit(0);
  }

  try {
    switch (command) {
      case 'init-config': {
        const url = args[1];
        const key = args[2];
        if (!url || !key) {
          console.error('Error: Please provide Supabase URL and Service Key.');
          console.log('Usage: notes init-config <supabase-url> <supabase-service-key>');
          process.exit(1);
        }
        const savedPath = saveConfig(url, key);
        console.log(`✓ Configuration successfully written to: ${savedPath}`);
        break;
      }

      case 'config': {
        const cfg = loadConfig();
        console.log(`Config path: ${getConfigPath()}`);
        console.log(`Supabase URL: ${cfg.supabase_url ? cfg.supabase_url : '(not set)'}`);
        console.log(`Service Key:  ${cfg.supabase_key ? '✓ Configured (' + cfg.supabase_key.slice(0, 12) + '...)' : '✗ Not configured'}`);
        break;
      }

      case 'projects': {
        const projects = await client.listProjects();
        const flags = parseFlags(args.slice(1));
        if (flags.format === 'json') {
          console.log(JSON.stringify(projects, null, 2));
        } else {
          console.log('\nLearning-AI Projects:');
          console.log('─'.repeat(60));
          for (const p of projects) {
            console.log(`• ${p.name.padEnd(30)} [slug: ${p.slug}]`);
          }
          console.log('─'.repeat(60));
        }
        break;
      }

      case 'list': {
        const rawSlug = args[1] && !args[1].startsWith('--') ? args[1] : null;
        const slug = resolveSlug(rawSlug);
        const flags = parseFlags(args.slice(rawSlug ? 2 : 1));

        const project = await client.getProject(slug);
        const items = await client.getItems(project.id, flags.type);
        const links = await client.getItemLinks(project.id);

        if (flags.format === 'json') {
          console.log(JSON.stringify({ project, items, links }, null, 2));
        } else {
          console.log(`\nProject: ${project.name} (${project.slug})`);
          console.log(`Total Items: ${items.length} | Links: ${links.length}`);
          console.log('═'.repeat(64));

          const itemsById = new Map(items.map(it => [it.id, it]));

          for (const item of items) {
            const statusIcon = item.metadata?.status === 'done' ? '✓' : '•';
            const typeTag = `[${item.type.toUpperCase()}]`.padEnd(12);
            console.log(`${statusIcon} ${typeTag} ${item.title}`);
            console.log(`  id: ${item.id}`);

            // Find outgoing links
            const outgoing = links.filter(l => l.source_item_id === item.id);
            for (const out of outgoing) {
              const target = itemsById.get(out.target_item_id);
              const label = out.label ? ` (${out.label})` : '';
              console.log(`    ↳ links to${label}: ${target ? target.title : out.target_item_id}`);
            }
          }
          console.log('═'.repeat(64));
        }
        break;
      }

      case 'add-todo':
      case 'add-question':
      case 'add-note':
      case 'add-tech': {
        const typeMap = {
          'add-todo': 'todo',
          'add-question': 'question',
          'add-note': 'note',
          'add-tech': 'tech'
        };
        const itemType = typeMap[command];

        let slugArg = args[1] && !args[1].startsWith('--') ? args[1] : null;
        let titleArg = args[2] && !args[2].startsWith('--') ? args[2] : null;

        // If user omitted slug: e.g. notes add-todo "Title"
        if (!titleArg && slugArg && !slugArg.startsWith('--')) {
          titleArg = slugArg;
          slugArg = null;
        }

        const slug = resolveSlug(slugArg);
        const flags = parseFlags(args.slice(1));

        if (!titleArg) {
          console.error(`Error: Missing title/content for ${command}.`);
          console.log(`Usage: notes ${command} [slug] "<title>" [--linked-to <id>]`);
          process.exit(1);
        }

        const project = await client.getProject(slug);
        const newItem = await client.addItem({
          projectId: project.id,
          type: itemType,
          title: titleArg,
          content: flags.desc || flags.content || '',
          metadata: {
            status: 'open',
            position: { x: 100, y: 100 }
          }
        });

        console.log(`✓ Added ${itemType}: "${newItem.title}" (id: ${newItem.id})`);

        if (flags['linked-to']) {
          await client.addLink(project.id, newItem.id, flags['linked-to'], 'connects to');
          console.log(`✓ Linked to item: ${flags['linked-to']}`);
        }
        break;
      }

      case 'add-deep-dive': {
        const rawSlug = args[1] && !args[1].startsWith('--') ? args[1] : null;
        const slug = resolveSlug(rawSlug);
        const flags = parseFlags(args.slice(rawSlug ? 2 : 1));
        const title = args[rawSlug ? 2 : 1];

        if (!title || !flags.file) {
          console.error('Error: Please specify title and markdown file.');
          console.log('Usage: notes add-deep-dive [slug] "<title>" --file <path.md>');
          process.exit(1);
        }

        if (!fs.existsSync(flags.file)) {
          console.error(`Error: File not found: ${flags.file}`);
          process.exit(1);
        }

        const fileContent = fs.readFileSync(flags.file, 'utf-8');
        const project = await client.getProject(slug);

        const newItem = await client.addItem({
          projectId: project.id,
          type: 'deep_dive',
          title,
          content: fileContent,
          metadata: {
            status: 'open',
            file_source: path.basename(flags.file),
            position: { x: 200, y: 200 }
          }
        });

        console.log(`✓ Added deep-dive: "${newItem.title}" from ${flags.file} (id: ${newItem.id})`);
        break;
      }

      case 'link': {
        const rawSlug = args[1] && !args[1].startsWith('--') ? args[1] : null;
        const slug = resolveSlug(rawSlug);
        const remaining = args.slice(rawSlug ? 2 : 1);
        const sourceId = remaining[0];
        const targetId = remaining[1];
        const flags = parseFlags(remaining.slice(2));

        if (!sourceId || !targetId) {
          console.error('Error: Please provide source and target item IDs.');
          console.log('Usage: notes link [slug] <source-id> <target-id> [--label "<label>"]');
          process.exit(1);
        }

        const project = await client.getProject(slug);
        const link = await client.addLink(project.id, sourceId, targetId, flags.label || '');
        console.log(`✓ Created link: ${sourceId} ➔ ${targetId}${flags.label ? ' (' + flags.label + ')' : ''}`);
        break;
      }

      case 'import': {
        const rawSlug = args[1] && !args[1].startsWith('--') ? args[1] : null;
        const slug = resolveSlug(rawSlug);
        const remaining = args.slice(rawSlug ? 2 : 1);
        const filePath = remaining[0];
        const flags = parseFlags(remaining.slice(1));

        if (!filePath) {
          console.error('Error: Please provide a file to import.');
          console.log('Usage: notes import [slug] <path-to-notes.txt> [--dry-run]');
          process.exit(1);
        }

        const parsedItems = parseNotesFile(filePath);
        console.log(`\nParsed ${parsedItems.length} items from: ${filePath}`);
        console.log('─'.repeat(70));
        console.log(`Type`.padEnd(14) + `Section`.padEnd(18) + `Title`);
        console.log('─'.repeat(70));

        for (const item of parsedItems.slice(0, 10)) {
          console.log(`${item.type.toUpperCase()}`.padEnd(14) + `${item.section}`.padEnd(18) + `${item.title.slice(0, 36)}`);
        }
        if (parsedItems.length > 10) {
          console.log(`... and ${parsedItems.length - 10} more items`);
        }
        console.log('─'.repeat(70));

        if (flags['dry-run']) {
          console.log('Dry run complete. No items were inserted.');
          process.exit(0);
        }

        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        rl.question(`\nImport ${parsedItems.length} items into project '${slug}'? [y/N] `, async (answer) => {
          rl.close();
          if (answer.toLowerCase() !== 'y') {
            console.log('Import cancelled.');
            process.exit(0);
          }

          const project = await client.getProject(slug);
          let insertedCount = 0;
          for (const item of parsedItems) {
            await client.addItem({
              projectId: project.id,
              type: item.type,
              title: item.title,
              content: item.content,
              metadata: item.metadata
            });
            insertedCount++;
          }
        });
        break;
      }

      case 'rename-project': {
        const slug = args[0];
        const newName = args[1];
        if (!slug || !newName) {
          console.error('Usage: notes rename-project <slug> "<new-name>"');
          process.exit(1);
        }
        const project = await client.getProject(slug);
        const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const { error } = await client.supabase.from('projects').update({ name: newName, slug: newSlug }).eq('id', project.id);
        if (error) throw error;
        console.log(`✓ Renamed project '${project.name}' (${slug}) -> '${newName}' (${newSlug})`);
        break;
      }

      case 'delete-project': {
        const slug = args[0];
        if (!slug) {
          console.error('Usage: notes delete-project <slug>');
          process.exit(1);
        }
        const project = await client.getProject(slug);
        const { error } = await client.supabase.from('projects').delete().eq('id', project.id);
        if (error) throw error;
        console.log(`✓ Deleted project '${project.name}' (${slug}) and all associated items.`);
        break;
      }

      default:
        console.error(`Unknown command: "${command}". Run 'notes --help' for available commands.`);
        process.exit(1);
    }
  } catch (err) {
    console.error(`\nError: ${err.message}`);
    process.exit(1);
  }
}

main();
