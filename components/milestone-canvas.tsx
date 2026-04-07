'use client';

import { useCallback, useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
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

export type MilestoneCanvasHandle = {
  exportAsPNG: () => Promise<void>;
};

export const MilestoneCanvas = forwardRef<MilestoneCanvasHandle>(function MilestoneCanvas(_, ref) {
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

  const exportAsPNG = useCallback(async () => {
    const NODE_WIDTH = 256;
    const NODE_HEIGHT = 128;
    const PADDING = 48;
    const SCALE = 2;

    if (nodes.length === 0) {
      throw new Error('No milestones to export');
    }

    const minX = Math.min(...nodes.map((node) => node.position.x));
    const minY = Math.min(...nodes.map((node) => node.position.y));
    const maxX = Math.max(...nodes.map((node) => node.position.x + NODE_WIDTH));
    const maxY = Math.max(...nodes.map((node) => node.position.y + NODE_HEIGHT));

    const width = Math.max(1, Math.ceil(maxX - minX + PADDING * 2));
    const height = Math.max(1, Math.ceil(maxY - minY + PADDING * 2));

    const canvas = document.createElement('canvas');
    canvas.width = width * SCALE;
    canvas.height = height * SCALE;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not create canvas context');
    }

    ctx.scale(SCALE, SCALE);
    ctx.clearRect(0, 0, width, height);

    const toCanvasX = (x: number) => x - minX + PADDING;
    const toCanvasY = (y: number) => y - minY + PADDING;

    const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    const wrapText = (text: string, x: number, y: number, maxWidth: number, maxLines: number) => {
      const words = text.split(' ');
      let line = '';
      let lineCount = 0;

      for (let i = 0; i < words.length; i += 1) {
        const testLine = `${line}${words[i]} `;
        if (ctx.measureText(testLine).width > maxWidth && line) {
          ctx.fillText(line.trim(), x, y + lineCount * 16);
          line = `${words[i]} `;
          lineCount += 1;
          if (lineCount >= maxLines - 1) break;
        } else {
          line = testLine;
        }
      }

      if (lineCount < maxLines) {
        ctx.fillText(line.trim(), x, y + lineCount * 16);
      }
    };

    edges.forEach((edge) => {
      const source = nodes.find((node) => node.id === edge.source);
      const target = nodes.find((node) => node.id === edge.target);
      if (!source || !target) return;

      const x1 = toCanvasX(source.position.x + NODE_WIDTH);
      const y1 = toCanvasY(source.position.y + NODE_HEIGHT / 2);
      const x2 = toCanvasX(target.position.x);
      const y2 = toCanvasY(target.position.y + NODE_HEIGHT / 2);
      const cpOffset = Math.max(60, Math.abs(x2 - x1) * 0.3);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(x1 + cpOffset, y1, x2 - cpOffset, y2, x2, y2);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
    });

    nodes.forEach((node) => {
      const x = toCanvasX(node.position.x);
      const y = toCanvasY(node.position.y);

      drawRoundedRect(x, y, NODE_WIDTH, NODE_HEIGHT, 12);
      ctx.fillStyle = node.data.color || '#e0f2fe';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#cbd5e1';
      ctx.stroke();

      const isCompleted = node.data.status === 'completed';
      ctx.beginPath();
      ctx.arc(x + 20, y + 20, 6, 0, Math.PI * 2);
      ctx.fillStyle = isCompleted ? '#16a34a' : '#9ca3af';
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = '600 15px Inter, system-ui, sans-serif';
      wrapText(node.data.title, x + 34, y + 24, NODE_WIDTH - 48, 2);

      ctx.fillStyle = '#475569';
      ctx.font = '400 13px Inter, system-ui, sans-serif';
      wrapText(node.data.description, x + 16, y + 52, NODE_WIDTH - 32, 4);
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `milestone-flow-${new Date().toISOString().split('T')[0]}.png`;
    link.click();
  }, [nodes, edges]);

  useImperativeHandle(
    ref,
    () => ({
      exportAsPNG,
    }),
    [exportAsPNG]
  );

  return (
    <div className="flex h-full w-full bg-gradient-to-br from-blue-50 to-indigo-50">
      <div id="milestone-canvas-export" className="flex-1 relative">
        {/* Undo/Redo Toolbar */}
        <div
          className="absolute top-4 left-4 z-50 flex gap-2 bg-white rounded-lg shadow-md p-2 border border-gray-200"
          data-export-exclude
        >
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
});
