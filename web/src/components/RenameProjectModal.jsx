import React, { useState, useEffect } from 'react';
import { 
  X, 
  FolderGit2, 
  Trash2, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { useNotes } from '../context/NotesContext.jsx';

export default function RenameProjectModal() {
  const { 
    editingProject, 
    setEditingProject, 
    projects, 
    renameProject, 
    deleteProject, 
    allItems 
  } = useNotes();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name || '');
      setDescription(editingProject.description || '');
    }
  }, [editingProject]);

  if (!editingProject) return null;

  const currentProjectItemsCount = allItems.filter(it => it.project_id === editingProject.id).length;
  const isOnlyProject = projects.length <= 1;
  const previewSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    renameProject(editingProject.id, {
      name: name.trim(),
      description: description.trim()
    });

    setEditingProject(null);
  };

  const handleDelete = () => {
    if (isOnlyProject) {
      alert('Cannot delete the last remaining project. Please create or switch to another project first.');
      return;
    }

    const confirmMsg = currentProjectItemsCount > 0
      ? `Are you sure you want to delete "${editingProject.name}" and all its ${currentProjectItemsCount} nodes? (You can undo this with Ctrl+Z)`
      : `Are you sure you want to delete "${editingProject.name}"?`;

    if (window.confirm(confirmMsg)) {
      deleteProject(editingProject.id);
      setEditingProject(null);
    }
  };

  return (
    <div 
      className="modal-backdrop"
      onClick={() => setEditingProject(null)}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
        padding: '16px'
      }}
    >
      <div 
        className="modal-container"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'var(--surface-solid)',
          border: '1px solid var(--line-strong)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--line)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-indigo-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-indigo)'
            }}>
              <FolderGit2 size={17} />
            </div>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>
                Rename & Manage Project
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                Update project name, description, or delete project
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditingProject(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-faint)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Project Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
              Project Name <span style={{ color: 'var(--accent-indigo)' }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. dinas-studio, personal-portfolio"
              autoFocus
              style={{
                padding: '9px 12px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--line-strong)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            {previewSlug && (
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}>
                Slug: <strong style={{ color: 'var(--accent-indigo)' }}>{previewSlug}</strong>
              </span>
            )}
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
              Short Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What is this project about? (optional)"
              rows={2}
              style={{
                padding: '9px 12px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--line-strong)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '13px',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Project Stats Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11.5px',
            color: 'var(--text-muted)'
          }}>
            <span>Contains <strong>{currentProjectItemsCount}</strong> note cards.</span>
          </div>

        </form>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderTop: '1px solid var(--line)',
          background: 'var(--surface)'
        }}>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isOnlyProject}
            title={isOnlyProject ? 'Cannot delete the only project' : 'Delete this project'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              background: isOnlyProject ? 'transparent' : 'rgba(239, 68, 68, 0.1)',
              border: isOnlyProject ? '1px solid var(--line)' : '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--radius-sm)',
              color: isOnlyProject ? 'var(--text-faint)' : '#EF4444',
              fontSize: '12px',
              fontWeight: 600,
              cursor: isOnlyProject ? 'not-allowed' : 'pointer',
              opacity: isOnlyProject ? 0.5 : 1
            }}
          >
            <Trash2 size={13} />
            <span>Delete Project</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setEditingProject(null)}
              style={{
                padding: '7px 14px',
                background: 'transparent',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!name.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                background: !name.trim() ? 'var(--line-strong)' : 'var(--accent-indigo)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: !name.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              <Check size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
