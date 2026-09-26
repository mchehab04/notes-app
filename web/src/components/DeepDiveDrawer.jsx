import React, { useState, useEffect } from 'react';
import { X, Edit3, Check, BookOpen, Clock, Tag, ExternalLink } from 'lucide-react';
import { useNotes } from '../context/NotesContext.jsx';
import MarkdownRenderer from './common/MarkdownRenderer.jsx';

export default function DeepDiveDrawer() {
  const { activeDeepDive, setActiveDeepDive, updateItem, items, links } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (activeDeepDive) {
      setEditTitle(activeDeepDive.title || '');
      setEditContent(activeDeepDive.content || '');
      setIsEditing(false);
    }
  }, [activeDeepDive]);

  if (!activeDeepDive) return null;

  const handleSave = () => {
    updateItem(activeDeepDive.id, {
      title: editTitle,
      content: editContent
    });
    setIsEditing(false);
  };

  // Find incoming and outgoing links for this deep dive
  const connectedOut = links
    .filter(l => l.source_item_id === activeDeepDive.id)
    .map(l => ({ ...l, target: items.find(it => it.id === l.target_item_id) }))
    .filter(l => Boolean(l.target));

  const connectedIn = links
    .filter(l => l.target_item_id === activeDeepDive.id)
    .map(l => ({ ...l, source: items.find(it => it.id === l.source_item_id) }))
    .filter(l => Boolean(l.source));

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={() => setActiveDeepDive(null)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(3px)',
          zIndex: 45
        }}
      />

      {/* Slide-out Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'min(640px, 92vw)',
        background: 'var(--surface-solid)',
        borderLeft: '1px solid var(--line-strong)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="type-badge type-deep_dive">
              <BookOpen size={12} />
              Deep-Dive
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isEditing ? (
              <button
                onClick={handleSave}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  background: 'var(--accent-emerald)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Check size={14} />
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  background: 'var(--accent-slate-soft)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={13} />
                Edit
              </button>
            )}

            <button
              onClick={() => setActiveDeepDive(null)}
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
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    marginTop: '6px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--line-strong)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    fontSize: '15px',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
                  Markdown Body
                </label>
                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  rows={20}
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginTop: '6px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--line-strong)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          ) : (
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1.25, marginBottom: '16px' }}>
                {activeDeepDive.title}
              </h1>

              {/* Connected Items Flow Summary */}
              {(connectedIn.length > 0 || connectedOut.length > 0) && (
                <div style={{
                  padding: '12px 14px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-faint)' }}>
                    Connected Graph Links
                  </span>

                  {connectedIn.map(link => (
                    <div key={link.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px' }}>
                      <span style={{ color: 'var(--accent-indigo)' }}>↰ Raised by:</span>
                      <b>{link.source.title}</b>
                      <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>({link.source.type})</span>
                    </div>
                  ))}

                  {connectedOut.map(link => (
                    <div key={link.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px' }}>
                      <span style={{ color: 'var(--accent-emerald)' }}>↳ Leads to:</span>
                      <b>{link.target.title}</b>
                      <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>({link.target.type})</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Rendered Prose Content */}
              {activeDeepDive.content ? (
                <MarkdownRenderer content={activeDeepDive.content} />
              ) : (
                <div style={{ color: 'var(--text-faint)', fontStyle: 'italic', fontSize: '14px' }}>
                  No content provided yet. Click "Edit" to write this deep-dive.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
