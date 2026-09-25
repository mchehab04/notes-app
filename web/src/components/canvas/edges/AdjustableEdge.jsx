import React, { useState } from 'react';
import { 
  BaseEdge, 
  EdgeLabelRenderer, 
  getBezierPath, 
  getSmoothStepPath, 
  getStraightPath 
} from '@xyflow/react';
import { X, Edit2, Check, ArrowRight } from 'lucide-react';
import { useNotes } from '../../../context/NotesContext.jsx';

export default function AdjustableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data = {},
  selected
}) {
  const { updateLink, deleteLink, setEditingLink, edgeShape = 'bezier' } = useNotes();
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomEditing, setIsCustomEditing] = useState(false);
  const [customText, setCustomText] = useState(data.label || '');

  // Calculate path dynamically based on active curve style
  let edgePath, labelX, labelY;
  if (edgeShape === 'smoothstep') {
    [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 16
    });
  } else if (edgeShape === 'straight') {
    [edgePath, labelX, labelY] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY
    });
  } else {
    // Default: Bezier curve
    [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition
    });
  }

  const currentLabel = data.label || '';

  const handleSelectPreset = (newLabel, e) => {
    e.stopPropagation();
    updateLink(id, { label: newLabel });
    setIsOpen(false);
    setIsCustomEditing(false);
  };

  const handleSaveCustom = (e) => {
    e.stopPropagation();
    if (customText.trim()) {
      updateLink(id, { label: customText.trim() });
    }
    setIsOpen(false);
    setIsCustomEditing(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteLink(id);
  };

  const presets = ['connects to', 'leads to', 'requires', 'raises', 'explains', 'blocks'];

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: selected ? 'var(--accent-indigo)' : (style.stroke || 'var(--accent-indigo)'),
          strokeWidth: selected ? 3.5 : 2,
          filter: selected ? 'drop-shadow(0 0 4px var(--accent-indigo))' : 'none',
          transition: 'stroke-width 0.2s, stroke 0.2s'
        }}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            zIndex: selected || isOpen ? 30 : 10
          }}
          className="nodrag nopan"
        >
          {/* Main Clickable Label Pill */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(prev => !prev);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setEditingLink(data.link || {
                id,
                source_item_id: data.link?.source_item_id,
                target_item_id: data.link?.target_item_id,
                source_handle: data.link?.source_handle,
                target_handle: data.link?.target_handle,
                label: currentLabel
              });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 8px',
              background: 'var(--surface-solid)',
              border: selected || isOpen ? '1.5px solid var(--accent-indigo)' : '1px solid var(--line-strong)',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              userSelect: 'none',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.15s ease'
            }}
            title="Double-click to change in/out nodes, or click to adjust label"
          >
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              color: currentLabel ? 'var(--text-main)' : 'var(--text-faint)',
              whiteSpace: 'nowrap'
            }}>
              {currentLabel || '+ label'}
            </span>

            {/* Quick delete X button on hover/selected */}
            <button
              onClick={handleDelete}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-faint)',
                cursor: 'pointer',
                padding: '1px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '50%',
                marginLeft: '2px'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}
              title="Delete this connection"
            >
              <X size={11} />
            </button>
          </div>

          {/* Quick Adjustment Popover */}
          {isOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--surface-solid)',
                border: '1px solid var(--line-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '10px',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                minWidth: '200px',
                zIndex: 40
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '4px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-faint)' }}>
                  Adjust Relationship
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', padding: '1px' }}
                >
                  <X size={12} />
                </button>
              </div>

              {/* Preset Relationship Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {presets.map(p => (
                  <button
                    key={p}
                    onClick={(e) => handleSelectPreset(p, e)}
                    style={{
                      padding: '3px 8px',
                      background: currentLabel === p ? 'var(--accent-indigo)' : 'var(--bg-primary)',
                      color: currentLabel === p ? '#FFFFFF' : 'var(--text-muted)',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '11px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Custom Label Input */}
              {isCustomEditing ? (
                <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                  <input
                    type="text"
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                    placeholder="Custom relationship..."
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSaveCustom(e);
                      if (e.key === 'Escape') setIsCustomEditing(false);
                    }}
                    style={{
                      flex: 1,
                      padding: '4px 6px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--line-strong)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-main)',
                      fontSize: '11.5px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={handleSaveCustom}
                    style={{
                      padding: '4px 8px',
                      background: 'var(--accent-indigo)',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <Check size={12} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCustomEditing(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '4px',
                    background: 'transparent',
                    border: '1px dashed var(--line-strong)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  <Edit2 size={11} />
                  <span>Custom label...</span>
                </button>
              )}

              {/* Full Edit Connection (In/Out nodes) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  setEditingLink(data.link || {
                    id,
                    source_item_id: data.link?.source_item_id,
                    target_item_id: data.link?.target_item_id,
                    source_handle: data.link?.source_handle,
                    target_handle: data.link?.target_handle,
                    label: currentLabel
                  });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '5px',
                  background: 'var(--accent-indigo-soft)',
                  border: '1px solid var(--accent-indigo)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--accent-indigo)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: '2px'
                }}
              >
                <ArrowRight size={12} />
                <span>Change In / Out Nodes...</span>
              </button>

              {/* Delete Connection Action */}
              <button
                onClick={handleDelete}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '5px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#EF4444',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: '2px'
                }}
              >
                <X size={12} />
                <span>Delete Link</span>
              </button>
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
