import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const CONFIG_DIR = path.join(os.homedir(), '.config', 'notes-app');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

/**
 * Load CLI configuration from ~/.config/notes-app/config.json
 * or fallback to environment variables.
 */
export function loadConfig() {
  let config = {
    supabase_url: process.env.NOTES_SUPABASE_URL || '',
    supabase_key: process.env.NOTES_SUPABASE_KEY || ''
  };

  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      config.supabase_url = data.supabase_url || config.supabase_url;
      config.supabase_key = data.supabase_key || data.supabase_service_key || config.supabase_key;
    } catch (err) {
      console.error(`Warning: Failed to parse ${CONFIG_FILE}:`, err.message);
    }
  }

  return config;
}

/**
 * Save configuration to ~/.config/notes-app/config.json
 */
export function saveConfig(supabaseUrl, supabaseKey) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }

  const payload = {
    supabase_url: supabaseUrl,
    supabase_key: supabaseKey,
    updated_at: new Date().toISOString()
  };

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  return CONFIG_FILE;
}

export function getConfigPath() {
  return CONFIG_FILE;
}
