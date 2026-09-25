import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  ControlButton,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  ConnectionMode
} from '@xyflow/react';
import { RotateCcw, RotateCw } from 'lucide-react';
import { useNotes } from '../../context/NotesContext.jsx';
import TodoNode from './nodes/TodoNode.jsx';
import TechNode from './nodes/TechNode.jsx';
import DeepDiveNode from './nodes/DeepDiveNode.jsx';
import QuestionNode from './nodes/QuestionNode.jsx';
import NoteNode from './nodes/NoteNode.jsx';
import AdjustableEdge from './edges/AdjustableEdge.jsx';
import QuickAddDock from './QuickAddDock.jsx';

const nodeTypes = {
  todo: TodoNode,
  tech: TechNode,
  deep_dive: DeepDiveNode,
  question: QuestionNode,
  note: NoteNode
};

const edgeTypes = {
  adjustable: AdjustableEdge
};

export default function NotesCanvas() {
  const { 
    items, 
    links, 
    addLink, 
    updateLink, 
    deleteLink, 
    updateItemPosition, 
    addItem, 
    theme, 
    setEditingItem,
    setEditingLink,
    undo,
    redo,
    canUndo,
    canRedo,
    takeSnapshot
  } = useNotes();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Sync React Flow nodes when items change
  useEffect(() => {
    setNodes((prevNodes) => {
      const prevMap = new Map(prevNodes.map(n => [n.id, n]));
      return items.map(item => {
        const existing = prevMap.get(item.id);
        // If node is currently being dragged, preserve its live dragging position
        const position = existing?.dragging
          ? existing.position
          : (item.metadata?.position || { x: 100, y: 100 });

        return {
          id: item.id,
          type: item.type in nodeTypes ? item.type : 'note',
          position,
          data: {
            title: item.title,
            content: item.content,
            metadata: item.metadata,
            rawItem: item
          }
        };
      });
    });
  }, [items, setNodes]);

  // Sync React Flow edges when links change
  useEffect(() => {
    setEdges(links.map(link => ({
      id: link.id,
      source: link.source_item_id,
      target: link.target_item_id,
      sourceHandle: link.source_handle || 'bottom',
      targetHandle: link.target_handle || 'top',
      type: 'adjustable',
      reconnectable: true,
      data: {
        label: link.label || '',
        link
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'var(--accent-indigo)',
        width: 16,
        height: 16
      }
    })));
  }, [links, setEdges]);

  // Node Drag Start: capture snapshot so moving can be undone
  const onNodeDragStart = useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  // Node Drag Stop: persist to Supabase / local storage
  const onNodeDragStop = useCallback((event, node) => {
    updateItemPosition(node.id, node.position);
  }, [updateItemPosition]);

  // Double Click Node to Edit
  const onNodeDoubleClick = useCallback((event, node) => {
    const raw = node.data?.rawItem || items.find(it => it.id === node.id);
    if (raw) {
      setEditingItem(raw);
    }
  }, [items, setEditingItem]);

  // Double Click Edge to Edit In and Out Nodes
  const onEdgeDoubleClick = useCallback((event, edge) => {
    const linkData = edge.data?.link || links.find(l => l.id === edge.id) || {
      id: edge.id,
      source_item_id: edge.source,
      target_item_id: edge.target,
      source_handle: edge.sourceHandle,
      target_handle: edge.targetHandle,
      label: edge.data?.label
    };
    setEditingLink(linkData);
  }, [links, setEditingLink]);

  // Handle Edge Reconnection (dragging arrow endpoints to other handles/nodes)
  const onReconnect = useCallback((oldEdge, newConnection) => {
    updateLink(oldEdge.id, {
      source_item_id: newConnection.source,
      target_item_id: newConnection.target,
      source_handle: newConnection.sourceHandle || 'bottom',
      target_handle: newConnection.targetHandle || 'top'
    });
  }, [updateLink]);

  // Handle Edge Changes (e.g. keyboard delete / backspace)
  const handleEdgesChange = useCallback((changes) => {
    onEdgesChange(changes);
    for (const change of changes) {
      if (change.type === 'remove') {
        deleteLink(change.id);
      }
    }
  }, [onEdgesChange, deleteLink]);

  // Handle Dragging an Edge from Handle to Handle
  const onConnect = useCallback((params) => {
    addLink(
      params.source, 
      params.target, 
      'connects to', 
      params.sourceHandle || 'bottom', 
      params.targetHandle || 'top'
    );
  }, [addLink]);

  // Handle Quick Add from Dock
  const handleQuickAdd = useCallback((type) => {
    const titles = {
      todo: 'New to-do task',
      tech: 'FastF1 API',
      deep_dive: 'FastF1 Internals & Telemetry Caching',
      question: 'Can we cache telemetry locally?',
      note: 'Key insight from architecture review'
    };

    // Calculate position slightly jittered around center
    const x = 300 + (items.length % 5) * 40;
    const y = 200 + (items.length % 5) * 30;

    addItem({
      type,
      title: titles[type] || 'New Item',
      metadata: { position: { x, y } }
    });
  }, [addItem, items.length]);

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 56px)', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        onNodesChange={onNodesChange}
        onEdgesChange={handleEdgesChange}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onNodeDoubleClick={onNodeDoubleClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onConnect={onConnect}
        onReconnect={onReconnect}
        edgesReconnectable={true}
        reconnectRadius={25}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'adjustable',
          reconnectable: true
        }}
      >
        <Background 
          color={theme === 'dark' ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)'} 
          gap={24} 
          size={1.5} 
        />
        <Controls position="top-right">
          <ControlButton 
            onClick={undo} 
            disabled={!canUndo} 
            title="Undo (Ctrl+Z)"
            style={{ opacity: canUndo ? 1 : 0.4 }}
          >
            <RotateCcw size={14} />
          </ControlButton>
          <ControlButton 
            onClick={redo} 
            disabled={!canRedo} 
            title="Redo (Ctrl+Shift+Z or Ctrl+Y)"
            style={{ opacity: canRedo ? 1 : 0.4 }}
          >
            <RotateCw size={14} />
          </ControlButton>
        </Controls>
        <MiniMap 
          position="bottom-right" 
          nodeColor={node => {
            if (node.type === 'todo') return '#10B981';
            if (node.type === 'tech') return '#06B6D4';
            if (node.type === 'deep_dive') return '#6366F1';
            if (node.type === 'question') return '#F59E0B';
            return '#64748B';
          }}
          maskColor={theme === 'dark' ? 'rgba(11, 15, 25, 0.75)' : 'rgba(248, 250, 252, 0.75)'}
        />
      </ReactFlow>

      {/* Quick Add Bottom Dock */}
      <QuickAddDock onQuickAdd={handleQuickAdd} />
    </div>
  );
}
