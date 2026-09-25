import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Check, 
  GitFork, 
  ArrowRight, 
  ArrowDownUp, 
  CheckSquare, 
  Cpu, 
  BookOpen, 
  HelpCircle, 
  FileText 
} from 'lucide-react';
import { useNotes } from '../context/NotesContext.jsx';

export default function EditLinkModal() {
  const { 
    editingLink, 
    setEditingLink, 
    items, 
    updateLink, 
    deleteLink 
  } = useNotes();

  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [sourceHandle, setSourceHandle] = useState('bottom');
  const [targetHandle, setTargetHandle] = useState('top');
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (editingLink) {
      setSourceId(editingLink.source_item_id || editingLink.source || '');
      setTargetId(editingLink.target_item_id || editingLink.target || '');
      setSourceHandle(editingLink.source_handle || editingLink.sourceHandle || 'bottom');
      setTargetHandle(editingLink.target_handle || editingLink.targetHandle || 'top');
      setLabel(editingLink.label || '');
    }
  }, [editingLink]);

  if (!editingLink) return null;

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId) return;

    updateLink(editingLink.id, {
      source_item_id: sourceId,
      target_item_id: targetId,
      source_handle: sourceHandle,
      target_handle: targetHandle,
      label: label.trim() || 'connects to'
    });

    setEditingLink(null);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this connection between nodes?')) {
      deleteLink(editingLink.id);
      setEditingLink(null);
    }
  };

  const handleSwap = () => {
    setSourceId(targetId);
    setTargetId(sourceId);
    setSourceHandle(targetHandle);
    setTargetHandle(sourceHandle);
  };

  const presets = ['connects to', 'leads to', 'requires', 'raises', 'explains', 'blocks'];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'todo': return <CheckSquare size={13} style={{ color: 'var(--accent-emerald)' }} />;
      case 'tech': return <Cpu size={13} style={{ color: 'var(--accent-cyan)' }} />;
      case 'deep_dive': return <BookOpen size={13} style={{ color: 'var(--accent-indigo)' }} />;
      case 'question': return <HelpCircle size={13} style={{ color: 'var(--accent-amber)' }} />;
      default: return <FileText size={13} style={{ color: 'var(--accent-slate)' }} />;
    }
  };

  const sides = [
    { id: 'top', label: 'Top' },
    { id: 'right', label: 'Right' },
    { id: 'bottom', label: 'Bottom' },
    { id: 'left', label: 'Left' }
  ];

  return (
    <div 
      className="modal-backdrop" 
      onClick={() => setEditingLink(null)}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px'
      }}
    >
      <div 
        className="modal-container" 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'var(--surface-solid)',
          border: '1px solid var(--line-strong)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--line)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-indigo-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-indigo)'
            }}>
              <GitFork size={17} />
            </div>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>
                Edit Connection
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                Change source (in) & target (out) nodes, sides, and relationship
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditingLink(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-faint)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Source Node Section (In Node) */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-indigo)' }}>
                From Node (In / Source)
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                Starts here
              </span>
            </div>

            <select
              value={sourceId}
              onChange={e => setSourceId(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--line-strong)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {items.map(it => (
                <option key={it.id} value={it.id}>
                  [{it.type.toUpperCase()}] {it.title}
                </option>
              ))}
            </select>

            {/* Source Side Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Exit Side:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {sides.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSourceHandle(s.id)}
                    style={{
                      padding: '3px 8px',
                      background: sourceHandle === s.id ? 'var(--accent-indigo)' : 'var(--bg-primary)',
                      color: sourceHandle === s.id ? '#fff' : 'var(--text-muted)',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Swap Direction Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={handleSwap}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                background: 'var(--surface)',
                border: '1px solid var(--line-strong)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-main)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.15s ease'
              }}
              title="Reverse link direction"
            >
              <ArrowDownUp size={13} style={{ color: 'var(--accent-indigo)' }} />
              <span>Swap Direction</span>
            </button>
          </div>

          {/* Target Node Section (Out Node) */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan)' }}>
                To Node (Out / Target)
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                Points to here
              </span>
            </div>

            <select
              value={targetId}
              onChange={e => setTargetId(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--line-strong)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {items.map(it => (
                <option key={it.id} value={it.id} disabled={it.id === sourceId}>
                  [{it.type.toUpperCase()}] {it.title} {it.id === sourceId ? '(cannot connect to itself)' : ''}
                </option>
              ))}
            </select>

            {/* Target Side Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Entry Side:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {sides.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setTargetHandle(s.id)}
                    style={{
                      padding: '3px 8px',
                      background: targetHandle === s.id ? 'var(--accent-cyan)' : 'var(--bg-primary)',
                      color: targetHandle === s.id ? '#fff' : 'var(--text-muted)',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Relationship Label */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
              Relationship Label
            </label>

            {/* Preset Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {presets.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setLabel(p)}
                  style={{
                    padding: '4px 10px',
                    background: label === p ? 'var(--accent-indigo)' : 'var(--bg-primary)',
                    color: label === p ? '#fff' : 'var(--text-muted)',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11.5px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="Or enter custom label (e.g. references, imports from)..."
              onKeyDown={e => {
                if (e.key === 'Enter') handleSave(e);
                if (e.key === 'Escape') setEditingLink(null);
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--line-strong)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '12.5px',
                outline: 'none'
              }}
            />
          </div>

        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderTop: '1px solid var(--line)',
          background: 'var(--surface)'
        }}>
          <button
            type="button"
            onClick={handleDelete}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--radius-sm)',
              color: '#EF4444',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Trash2 size={13} />
            <span>Delete Link</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setEditingLink(null)}
              style={{
                padding: '7px 14px',
                background: 'transparent',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={sourceId === targetId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                background: sourceId === targetId ? 'var(--line-strong)' : 'var(--accent-indigo)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: sourceId === targetId ? 'not-allowed' : 'pointer'
              }}
            >
              <Check size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
