'use client';

import { Handle, Position } from 'reactflow';
import { CheckCircle2, Clock } from 'lucide-react';
import type { Node } from 'reactflow';

export interface MilestoneData {
  title: string;
  description: string;
  status: 'completed' | 'pending';
  color: string;
}

interface MilestoneNodeProps {
  data: MilestoneData;
  selected?: boolean;
}

export function MilestoneNode({ data, selected }: MilestoneNodeProps) {
  const isCompleted = data.status === 'completed';
  const statusColor = isCompleted ? '#16a34a' : '#9ca3af';
  const bgOpacity = selected ? 'opacity-100' : 'opacity-90';

  return (
    <div
      className={`relative px-6 py-4 rounded-xl border-2 shadow-lg transition-all cursor-pointer ${bgOpacity}`}
      style={{
        backgroundColor: data.color || '#e0f2fe',
        borderColor: selected ? '#0284c7' : '#bfdbfe',
      }}
    >
      <Handle type="target" position={Position.Left} />

      <div className="flex items-start gap-3 w-64">
        <div className="flex-shrink-0 mt-1">
          {isCompleted ? (
            <CheckCircle2 size={24} color={statusColor} strokeWidth={2.5} fill={statusColor} />
          ) : (
            <Clock size={24} color={statusColor} strokeWidth={2} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 truncate">{data.title}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{data.description}</p>
          <span
            className="inline-block mt-2 px-2 py-1 rounded text-xs font-semibold text-white"
            style={{ backgroundColor: isCompleted ? '#16a34a' : '#9ca3af' }}
          >
            {isCompleted ? 'Completed' : 'Pending'}
          </span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}
