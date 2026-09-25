import { loadConfig, getConfigPath } from './config.js';

export class SupabaseClient {
  constructor() {
    const config = loadConfig();
    this.url = config.supabase_url ? config.supabase_url.replace(/\/+$/, '') : '';
    this.key = config.supabase_key;
  }

  ensureConfigured() {
    if (!this.url || !this.key) {
      throw new Error(
        `Notes CLI is not configured!\nRun: notes init-config\nOr edit: ${getConfigPath()}\nOr set NOTES_SUPABASE_URL and NOTES_SUPABASE_KEY env vars.`
      );
    }
  }

  async request(endpoint, options = {}) {
    this.ensureConfigured();

    const headers = {
      'apikey': this.key,
      'Authorization': `Bearer ${this.key}`,
      'Content-Type': 'application/json',
      'Prefer': options.prefer || 'return=representation',
      ...(options.headers || {})
    };

    const url = `${this.url}/rest/v1/${endpoint.replace(/^\/+/, '')}`;
    const res = await fetch(url, {
      ...options,
      headers
    });

    if (!res.ok) {
      let errText = await res.text();
      try {
        const json = JSON.parse(errText);
        errText = json.message || json.error || errText;
      } catch (_) {}
      throw new Error(`Supabase API error (${res.status}): ${errText}`);
    }

    if (res.status === 204) return null;
    return await res.json();
  }

  async getProject(slug) {
    const cleanSlug = slug.toLowerCase().trim();
    const projects = await this.request(`projects?slug=eq.${encodeURIComponent(cleanSlug)}&select=*`);
    if (!projects || projects.length === 0) {
      throw new Error(`Project not found with slug: "${cleanSlug}". Run 'notes projects' to see available projects.`);
    }
    return projects[0];
  }

  async listProjects() {
    return await this.request('projects?select=*&order=created_at.asc');
  }

  async getSections(projectId) {
    return await this.request(`sections?project_id=eq.${projectId}&select=*&order=sort_order.asc`);
  }

  async getItems(projectId, typeFilter = null) {
    let endpoint = `items?project_id=eq.${projectId}&select=*&order=created_at.asc`;
    if (typeFilter) {
      endpoint += `&type=eq.${encodeURIComponent(typeFilter)}`;
    }
    return await this.request(endpoint);
  }

  async getItemLinks(projectId) {
    return await this.request(`item_links?project_id=eq.${projectId}&select=*`);
  }

  async addItem({ projectId, sectionId, type, title, content = '', metadata = {} }) {
    const payload = [{
      project_id: projectId,
      section_id: sectionId || null,
      type,
      title,
      content,
      metadata
    }];
    const inserted = await this.request('items', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return inserted[0];
  }

  async addLink(projectId, sourceItemId, targetItemId, label = '') {
    const payload = [{
      project_id: projectId,
      source_item_id: sourceItemId,
      target_item_id: targetItemId,
      label
    }];
    const inserted = await this.request('item_links', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return inserted[0];
  }
}
