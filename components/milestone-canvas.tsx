'use client';

import { useCallback, useState, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Background,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { MilestoneNode, type MilestoneData } from './milestone-node';
import { MilestoneEditorPanel } from './milestone-editor-panel';

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
  const [selectedNode, setSelectedNode] = useState<Node<MilestoneData> | null>(null);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (_: any, node: Node<MilestoneData>) => {
      setSelectedNode(node);
    },
    []
  );

  const handleUpdateNode = useCallback(
    (updatedNode: Node<MilestoneData>) => {
      setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
      setSelectedNode(updatedNode);
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
    setSelectedNode(newNode);
  }, [nodes, setNodes]);

  const handleDeleteNode = useCallback(() => {
    if (!selectedNode) return;

    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id)
    );
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="flex h-full w-full bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex-1">
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            type: 'milestone',
            selected: selectedNode?.id === node.id,
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      <MilestoneEditorPanel
        selectedNode={selectedNode}
        onUpdateNode={handleUpdateNode}
        onAddNode={handleAddNode}
        onDeleteNode={handleDeleteNode}
      />
    </div>
  );
}
