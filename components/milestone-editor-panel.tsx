'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Node } from 'reactflow';
import type { MilestoneData } from './milestone-node';
import { Plus, X } from 'lucide-react';

interface MilestoneEditorPanelProps {
  selectedNode: Node<MilestoneData> | null;
  onUpdateNode: (node: Node<MilestoneData>) => void;
  onAddNode: () => void;
  onDeleteNode: () => void;
  selectedCount: number;
}

const PRESET_COLORS = [
  '#e0f2fe', // light blue
  '#dcfce7', // light green
  '#fef3c7', // light yellow
  '#fecaca', // light red
  '#f3e8ff', // light purple
  '#fce7f3', // light pink
];

export function MilestoneEditorPanel({
  selectedNode,
  onUpdateNode,
  onAddNode,
  onDeleteNode,
  selectedCount,
}: MilestoneEditorPanelProps) {
  const [title, setTitle] = useState(selectedNode?.data.title || '');
  const [description, setDescription] = useState(selectedNode?.data.description || '');
  const [color, setColor] = useState(selectedNode?.data.color || PRESET_COLORS[0]);
  const [status, setStatus] = useState<'completed' | 'pending'>(selectedNode?.data.status || 'pending');

  // Sync state with selectedNode changes
  useEffect(() => {
    if (selectedNode) {
      setTitle(selectedNode.data.title);
      setDescription(selectedNode.data.description);
      setColor(selectedNode.data.color);
      setStatus(selectedNode.data.status);
    } else {
      setTitle('');
      setDescription('');
      setColor(PRESET_COLORS[0]);
      setStatus('pending');
    }
  }, [selectedNode]);

  const handleUpdate = (overrides?: Partial<MilestoneData>) => {
    if (!selectedNode) return;

    onUpdateNode({
      ...selectedNode,
      data: {
        ...selectedNode.data,
        title,
        description,
        color,
        status,
        ...overrides,
      },
    });
  };

  if (!selectedNode) {
    return (
      <div className="w-full lg:w-72 lg:min-w-72 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 p-4 lg:p-6 flex flex-col h-auto lg:h-full max-h-[45vh] lg:max-h-none shadow-sm overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Milestone Editor</h2>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Select a milestone to edit</p>
            {selectedCount > 0 && (
              <Button onClick={onDeleteNode} variant="destructive" className="gap-2 mb-4">
                <X size={18} />
                Delete Selected ({selectedCount})
              </Button>
            )}
            <Button onClick={onAddNode} className="gap-2">
              <Plus size={18} />
              Add Milestone
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-72 lg:min-w-72 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 p-4 lg:p-6 flex flex-col h-auto lg:h-full max-h-[45vh] lg:max-h-none shadow-sm overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Edit Milestone</h2>
        <button
          onClick={onDeleteNode}
          className="p-1 hover:bg-red-50 rounded transition-colors text-red-500"
          title="Delete milestone"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-5 flex-1">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleUpdate}
            placeholder="Milestone title"
            className="w-full"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleUpdate}
            placeholder="Describe this milestone"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setStatus('completed');
                handleUpdate({ status: 'completed' });
              }}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                status === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✓ Completed
            </button>
            <button
              onClick={() => {
                setStatus('pending');
                handleUpdate({ status: 'pending' });
              }}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                status === 'pending'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⏱ Pending
            </button>
          </div>
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Color</label>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => {
                  setColor(presetColor);
                  handleUpdate({ color: presetColor });
                }}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  color === presetColor ? 'border-gray-900 shadow-md' : 'border-gray-300'
                }`}
                style={{ backgroundColor: presetColor }}
                title={`Color ${presetColor}`}
              />
            ))}
          </div>

          {/* Custom Color Input */}
          <div className="mt-3">
            <label className="block text-xs text-gray-600 mb-2">Custom Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                onBlur={handleUpdate}
                className="flex-1 h-10 rounded cursor-pointer border border-gray-300"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                onBlur={handleUpdate}
                placeholder="#e0f2fe"
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <Button onClick={onAddNode} className="w-full gap-2">
          <Plus size={18} />
          Add Milestone
        </Button>
      </div>
    </div>
  );
}
