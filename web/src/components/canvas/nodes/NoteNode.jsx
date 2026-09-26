import NodeHandles from './NodeHandles.jsx';
import { FileText, Trash2, Edit2 } from 'lucide-react';
import { useNotes } from '../../../context/NotesContext.jsx';
import MarkdownRenderer from '../../common/MarkdownRenderer.jsx';

export default function NoteNode({ id, data, selected }) {
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
        borderLeft: '4px solid var(--accent-slate)'
      }}
    >
      <NodeHandles />
      
      <div className="node-header">
        <span className="type-badge type-note">
          <FileText size={11} />
          Note
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
        <MarkdownRenderer content={data.content} compact className="node-desc" />
      )}

    </div>
  );
}
