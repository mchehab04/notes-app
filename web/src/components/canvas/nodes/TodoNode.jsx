import NodeHandles from './NodeHandles.jsx';
import { CheckSquare, Square, Trash2, Edit2 } from 'lucide-react';
import { useNotes } from '../../../context/NotesContext.jsx';

export default function TodoNode({ id, data, selected }) {
  const { toggleTodo, deleteItem, setEditingItem } = useNotes();
  const isDone = data.metadata?.status === 'done';

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
        borderLeft: '4px solid var(--accent-emerald)',
        opacity: isDone ? 0.75 : 1
      }}
    >
      <NodeHandles />
      
      <div className="node-header">
        <span className="type-badge type-todo">
          To-do
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

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTodo(id);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: isDone ? 'var(--accent-emerald)' : 'var(--text-muted)',
            cursor: 'pointer',
            padding: 0,
            marginTop: '2px'
          }}
          title={isDone ? 'Mark as open' : 'Mark as completed'}
        >
          {isDone ? <CheckSquare size={17} /> : <Square size={17} />}
        </button>
        <span 
          className="node-title" 
          style={{ 
            textDecoration: isDone ? 'line-through' : 'none',
            color: isDone ? 'var(--text-muted)' : 'var(--text-main)'
          }}
        >
          {data.title}
        </span>
      </div>

      {data.content && (
        <p className="node-desc">{data.content}</p>
      )}

    </div>
  );
}
