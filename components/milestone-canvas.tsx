'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { MilestoneNode, type MilestoneData } from './milestone-node';
import { MilestoneEditorPanel } from './milestone-editor-panel';
import { CommandHistory, type CommandState } from '@/lib/command-history';
import { Undo2, Redo2, Plus, Trash2, Hand, MousePointer } from 'lucide-react';

const nodeTypes = {
  milestone: MilestoneNode,
};

const initialNodes: Node<MilestoneData>[] = [
  {
    id: '1',
    data: {
      title: 'Planning & Research',
      description: 'Define scope, goals, and requirements for the project',
      status: 'completed',
      color: '#dcfce7',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    data: {
      title: 'Design Phase',
      description: 'Create wireframes, mockups, and design system',
      status: 'completed',
      color: '#dcfce7',
    },
    position: { x: 300, y: -100 },
  },
  {
    id: '3',
    data: {
      title: 'Development',
      description: 'Build and implement the solution',
      status: 'pending',
      color: '#fef3c7',
    },
    position: { x: 600, y: 0 },
  },
  {
    id: '4',
    data: {
      title: 'Testing & QA',
      description: 'Quality assurance and bug fixes',
      status: 'pending',
      color: '#fce7f3',
    },
    position: { x: 900, y: -100 },
  },
  {
    id: '5',
    data: {
      title: 'Launch',
      description: 'Deploy to production and monitor',
      status: 'pending',
      color: '#e0f2fe',
    },
    position: { x: 1200, y: 0 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
];

export function MilestoneCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedEdgeIds, setSelectedEdgeIds] = useState<string[]>([]);
  const [interactionMode, setInteractionMode] = useState<'pan' | 'select'>('pan');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const historyRef = useRef(new CommandHistory());
  const undobleRef = useRef(() => {});
  const redoRef = useRef(() => {});
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (_: any, node: Node<MilestoneData>) => {
      setSelectedNodeIds([node.id]);
    },
    []
  );

  const selectedNodes = nodes.filter((node) => selectedNodeIds.includes(node.id));
  const selectedNode = selectedNodes.length === 1 ? selectedNodes[0] : null;

  const handleUpdateNode = useCallback(
    (updatedNode: Node<MilestoneData>) => {
      setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
      setSelectedNodeIds([updatedNode.id]);
    },
    [setNodes]
  );

  const handleAddNode = useCallback(() => {
    const newId = String(Math.max(...nodes.map((n) => parseInt(n.id) || 0)) + 1);
    const lastNode = nodes[nodes.length - 1];
    const newPosition = {
      x: (lastNode?.position.x || 0) + 320,
      y: (lastNode?.position.y || 0),
    };

    const newNode: Node<MilestoneData> = {
      id: newId,
      data: {
        title: 'New Milestone',
        description: 'Add a description for this milestone',
        status: 'pending',
        color: '#e0f2fe',
      },
      position: newPosition,
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeIds([newNode.id]);
  }, [nodes, setNodes]);

  const handleDeleteSelection = useCallback(() => {
    if (selectedNodeIds.length === 0 && selectedEdgeIds.length === 0) return;

    const deletedNodes = nodes.filter((node) => selectedNodeIds.includes(node.id));
    const deletedNodeIds = new Set(deletedNodes.map((node) => node.id));
    const deletedEdges = edges.filter(
      (edge) =>
        selectedEdgeIds.includes(edge.id) ||
        deletedNodeIds.has(edge.source) ||
        deletedNodeIds.has(edge.target)
    );

    const command = {
      type: 'delete-node' as const,
      timestamp: Date.now(),
      execute: (state: CommandState) => ({
        ...state,
        nodes: state.nodes.filter((node) => !selectedNodeIds.includes(node.id)),
        edges: state.edges.filter(
          (edge) =>
            !selectedEdgeIds.includes(edge.id) &&
            !selectedNodeIds.includes(edge.source) &&
            !selectedNodeIds.includes(edge.target)
        ),
      }),
      undo: (state: CommandState) => ({
        ...state,
        nodes: [...state.nodes, ...deletedNodes],
        edges: [...state.edges, ...deletedEdges],
      }),
    };

    const currentState = { nodes, edges };
    const newState = historyRef.current.execute(command, currentState);
    
    setNodes(newState.nodes);
    setEdges(newState.edges);
    setSelectedNodeIds([]);
    setSelectedEdgeIds([]);
    setCanUndo(historyRef.current.canUndo());
    setCanRedo(historyRef.current.canRedo());
  }, [selectedNodeIds, selectedEdgeIds, nodes, edges, setNodes, setEdges]);

  const handleUndo = useCallback(() => {
    const currentState = { nodes, edges };
    const { newState, canUndo: canUndoAfter } = historyRef.current.undo(currentState);
    
    setNodes(newState.nodes);
    setEdges(newState.edges);
    setCanUndo(canUndoAfter);
    setCanRedo(historyRef.current.canRedo());
  }, [nodes, edges, setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    const currentState = { nodes, edges };
    const { newState, canRedo: canRedoAfter } = historyRef.current.redo(currentState);
    
    setNodes(newState.nodes);
    setEdges(newState.edges);
    setCanUndo(historyRef.current.canUndo());
    setCanRedo(canRedoAfter);
  }, [nodes, edges, setNodes, setEdges]);

  // Update refs for keyboard handler
  useEffect(() => {
    undobleRef.current = handleUndo;
    redoRef.current = handleRedo;
  }, [handleUndo, handleRedo]);

  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undobleRef.current();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redoRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNodeIds([]);
    setSelectedEdgeIds([]);
  }, []);

  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes, edges: selectedEdges }: { nodes: Node[]; edges: Edge[] }) => {
      setSelectedNodeIds(selectedNodes.map((node) => node.id));
      setSelectedEdgeIds(selectedEdges.map((edge) => edge.id));
    },
    []
  );

  useEffect(() => {
    const handleDeleteKey = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const target = event.target as HTMLElement | null;
        const isTyping =
          target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
        if (!isTyping) {
          event.preventDefault();
          handleDeleteSelection();
        }
      }
    };

    window.addEventListener('keydown', handleDeleteKey);
    return () => window.removeEventListener('keydown', handleDeleteKey);
  }, [handleDeleteSelection]);

  return (
    <div className="flex h-full w-full bg-gradient-to-br from-blue-50 to-indigo-50">
      <div id="milestone-canvas-export" className="flex-1 relative">
        {/* Undo/Redo Toolbar */}
        <div className="absolute top-4 left-4 z-50 flex gap-2 bg-white rounded-lg shadow-md p-2 border border-gray-200">
          <button
            onClick={() => setInteractionMode('pan')}
            className={`p-2 rounded transition-colors ${
              interactionMode === 'pan' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Pan mode: drag to move canvas"
            aria-label="Pan mode"
          >
            <Hand size={20} />
          </button>
          <button
            onClick={() => setInteractionMode('select')}
            className={`p-2 rounded transition-colors ${
              interactionMode === 'select' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Select mode: drag to select multiple items"
            aria-label="Select mode"
          >
            <MousePointer size={20} />
          </button>
          <div className="w-px bg-gray-200" />
          <button
            onClick={handleAddNode}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Add milestone"
            aria-label="Add milestone"
          >
            <Plus size={20} className="text-gray-700" />
          </button>
          <button
            onClick={handleDeleteSelection}
            disabled={selectedNodeIds.length === 0 && selectedEdgeIds.length === 0}
            className="p-2 rounded hover:bg-red-50 text-red-600 disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
            title="Delete selected (Delete)"
            aria-label="Delete selected"
          >
            <Trash2 size={20} />
          </button>
          <div className="w-px bg-gray-200" />
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 size={20} className="text-gray-700" />
          </button>
          <div className="w-px bg-gray-200" />
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
          >
            <Redo2 size={20} className="text-gray-700" />
          </button>
        </div>

        <ReactFlow
          nodes={nodes.map((node) => ({ ...node, type: 'milestone' }))}
          edges={edges.map((edge) => ({
            ...edge,
            style: selectedEdgeIds.includes(edge.id)
              ? { stroke: '#2563eb', strokeWidth: 3 }
              : { stroke: '#64748b', strokeWidth: 2 },
          }))}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          onSelectionChange={handleSelectionChange}
          selectionOnDrag={interactionMode === 'select'}
          panOnDrag={interactionMode === 'pan'}
          selectNodesOnDrag={interactionMode === 'select'}
          multiSelectionKeyCode={['Meta', 'Control', 'Shift']}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background gap={16} size={1.2} />
          <MiniMap pannable zoomable />
          <Controls />
        </ReactFlow>
      </div>

      <MilestoneEditorPanel
        selectedNode={selectedNode}
        onUpdateNode={handleUpdateNode}
        onAddNode={handleAddNode}
        onDeleteNode={handleDeleteSelection}
        selectedCount={selectedNodeIds.length + selectedEdgeIds.length}
      />
    </div>
  );
}
