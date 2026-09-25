import React, { useState } from 'react';
import { X, Plus, CheckSquare, Cpu, BookOpen, HelpCircle, FileText } from 'lucide-react';
import { useNotes } from '../context/NotesContext.jsx';

export default function AddItemModal() {
  const { isAddItemModalOpen, setIsAddItemModalOpen, items, addItem } = useNotes();

  const [type, setType] = useState('todo');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [linkedToId, setLinkedToId] = useState('');
  const [linkLabel, setLinkLabel] = useState('connects to');

  if (!isAddItemModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addItem({
      type,
      title: title.trim(),
      content: content.trim(),
      linkedToId: linkedToId || null,
      linkLabel: linkLabel.trim()
    });

    setTitle('');
    setContent('');
    setLinkedToId('');
    setIsAddItemModalOpen(false);
  };

  const types = [
    { id: 'todo', label: 'To-do', icon: CheckSquare, color: 'var(--accent-emerald)' },
    { id: 'tech', label: 'Tech Stack', icon: Cpu, color: 'var(--accent-cyan)' },
    { id: 'deep_dive', label: 'Deep-Dive', icon: BookOpen, color: 'var(--accent-indigo)' },
    { id: 'question', label: 'Question', icon: HelpCircle, color: 'var(--accent-amber)' },
    { id: 'note', label: 'Note', icon: FileText, color: 'var(--accent-slate)' }
  ];

  return (
    <>
      <div 
        onClick={() => setIsAddItemModalOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 60
        }}
      />

      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(500px, 94vw)',
        background: 'var(--surface-solid)',
        border: '1px solid var(--line-strong)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 70,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700 }}>Add New Item</h3>
          <button
            onClick={() => setIsAddItemModalOpen(false)}
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
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
                  gap: '6px',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? `1.5px solid ${t.color}` : '1px solid var(--line)',
                  background: isSelected ? 'var(--surface-hover)' : 'transparent',
                  color: isSelected ? t.color : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer'
                }}
              >
                <Icon size={14} color={t.color} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
              Title
            </label>
            <input
              type="text"
              placeholder={type === 'question' ? 'What question came up?' : 'Item title...'}
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                marginTop: '4px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--line-strong)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
              Description / Markdown Body (optional)
            </label>
            <textarea
              placeholder="Add details, notes, or code..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '8px 12px',
                marginTop: '4px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--line-strong)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Link to existing item */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
                Connects to (Link)
              </label>
              <select
                value={linkedToId}
                onChange={e => setLinkedToId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '4px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--line-strong)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  fontSize: '12px',
                  outline: 'none'
                }}
              >
                <option value="">(None - Unlinked)</option>
                {items.map(it => (
                  <option key={it.id} value={it.id}>
                    [{it.type.toUpperCase()}] {it.title.slice(0, 30)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
                Relationship Label
              </label>
              <input
                type="text"
                placeholder="e.g. raises, requires"
                value={linkLabel}
                onChange={e => setLinkLabel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  marginTop: '4px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--line-strong)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => setIsAddItemModalOpen(false)}
              style={{
                padding: '6px 12px',
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
              type="submit"
              style={{
                padding: '6px 16px',
                background: 'var(--accent-indigo)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Add Node
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
