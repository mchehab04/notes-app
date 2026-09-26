import NodeHandles from './NodeHandles.jsx';
import { BookOpen, Trash2, ArrowUpRight, Edit2 } from 'lucide-react';
import { useNotes } from '../../../context/NotesContext.jsx';
import MarkdownRenderer from '../../common/MarkdownRenderer.jsx';

export default function DeepDiveNode({ id, data, selected }) {
  const { setActiveDeepDive, deleteItem, setEditingItem } = useNotes();

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
        borderLeft: '4px solid var(--accent-indigo)'
      }}
    >
      <NodeHandles />
      
      <div className="node-header">
        <span className="type-badge type-deep_dive">
          <BookOpen size={11} />
          Deep-Dive
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

      <div className="node-title">
        {data.title}
      </div>

      {data.content && (
        <div style={{ maxHeight: '72px', overflow: 'hidden', position: 'relative', margin: '4px 0' }}>
          <MarkdownRenderer 
            content={data.content.replace(/^#+\s*.+/gm, '').trim() || data.content} 
            compact 
          />
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveDeepDive(data.rawItem || { id, ...data });
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          width: '100%',
          padding: '6px 10px',
          background: 'var(--accent-indigo-soft)',
          border: '1px solid var(--accent-indigo)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--accent-indigo)',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: '4px',
          transition: 'all 0.15s ease'
        }}
      >
        <span>Read Deep-Dive</span>
        <ArrowUpRight size={13} />
      </button>

    </div>
  );
}
