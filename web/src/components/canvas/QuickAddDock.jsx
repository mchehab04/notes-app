import React from 'react';
import { CheckSquare, Cpu, BookOpen, HelpCircle, FileText, Plus } from 'lucide-react';
import { useNotes } from '../../context/NotesContext.jsx';

export default function QuickAddDock({ onQuickAdd }) {
  const { setIsAddItemModalOpen, edgeShape, setEdgeShape } = useNotes();

  const actions = [
    { type: 'todo', label: 'To-do', icon: CheckSquare, color: 'var(--accent-emerald)', bg: 'var(--accent-emerald-soft)' },
    { type: 'tech', label: 'Tech Stack', icon: Cpu, color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-soft)' },
    { type: 'deep_dive', label: 'Deep-Dive', icon: BookOpen, color: 'var(--accent-indigo)', bg: 'var(--accent-indigo-soft)' },
    { type: 'question', label: 'Question', icon: HelpCircle, color: 'var(--accent-amber)', bg: 'var(--accent-amber-soft)' },
    { type: 'note', label: 'Note', icon: FileText, color: 'var(--accent-slate)', bg: 'var(--accent-slate-soft)' }
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10,
      background: 'var(--surface)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--line-strong)',
      borderRadius: 'var(--radius-full)',
      padding: '6px 12px',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      userSelect: 'none'
    }}>
      <span style={{
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--text-faint)',
        paddingRight: '4px',
        borderRight: '1px solid var(--line)'
      }}>
        Drop Node
      </span>

      {actions.map(act => {
        const Icon = act.icon;
        return (
          <button
            key={act.type}
            onClick={() => onQuickAdd(act.type)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-main)',
              fontSize: '12.5px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = act.bg;
              e.currentTarget.style.color = act.color;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-main)';
            }}
            title={`Add new ${act.label} node to canvas`}
          >
            <Icon size={14} color={act.color} />
            <span>{act.label}</span>
          </button>
        );
      })}

      <div style={{ height: '16px', width: '1px', background: 'var(--line)', margin: '0 2px' }} />

      {/* Link Shape Adjuster */}
      <button
        onClick={() => {
          const next = edgeShape === 'bezier' ? 'smoothstep' : edgeShape === 'smoothstep' ? 'straight' : 'bezier';
          setEdgeShape(next);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 10px',
          background: 'transparent',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-full)',
          color: 'var(--text-muted)',
          fontSize: '11.5px',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          transition: 'all 0.15s ease'
        }}
        title={`Adjust link shape: Curved / Stepped / Straight (Currently: ${edgeShape})`}
      >
        <span style={{ color: 'var(--accent-indigo)' }}>⚡</span>
        <span>{edgeShape === 'bezier' ? 'Curved' : edgeShape === 'smoothstep' ? 'Stepped' : 'Straight'}</span>
      </button>

      <button
        onClick={() => setIsAddItemModalOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 10px',
          background: 'var(--accent-indigo)',
          border: 'none',
          borderRadius: 'var(--radius-full)',
          color: '#FFFFFF',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)'
        }}
        title="Open full item creator"
      >
        <Plus size={13} />
        <span>Custom</span>
      </button>
    </div>
  );
}
