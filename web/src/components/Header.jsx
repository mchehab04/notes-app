import React from 'react';
import { 
  Menu, 
  Plus, 
  Sun, 
  Moon, 
  LayoutDashboard, 
  GitFork, 
  Layers, 
  Database,
  Smartphone,
  RotateCcw,
  RotateCw,
  Edit2
} from 'lucide-react';
import { useNotes } from '../context/NotesContext.jsx';

export default function Header() {
  const { 
    activeProject, 
    items, 
    links, 
    viewMode, 
    setViewMode, 
    theme, 
    setTheme, 
    setIsSidebarOpen, 
    setIsAddItemModalOpen,
    setEditingProject,
    undo,
    redo,
    canUndo,
    canRedo,
    isLiveSupabase
  } = useNotes();

  const openTodosCount = items.filter(it => it.type === 'todo' && it.metadata?.status !== 'done').length;

  return (
    <header style={{
      height: '56px',
      borderBottom: '1px solid var(--line)',
      background: 'var(--surface)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      position: 'relative',
      zIndex: 20,
      userSelect: 'none'
    }}>
      {/* Left side: Menu & Project Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          id="btn-toggle-sidebar"
          onClick={() => setIsSidebarOpen(prev => !prev)}
          style={{
            background: 'transparent',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-main)',
            padding: '6px 8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s ease'
          }}
          title="Toggle Project Drawer"
        >
          <Menu size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.01em' }}>
            {activeProject.name}
          </span>
          <span style={{
            fontSize: '11.5px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-faint)',
            background: 'var(--accent-slate-soft)',
            padding: '2px 7px',
            borderRadius: 'var(--radius-sm)'
          }}>
            {activeProject.slug}
          </span>
          <button
            onClick={() => setEditingProject(activeProject)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-faint)',
              cursor: 'pointer',
              padding: '2px 4px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease'
            }}
            title="Rename or delete this project"
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-indigo)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}
          >
            <Edit2 size={13} />
          </button>
        </div>

        {/* Stats Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-indigo-soft)',
            color: 'var(--accent-indigo)',
            fontWeight: 600
          }}>
            {items.length} nodes
          </span>
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-emerald-soft)',
            color: 'var(--accent-emerald)',
            fontWeight: 600
          }}>
            {openTodosCount} open to-dos
          </span>
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-cyan-soft)',
            color: 'var(--accent-cyan)',
            fontWeight: 600
          }}>
            {links.length} links
          </span>
        </div>
      </div>

      {/* Right side: View Switcher, Add Item, Theme */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Connection status indicator */}
        <div 
          title={isLiveSupabase ? 'Connected to live Supabase Postgres' : 'Running in local reactive sandbox (auto-saved in browser)'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            color: isLiveSupabase ? 'var(--accent-emerald)' : 'var(--accent-amber)',
            fontFamily: 'var(--font-mono)',
            padding: '3px 8px',
            background: isLiveSupabase ? 'var(--accent-emerald-soft)' : 'var(--accent-amber-soft)',
            borderRadius: 'var(--radius-full)'
          }}
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: isLiveSupabase ? 'var(--accent-emerald)' : 'var(--accent-amber)'
          }} />
          {isLiveSupabase ? 'Supabase' : 'Local Sandbox'}
        </div>

        {/* View Toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--surface-solid)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-md)',
          padding: '2px'
        }}>
          <button
            id="btn-view-canvas"
            onClick={() => setViewMode('canvas')}
            style={{
              background: viewMode === 'canvas' ? 'var(--accent-indigo)' : 'transparent',
              color: viewMode === 'canvas' ? '#FFFFFF' : 'var(--text-muted)',
              border: 'none',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease'
            }}
          >
            <GitFork size={13} />
            Canvas
          </button>
          <button
            id="btn-view-stream"
            onClick={() => setViewMode('stream')}
            style={{
              background: viewMode === 'stream' ? 'var(--accent-indigo)' : 'transparent',
              color: viewMode === 'stream' ? '#FFFFFF' : 'var(--text-muted)',
              border: 'none',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease'
            }}
          >
            <Smartphone size={13} />
            Stream
          </button>
        </div>

        {/* Undo / Redo Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          background: 'var(--surface-solid)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-md)',
          padding: '2px'
        }}>
          <button
            id="btn-header-undo"
            onClick={undo}
            disabled={!canUndo}
            style={{
              background: 'transparent',
              border: 'none',
              color: canUndo ? 'var(--text-main)' : 'var(--text-faint)',
              opacity: canUndo ? 1 : 0.45,
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 500,
              cursor: canUndo ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease'
            }}
            title="Undo last action (Ctrl+Z)"
          >
            <RotateCcw size={13} />
            <span style={{ fontSize: '11.5px' }}>Undo</span>
          </button>
          <button
            id="btn-header-redo"
            onClick={redo}
            disabled={!canRedo}
            style={{
              background: 'transparent',
              border: 'none',
              color: canRedo ? 'var(--text-main)' : 'var(--text-faint)',
              opacity: canRedo ? 1 : 0.45,
              padding: '4px 6px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 500,
              cursor: canRedo ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            title="Redo action (Ctrl+Shift+Z or Ctrl+Y)"
          >
            <RotateCw size={13} />
          </button>
        </div>

        {/* Add Item Button */}
        <button
          id="btn-add-item-header"
          onClick={() => setIsAddItemModalOpen(true)}
          style={{
            background: 'var(--accent-indigo)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '6px 12px',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'opacity 0.15s ease'
          }}
        >
          <Plus size={15} />
          Add Item
        </button>

        {/* Theme Toggle */}
        <button
          id="btn-theme-toggle"
          onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          style={{
            background: 'transparent',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-main)',
            padding: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
}
