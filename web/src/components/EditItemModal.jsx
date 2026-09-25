import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Check, 
  Link2, 
  Plus, 
  CheckSquare, 
  Square, 
  Cpu, 
  BookOpen, 
  HelpCircle, 
  FileText 
} from 'lucide-react';
import { useNotes } from '../context/NotesContext.jsx';

export default function EditItemModal() {
  const { 
    editingItem, 
    setEditingItem, 
    items, 
    links, 
    updateItem, 
    deleteItem, 
    addLink, 
    deleteLink 
  } = useNotes();

  const [type, setType] = useState('todo');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [newLinkedId, setNewLinkedId] = useState('');
  const [newLinkLabel, setNewLinkLabel] = useState('connects to');

  useEffect(() => {
    if (editingItem) {
      setType(editingItem.type || 'todo');
      setTitle(editingItem.title || '');
      setContent(editingItem.content || '');
      setIsDone(editingItem.metadata?.status === 'done');
      setNewLinkedId('');
      setNewLinkLabel('connects to');
    }
  }, [editingItem]);

  if (!editingItem) return null;

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    updateItem(editingItem.id, {
      type,
      title: title.trim(),
      content: content.trim(),
      metadata: {
        ...editingItem.metadata,
        status: isDone ? 'done' : 'open'
      }
    });

    setEditingItem(null);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${editingItem.title}" and its connections?`)) {
      deleteItem(editingItem.id);
      setEditingItem(null);
    }
  };

  const handleAddLink = () => {
    if (!newLinkedId) return;
    addLink(editingItem.id, newLinkedId, newLinkLabel.trim());
    setNewLinkedId('');
  };

  const types = [
    { id: 'todo', label: 'To-do', icon: CheckSquare, color: 'var(--accent-emerald)' },
    { id: 'tech', label: 'Tech Stack', icon: Cpu, color: 'var(--accent-cyan)' },
    { id: 'deep_dive', label: 'Deep-Dive', icon: BookOpen, color: 'var(--accent-indigo)' },
    { id: 'question', label: 'Question', icon: HelpCircle, color: 'var(--accent-amber)' },
    { id: 'note', label: 'Note', icon: FileText, color: 'var(--accent-slate)' }
  ];

  // Connected links for this node
  const outgoingLinks = links
    .filter(l => l.source_item_id === editingItem.id)
    .map(l => ({ ...l, target: items.find(it => it.id === l.target_item_id) }))
    .filter(l => Boolean(l.target));

  const incomingLinks = links
    .filter(l => l.target_item_id === editingItem.id)
    .map(l => ({ ...l, source: items.find(it => it.id === l.source_item_id) }))
    .filter(l => Boolean(l.source));

  // Available items to link to (exclude self)
  const availableToLink = items.filter(it => it.id !== editingItem.id);

  return (
    <>
      <div 
        onClick={() => setEditingItem(null)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(5px)',
          zIndex: 70
        }}
      />

      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(560px, 94vw)',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'var(--surface-solid)',
        border: '1px solid var(--line-strong)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 80,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>Edit Node</span>
            <span style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-faint)',
              background: 'var(--accent-slate-soft)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)'
            }}>
              id: {editingItem.id}
            </span>
          </div>

          <button
            onClick={() => setEditingItem(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Type Selector Pills */}
        <div>
          <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
            Node Type
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
            {types.map(t => {
              const Icon = t.icon;
              const isSelected = type === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? `1.5px solid ${t.color}` : '1px solid var(--line)',
                    background: isSelected ? 'var(--surface-hover)' : 'transparent',
                    color: isSelected ? t.color : 'var(--text-muted)',
                    fontSize: '12px',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={13} color={t.color} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title Input */}
        <div>
          <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            autoFocus
            style={{
              width: '100%',
              padding: '9px 12px',
              marginTop: '6px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--line-strong)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-main)',
              fontSize: '14.5px',
              fontWeight: 600,
              outline: 'none'
            }}
          />
        </div>

        {/* Status Toggle for To-dos */}
        {type === 'todo' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--bg-primary)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--line)'
          }}>
            <button
              type="button"
              onClick={() => setIsDone(prev => !prev)}
              style={{
                background: 'transparent',
                border: 'none',
                color: isDone ? 'var(--accent-emerald)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13.5px',
                fontWeight: 600
              }}
            >
              {isDone ? <CheckSquare size={18} /> : <Square size={18} />}
              <span>{isDone ? 'Completed (Done)' : 'Open (Pending)'}</span>
            </button>
          </div>
        )}

        {/* Markdown Content / Description */}
        <div>
          <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
            Description / Markdown Body
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={5}
            placeholder="Add detailed markdown notes, code blocks, or explanations..."
            style={{
              width: '100%',
              padding: '10px 12px',
              marginTop: '6px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--line-strong)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: '1.5',
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Connected Graph Links Section */}
        <div style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link2 size={14} color="var(--accent-indigo)" />
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-faint)' }}>
              Connected Links ({incomingLinks.length + outgoingLinks.length})
            </span>
          </div>

          {/* Incoming Links */}
          {incomingLinks.map(l => (
            <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px', padding: '4px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'var(--accent-indigo)' }}>↰ Raised by:</span>
                <b>{l.source.title}</b>
                <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>({l.source.type})</span>
              </div>
              <button
                type="button"
                onClick={() => deleteLink(l.id)}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-amber)', cursor: 'pointer', padding: '2px' }}
                title="Remove link"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {/* Outgoing Links */}
          {outgoingLinks.map(l => (
            <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px', padding: '4px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'var(--accent-emerald)' }}>↳ Leads to:</span>
                <b>{l.target.title}</b>
                <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>({l.target.type})</span>
              </div>
              <button
                type="button"
                onClick={() => deleteLink(l.id)}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-amber)', cursor: 'pointer', padding: '2px' }}
                title="Remove link"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {incomingLinks.length === 0 && outgoingLinks.length === 0 && (
            <p style={{ fontSize: '12px', color: 'var(--text-faint)', fontStyle: 'italic' }}>
              No links connected to this item yet.
            </p>
          )}

          {/* Add Link Row */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', borderTop: '1px solid var(--line)', paddingTop: '8px' }}>
            <select
              value={newLinkedId}
              onChange={e => setNewLinkedId(e.target.value)}
              style={{
                flex: 1,
                padding: '6px 8px',
                background: 'var(--surface-solid)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '12px',
                outline: 'none'
              }}
            >
              <option value="">Link to another item...</option>
              {availableToLink.map(it => (
                <option key={it.id} value={it.id}>
                  [{it.type.toUpperCase()}] {it.title.slice(0, 32)}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleAddLink}
              disabled={!newLinkedId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                background: newLinkedId ? 'var(--accent-indigo)' : 'var(--line)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: newLinkedId ? 'pointer' : 'default',
                opacity: newLinkedId ? 1 : 0.6
              }}
            >
              <Plus size={13} />
              <span>Link</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: '14px' }}>
          <button
            type="button"
            onClick={handleDelete}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'transparent',
              color: '#EF4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12.5px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <Trash2 size={14} />
            <span>Delete Node</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              style={{
                padding: '6px 14px',
                background: 'transparent',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-muted)',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 18px',
                background: 'var(--accent-indigo)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Check size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
