import NodeHandles from './NodeHandles.jsx';
import { Cpu, Trash2, Edit2 } from 'lucide-react';
import { useNotes } from '../../../context/NotesContext.jsx';

export default function TechNode({ id, data, selected }) {
  const { deleteItem, setEditingItem } = useNotes();

  const handleEdit = (e) => {
    e.stopPropagation();
    setEditingItem(data.rawItem || { id, ...data });
  };

  return (
    <div 
      className={`node-card ${selected ? 'selected' : ''}`} 
      onDoubleClick={handleEdit}
      title="Double-click to edit node"
      style={{
        borderLeft: '4px solid var(--accent-cyan)'
      }}
    >
      <NodeHandles />
      
      <div className="node-header">
        <span className="type-badge type-tech">
          <Cpu size={11} />
          Tech Stack
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={handleEdit}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-faint)',
              cursor: 'pointer',
              padding: '2px',
              borderRadius: 'var(--radius-sm)'
            }}
            title="Edit node (or double-click card)"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteItem(id);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-faint)',
              cursor: 'pointer',
              padding: '2px',
              borderRadius: 'var(--radius-sm)'
            }}
            title="Delete item"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="node-title" style={{ color: 'var(--accent-cyan)' }}>
        {data.title}
      </div>

      {data.content && (
        <p className="node-desc">{data.content}</p>
      )}

      {data.metadata?.tags && data.metadata.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
          {data.metadata.tags.map((tag, idx) => (
            <span key={idx} style={{
              fontSize: '10.5px',
              fontFamily: 'var(--font-mono)',
              background: 'var(--accent-cyan-soft)',
              color: 'var(--accent-cyan)',
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)'
            }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

    </div>
  );
}
