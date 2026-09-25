import React, { useEffect } from 'react';
import { NotesProvider, useNotes } from './context/NotesContext.jsx';
import Header from './components/Header.jsx';
import ProjectSidebar from './components/ProjectSidebar.jsx';
import NotesCanvas from './components/canvas/NotesCanvas.jsx';
import MobileStreamView from './components/mobile/MobileStreamView.jsx';
import DeepDiveDrawer from './components/DeepDiveDrawer.jsx';
import AddItemModal from './components/AddItemModal.jsx';
import EditItemModal from './components/EditItemModal.jsx';
import EditLinkModal from './components/EditLinkModal.jsx';
import RenameProjectModal from './components/RenameProjectModal.jsx';

function MainLayout() {
  const { viewMode, setIsAddItemModalOpen, undo, redo } = useNotes();

  // Global hotkeys: Ctrl+K (add item), Ctrl+Z (undo), Ctrl+Shift+Z / Ctrl+Y (redo)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      // Add item shortcut: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAddItemModalOpen(prev => !prev);
        return;
      }

      // Undo/Redo shortcuts (only if not currently typing in a text field)
      if (!isInput) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
          e.preventDefault();
          redo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsAddItemModalOpen, undo, redo]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Header />
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {viewMode === 'canvas' ? (
          <NotesCanvas />
        ) : (
          <MobileStreamView />
        )}
      </main>

      <ProjectSidebar />
      <DeepDiveDrawer />
      <AddItemModal />
      <EditItemModal />
      <EditLinkModal />
      <RenameProjectModal />
    </div>
  );
}

export default function App() {
  return (
    <NotesProvider>
      <MainLayout />
    </NotesProvider>
  );
}
