import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { supabase, isLiveSupabase, INITIAL_PROJECTS, INITIAL_ITEMS, INITIAL_LINKS } from '../lib/supabase.js';

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('notes_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [activeProjectSlug, setActiveProjectSlug] = useState(() => {
    return localStorage.getItem('notes_active_slug') || 'notes-app';
  });

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('notes_items');
    if (!saved) return INITIAL_ITEMS;
    try {
      const parsed = JSON.parse(saved);
      const existingIds = new Set(parsed.map(i => i.id));
      const missing = INITIAL_ITEMS.filter(i => !existingIds.has(i.id));
      return [...parsed, ...missing];
    } catch (_) {
      return INITIAL_ITEMS;
    }
  });

  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem('notes_links');
    if (!saved) return INITIAL_LINKS;
    try {
      const parsed = JSON.parse(saved);
      const existingIds = new Set(parsed.map(l => l.id));
      const missing = INITIAL_LINKS.filter(l => !existingIds.has(l.id));
      return [...parsed, ...missing];
    } catch (_) {
      return INITIAL_LINKS;
    }
  });

  const [activeDeepDive, setActiveDeepDive] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editingLink, setEditingLink] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('notes_theme') || 'dark';
  });

  // Keep a ref of latest items and links for history snapshots
  const stateRef = useRef({ items, links });
  useEffect(() => {
    stateRef.current = { items, links };
  }, [items, links]);

  // Push current snapshot onto history stack
  const pushToHistory = useCallback(() => {
    setHistory(prev => [
      ...prev.slice(-49),
      {
        items: JSON.parse(JSON.stringify(stateRef.current.items)),
        links: JSON.parse(JSON.stringify(stateRef.current.links))
      }
    ]);
    setFuture([]); // clear redo stack on new user action
  }, []);

  // Undo
  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const previousState = newHistory.pop();

      // Push current state to future for Redo
      setFuture(f => [
        ...f.slice(-49),
        {
          items: JSON.parse(JSON.stringify(stateRef.current.items)),
          links: JSON.parse(JSON.stringify(stateRef.current.links))
        }
      ]);

      setItems(previousState.items);
      setLinks(previousState.links);
      return newHistory;
    });
  }, []);

  // Redo
  const redo = useCallback(() => {
    setFuture(prev => {
      if (prev.length === 0) return prev;
      const newFuture = [...prev];
      const nextState = newFuture.pop();

      setHistory(h => [
        ...h.slice(-49),
        {
          items: JSON.parse(JSON.stringify(stateRef.current.items)),
          links: JSON.parse(JSON.stringify(stateRef.current.links))
        }
      ]);

      setItems(nextState.items);
      setLinks(nextState.links);
      return newFuture;
    });
  }, []);

  const canUndo = history.length > 0;
  const canRedo = future.length > 0;

  // Responsive View Mode: Defaults to stream if mobile
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'stream';
    }
    return 'canvas';
  });

  // Adjustable Edge Shape: 'bezier' | 'smoothstep' | 'straight'
  const [edgeShape, setEdgeShape] = useState(() => {
    return localStorage.getItem('notes_edge_shape') || 'bezier';
  });

  useEffect(() => {
    localStorage.setItem('notes_edge_shape', edgeShape);
  }, [edgeShape]);

  // Position Debounce Map
  const positionDebounceTimers = useRef(new Map());

  // Set theme attribute on root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('notes_theme', theme);
  }, [theme]);

  // Handle window resize for mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && viewMode === 'canvas') {
        setViewMode('stream');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // Persist to localStorage for fallback
  useEffect(() => {
    localStorage.setItem('notes_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('notes_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('notes_links', JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    localStorage.setItem('notes_active_slug', activeProjectSlug);
  }, [activeProjectSlug]);

  // Live Supabase Sync (if configured)
  useEffect(() => {
    if (!isLiveSupabase || !supabase) return;

    async function fetchFromSupabase() {
      try {
        const { data: projs } = await supabase.from('projects').select('*').order('created_at', { ascending: true });
        if (projs && projs.length > 0) setProjects(projs);

        const currentProj = projs?.find(p => p.slug === activeProjectSlug);
        if (currentProj) {
          const { data: itms } = await supabase.from('items').select('*').eq('project_id', currentProj.id);
          if (itms) setItems(itms);

          const { data: lnks } = await supabase.from('item_links').select('*').eq('project_id', currentProj.id);
          if (lnks) setLinks(lnks);
        }
      } catch (err) {
        console.warn('Supabase fetch failed, using local store:', err);
      }
    }

    fetchFromSupabase();
  }, [activeProjectSlug]);

  const activeProject = projects.find(p => p.slug === activeProjectSlug) || projects[0] || {
    id: 'default',
    name: 'Default Project',
    slug: 'default',
    description: ''
  };

  const projectItems = items.filter(it => it.project_id === activeProject.id);
  const projectLinks = links.filter(l => l.project_id === activeProject.id);

  // Add Item
  const addItem = useCallback(async ({ type, title, content = '', metadata = {}, linkedToId = null, linkLabel = '' }) => {
    pushToHistory();

    const newItem = {
      id: 'item-' + Date.now(),
      project_id: activeProject.id,
      type,
      title,
      content,
      metadata: {
        status: 'open',
        position: metadata.position || {
          x: 100 + (projectItems.length % 4) * 260,
          y: 100 + Math.floor(projectItems.length / 4) * 160
        },
        tags: metadata.tags || [],
        ...metadata
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setItems(prev => [...prev, newItem]);

    if (linkedToId) {
      const newLink = {
        id: 'link-' + Date.now(),
        project_id: activeProject.id,
        source_item_id: newItem.id,
        target_item_id: linkedToId,
        source_handle: 'bottom',
        target_handle: 'top',
        label: linkLabel || 'connects to'
      };
      setLinks(prev => [...prev, newLink]);
    }

    if (isLiveSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('items').insert([{
          project_id: activeProject.id,
          type: newItem.type,
          title: newItem.title,
          content: newItem.content,
          metadata: newItem.metadata
        }]).select();

        if (!error && data?.[0] && linkedToId) {
          await supabase.from('item_links').insert([{
            project_id: activeProject.id,
            source_item_id: data[0].id,
            target_item_id: linkedToId,
            label: linkLabel || 'connects to'
          }]);
        }
      } catch (err) {
        console.error('Supabase addItem error:', err);
      }
    }

    return newItem;
  }, [activeProject, projectItems.length, pushToHistory]);

  // Update Item
  const updateItem = useCallback(async (id, updates) => {
    pushToHistory();

    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...updates,
          metadata: { ...item.metadata, ...(updates.metadata || {}) },
          updated_at: new Date().toISOString()
        };
      }
      return item;
    }));

    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('items').update(updates).eq('id', id);
      } catch (err) {
        console.error('Supabase updateItem error:', err);
      }
    }
  }, [pushToHistory]);

  // Delete Item
  const deleteItem = useCallback(async (id) => {
    pushToHistory();

    setItems(prev => prev.filter(it => it.id !== id));
    setLinks(prev => prev.filter(l => l.source_item_id !== id && l.target_item_id !== id));

    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('items').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deleteItem error:', err);
      }
    }
  }, [pushToHistory]);

  // Toggle Todo Status
  const toggleTodo = useCallback((id) => {
    pushToHistory();

    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const currentStatus = item.metadata?.status || 'open';
        const newStatus = currentStatus === 'done' ? 'open' : 'done';

        if (newStatus === 'done') {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#10B981', '#6366F1', '#F59E0B']
          });
        }

        const updatedMetadata = { ...item.metadata, status: newStatus };
        updateItem(id, { metadata: updatedMetadata });
        return { ...item, metadata: updatedMetadata };
      }
      return item;
    }));
  }, [updateItem, pushToHistory]);

  // Create Link (Directed Graph Edge)
  const addLink = useCallback(async (sourceId, targetId, label = '', sourceHandle = 'bottom', targetHandle = 'top') => {
    if (sourceId === targetId) return;

    pushToHistory();

    const newLink = {
      id: 'link-' + Date.now(),
      project_id: activeProject.id,
      source_item_id: sourceId,
      target_item_id: targetId,
      source_handle: sourceHandle || 'bottom',
      target_handle: targetHandle || 'top',
      label: label || 'connects to'
    };

    setLinks(prev => [...prev, newLink]);

    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('item_links').insert([{
          id: newLink.id,
          project_id: newLink.project_id,
          source_item_id: newLink.source_item_id,
          target_item_id: newLink.target_item_id,
          label: newLink.label
        }]);
      } catch (err) {
        console.error('Supabase addLink error:', err);
      }
    }
    return newLink;
  }, [activeProject.id, pushToHistory]);

  // Remove Link
  const deleteLink = useCallback(async (linkId) => {
    pushToHistory();

    setLinks(prev => prev.filter(l => l.id !== linkId));

    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('item_links').delete().eq('id', linkId);
      } catch (err) {
        console.error('Supabase deleteLink error:', err);
      }
    }
  }, [pushToHistory]);

  // Update Link (label, source, target, handles)
  const updateLink = useCallback(async (linkId, updates) => {
    pushToHistory();

    setLinks(prev => prev.map(l => {
      if (l.id === linkId) {
        return { ...l, ...updates };
      }
      return l;
    }));

    if (isLiveSupabase && supabase) {
      try {
        const supabaseUpdates = {};
        if (updates.source_item_id) supabaseUpdates.source_item_id = updates.source_item_id;
        if (updates.target_item_id) supabaseUpdates.target_item_id = updates.target_item_id;
        if (updates.label !== undefined) supabaseUpdates.label = updates.label;

        if (Object.keys(supabaseUpdates).length > 0) {
          await supabase.from('item_links').update(supabaseUpdates).eq('id', linkId);
        }
      } catch (err) {
        console.error('Supabase updateLink error:', err);
      }
    }
  }, [pushToHistory]);

  // Debounced Position Sync (500ms)
  const updateItemPosition = useCallback((id, position) => {
    // Immediate local state update for fluid 60fps dragging
    setItems(prev => prev.map(it => {
      if (it.id === id) {
        return {
          ...it,
          metadata: { ...it.metadata, position }
        };
      }
      return it;
    }));

    // Debounce database write by 500ms
    if (positionDebounceTimers.current.has(id)) {
      clearTimeout(positionDebounceTimers.current.get(id));
    }

    const timer = setTimeout(async () => {
      positionDebounceTimers.current.delete(id);
      if (isLiveSupabase && supabase) {
        try {
          const item = items.find(it => it.id === id);
          if (item) {
            await supabase.from('items').update({
              metadata: { ...item.metadata, position }
            }).eq('id', id);
          }
        } catch (err) {
          console.error('Debounced position sync error:', err);
        }
      }
    }, 500);

    positionDebounceTimers.current.set(id, timer);
  }, [items]);

  // Add Project
  const addProject = useCallback(async ({ name, description = '' }) => {
    pushToHistory();

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProj = {
      id: 'proj-' + Date.now(),
      name,
      slug,
      description,
      created_at: new Date().toISOString()
    };

    setProjects(prev => [...prev, newProj]);
    setActiveProjectSlug(slug);

    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('projects').insert([newProj]);
      } catch (err) {
        console.error('Supabase addProject error:', err);
      }
    }

    return newProj;
  }, [pushToHistory]);

  // Rename Project
  const renameProject = useCallback(async (id, { name, description }) => {
    pushToHistory();

    const trimmedName = name.trim();
    if (!trimmedName) return;

    const newSlug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          name: trimmedName,
          slug: newSlug || p.slug,
          description: description !== undefined ? description.trim() : p.description
        };
      }
      return p;
    }));

    if (activeProject.id === id) {
      setActiveProjectSlug(newSlug || activeProject.slug);
    }

    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('projects').update({
          name: trimmedName,
          slug: newSlug,
          description: description !== undefined ? description.trim() : undefined
        }).eq('id', id);
      } catch (err) {
        console.error('Supabase renameProject error:', err);
      }
    }
  }, [activeProject, pushToHistory]);

  // Delete Project
  const deleteProject = useCallback(async (id) => {
    if (projects.length <= 1) {
      alert('Cannot delete the last remaining project.');
      return false;
    }

    pushToHistory();

    const remaining = projects.filter(p => p.id !== id);
    setProjects(remaining);

    if (activeProject.id === id && remaining.length > 0) {
      setActiveProjectSlug(remaining[0].slug);
    }

    // Clean up local items and links belonging to the deleted project
    setItems(prev => prev.filter(it => it.project_id !== id));
    setLinks(prev => prev.filter(l => l.project_id !== id));

    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('projects').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deleteProject error:', err);
      }
    }

    return true;
  }, [projects, activeProject, pushToHistory]);

  const value = {
    projects,
    activeProject,
    activeProjectSlug,
    setActiveProjectSlug,
    items: projectItems,
    allItems: items,
    links: projectLinks,
    allLinks: links,
    activeDeepDive,
    setActiveDeepDive,
    editingItem,
    setEditingItem,
    editingLink,
    setEditingLink,
    editingProject,
    setEditingProject,
    undo,
    redo,
    canUndo,
    canRedo,
    takeSnapshot: pushToHistory,
    isSidebarOpen,
    setIsSidebarOpen,
    isAddItemModalOpen,
    setIsAddItemModalOpen,
    theme,
    setTheme,
    viewMode,
    setViewMode,
    addItem,
    updateItem,
    deleteItem,
    toggleTodo,
    addLink,
    updateLink,
    deleteLink,
    edgeShape,
    setEdgeShape,
    updateItemPosition,
    addProject,
    renameProject,
    deleteProject,
    isLiveSupabase
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
