'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import { TimelineStep } from './timeline-display';

interface TimelineEditorProps {
  steps: TimelineStep[];
  onStepsChange: (steps: TimelineStep[]) => void;
  primaryColor: string;
  onPrimaryColorChange: (color: string) => void;
}

export default function TimelineEditor({
  steps,
  onStepsChange,
  primaryColor,
  onPrimaryColorChange,
}: TimelineEditorProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const addStep = () => {
    if (!newTitle.trim()) return;

    const newStep: TimelineStep = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      status: 'pending',
    };

    onStepsChange([...steps, newStep]);
    setNewTitle('');
    setNewDescription('');
  };

  const removeStep = (id: string) => {
    onStepsChange(steps.filter((step) => step.id !== id));
  };

  const toggleStatus = (id: string) => {
    onStepsChange(
      steps.map((step) =>
        step.id === id
          ? {
              ...step,
              status: step.status === 'completed' ? 'pending' : 'completed',
            }
          : step
      )
    );
  };

  const updateStep = (
    id: string,
    field: 'title' | 'description',
    value: string
  ) => {
    onStepsChange(
      steps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Color Picker */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Timeline Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => onPrimaryColorChange(e.target.value)}
            className="w-12 h-12 rounded cursor-pointer border border-border"
          />
          <span className="text-sm text-muted-foreground">{primaryColor}</span>
        </div>
      </div>

      {/* Existing Steps */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Steps ({steps.length})</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {steps.map((step) => (
            <div
              key={step.id}
              className="p-3 border border-border rounded-lg space-y-2 bg-card"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                  placeholder="Step title"
                  className="flex-1 px-2 py-1 text-sm border border-input rounded bg-background"
                />
                <button
                  onClick={() => toggleStatus(step.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                    step.status === 'completed'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {step.status === 'completed' ? '✓ Done' : '⏱ Pending'}
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStep(step.id)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              <textarea
                value={step.description}
                onChange={(e) =>
                  updateStep(step.id, 'description', e.target.value)
                }
                placeholder="Step description"
                className="w-full px-2 py-1 text-xs border border-input rounded bg-background resize-none"
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Add New Step */}
      <div className="space-y-2 border-t pt-4">
        <h3 className="font-semibold text-sm">Add New Step</h3>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addStep()}
          placeholder="Step title"
          className="w-full px-3 py-2 text-sm border border-input rounded bg-background"
        />
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Step description"
          className="w-full px-3 py-2 text-sm border border-input rounded bg-background resize-none"
          rows={2}
        />
        <Button
          onClick={addStep}
          className="w-full"
          variant="default"
        >
          <Plus size={16} className="mr-2" />
          Add Step
        </Button>
      </div>
    </div>
  );
}
