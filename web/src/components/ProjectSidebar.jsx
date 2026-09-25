import React, { useState } from 'react';
import { 
  X, 
  FolderGit2, 
  Search, 
  Plus, 
  ChevronRight, 
  CheckCircle2, 
  ExternalLink,
  Edit2,
  Trash2 
} from 'lucide-react';
import { useNotes } from '../context/NotesContext.jsx';

export default function ProjectSidebar() {
  const { 
    projects, 
    activeProjectSlug, 
    setActiveProjectSlug, 
    isSidebarOpen, 
    setIsSidebarOpen, 
    allItems, 
    addProject,
    setEditingProject,
    deleteProject 
  } = useNotes();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    await addProject({ name: newProjectName.trim(), description: newProjectDesc.trim() });
    setNewProjectName('');
    setNewProjectDesc('');
    setIsCreating(false);
  };

  const handleDelete = (proj) => {
    if (projects.length <= 1) {
      alert('Cannot delete the last remaining project.');
      return;
    }
    const count = allItems.filter(it => it.project_id === proj.id).length;
    const msg = count > 0
      ? `Delete project "${proj.name}" and its ${count} node cards? (This can be undone with Ctrl+Z)`
      : `Delete project "${proj.name}"?`;
    if (window.confirm(msg)) {
      deleteProject(proj.id);
    }
  };

  if (!isSidebarOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={() => setIsSidebarOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 40
        }}
      />

      {/* Drawer */}
      <aside 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '320px',
          background: 'var(--surface-solid)',
          borderRight: '1px solid var(--line-strong)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderGit2 size={18} color="var(--accent-indigo)" />
            <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Learning-AI Projects</h2>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Input */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 10px'
          }}>
            <Search size={14} color="var(--text-faint)" />
            <input
              type="text"
              placeholder="Filter projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '13px',
                outline: 'none',
                width: '100%'
              }}
            />
          </div>
        </div>

        {/* Project List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {filteredProjects.map(proj => {
            const isActive = proj.slug === activeProjectSlug;
            const projectTodoCount = allItems.filter(it => it.project_id === proj.id && it.type === 'todo' && it.metadata?.status !== 'done').length;

            return (
              <div
                key={proj.id}
                style={{
                  width: '100%',
                  background: isActive ? 'var(--accent-indigo-soft)' : 'transparent',
                  border: isActive ? '1px solid var(--accent-indigo)' : '1px solid transparent',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  transition: 'background 0.15s ease'
                }}
                className="project-sidebar-row"
              >
                {/* Main clickable area to activate project */}
                <div 
                  onClick={() => {
                    setActiveProjectSlug(proj.slug);
                    setIsSidebarOpen(false);
                  }}
                  style={{ minWidth: 0, flex: 1, cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '13.5px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--accent-indigo)' : 'var(--text-main)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {proj.name}
                    </span>
                  </div>
                  {proj.description && (
                    <p style={{
                      fontSize: '11.5px',
                      color: 'var(--text-faint)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginTop: '2px'
                    }}>
                      {proj.description}
                    </p>
                  )}
                </div>

                {/* Badges & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px' }}>
                  {projectTodoCount > 0 && (
                    <span style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      background: 'var(--accent-emerald-soft)',
                      color: 'var(--accent-emerald)',
                      padding: '1px 5px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 600,
                      marginRight: '2px'
                    }}>
                      {projectTodoCount} todo
                    </span>
                  )}

                  {/* Rename / Edit Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingProject(proj);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Rename & manage project"
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-indigo)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <Edit2 size={13} />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(proj);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-faint)',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Delete project"
                    onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: Create Project Form */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line)', background: 'var(--bg-primary)' }}>
          {isCreating ? (
            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="text"
                placeholder="Project name..."
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                autoFocus
                style={{
                  padding: '6px 10px',
                  background: 'var(--surface-solid)',
                  border: '1px solid var(--line-strong)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              />
              <input
                type="text"
                placeholder="Short description (optional)..."
                value={newProjectDesc}
                onChange={e => setNewProjectDesc(e.target.value)}
                style={{
                  padding: '6px 10px',
                  background: 'var(--surface-solid)',
                  border: '1px solid var(--line-strong)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              />
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  style={{
                    padding: '4px 8px',
                    background: 'transparent',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '4px 10px',
                    background: 'var(--accent-indigo)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px',
                background: 'transparent',
                border: '1px dashed var(--line-strong)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'border-color 0.15s ease'
              }}
            >
              <Plus size={14} />
              Add New Project
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
