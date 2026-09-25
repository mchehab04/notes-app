import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Cpu, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  Filter
} from 'lucide-react';
import { useNotes } from '../../context/NotesContext.jsx';

export default function MobileStreamView() {
  const { items, links, toggleTodo, setActiveDeepDive } = useNotes();
  const [filterType, setFilterType] = useState('all');

  const filteredItems = items.filter(it => {
    if (filterType === 'all') return true;
    return it.type === filterType;
  });

  const scrollToItem = (itemId) => {
    const el = document.getElementById(`stream-card-${itemId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.transition = 'all 0.3s ease';
      el.style.transform = 'scale(1.02)';
      el.style.boxShadow = '0 0 20px var(--accent-indigo)';
      setTimeout(() => {
        el.style.transform = 'none';
        el.style.boxShadow = 'var(--shadow-md)';
      }, 1200);
    }
  };

  return (
    <div style={{
      width: '100%',
      height: 'calc(100vh - 56px)',
      overflowY: 'auto',
      padding: '16px',
      maxWidth: '680px',
      margin: '0 auto'
    }}>
      {/* Filter Chips Bar */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '14px',
        marginBottom: '10px'
      }}>
        {['all', 'todo', 'tech', 'deep_dive', 'question', 'note'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: filterType === t ? '1px solid var(--accent-indigo)' : '1px solid var(--line)',
              background: filterType === t ? 'var(--accent-indigo)' : 'var(--surface)',
              color: filterType === t ? '#FFFFFF' : 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {t === 'all' ? 'All Items' : t.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredItems.map(item => {
          const isDone = item.metadata?.status === 'done';

          // Connected Outgoing Links
          const outgoing = links
            .filter(l => l.source_item_id === item.id)
            .map(l => ({ ...l, target: items.find(it => it.id === l.target_item_id) }))
            .filter(l => Boolean(l.target));

          // Connected Incoming Links
          const incoming = links
            .filter(l => l.target_item_id === item.id)
            .map(l => ({ ...l, source: items.find(it => it.id === l.source_item_id) }))
            .filter(l => Boolean(l.source));

          return (
            <div
              key={item.id}
              id={`stream-card-${item.id}`}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderLeft: `4px solid ${
                  item.type === 'todo' ? 'var(--accent-emerald)' :
                  item.type === 'tech' ? 'var(--accent-cyan)' :
                  item.type === 'deep_dive' ? 'var(--accent-indigo)' :
                  item.type === 'question' ? 'var(--accent-amber)' : 'var(--accent-slate)'
                }`,
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              {/* Type Badge Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={`type-badge type-${item.type}`}>
                  {item.type.replace('_', ' ')}
                </span>

                {item.type === 'deep_dive' && (
                  <button
                    onClick={() => setActiveDeepDive(item)}
                    style={{
                      background: 'var(--accent-indigo-soft)',
                      color: 'var(--accent-indigo)',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Read Drawer
                  </button>
                )}
              </div>

              {/* Title & Todo Checkbox */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                {item.type === 'todo' && (
                  <button
                    onClick={() => toggleTodo(item.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isDone ? 'var(--accent-emerald)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px', // ensures tap target
                      marginTop: '1px'
                    }}
                  >
                    {isDone ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                )}
                <span style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  lineHeight: '1.3',
                  textDecoration: isDone ? 'line-through' : 'none',
                  color: isDone ? 'var(--text-muted)' : 'var(--text-main)'
                }}>
                  {item.title}
                </span>
              </div>

              {/* Content Description */}
              {item.content && (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.45' }}>
                  {item.content}
                </p>
              )}

              {/* Connected Links with Accessible 44px Touch Targets */}
              {(incoming.length > 0 || outgoing.length > 0) && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  borderTop: '1px solid var(--line)',
                  paddingTop: '8px'
                }}>
                  {incoming.map(l => (
                    <button
                      key={l.id}
                      onClick={() => scrollToItem(l.source.id)}
                      style={{
                        minHeight: '44px', // 44px tap target rule
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        background: 'var(--surface-solid)',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-main)',
                        fontSize: '12px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <ArrowLeft size={13} color="var(--accent-indigo)" />
                      <span style={{ color: 'var(--text-faint)' }}>Raised by:</span>
                      <b style={{ color: 'var(--accent-indigo)' }}>{l.source.title}</b>
                    </button>
                  ))}

                  {outgoing.map(l => (
                    <button
                      key={l.id}
                      onClick={() => scrollToItem(l.target.id)}
                      style={{
                        minHeight: '44px', // 44px tap target rule
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        background: 'var(--surface-solid)',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-main)',
                        fontSize: '12px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <ArrowRight size={13} color="var(--accent-emerald)" />
                      <span style={{ color: 'var(--text-faint)' }}>Leads to:</span>
                      <b style={{ color: 'var(--accent-emerald)' }}>{l.target.title}</b>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
