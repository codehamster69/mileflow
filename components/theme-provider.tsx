'use client';

import { Check, Clock } from 'lucide-react';

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'pending';
}

interface TimelineDisplayProps {
  steps: TimelineStep[];
  primaryColor?: string;
}

export default function TimelineDisplay({
  steps,
  primaryColor = '#1e40af',
}: TimelineDisplayProps) {
  if (steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No steps added yet
      </div>
    );
  }

  return (
    <div className="w-full py-16 px-6 bg-white">
      <div className="relative max-w-6xl mx-auto">

        {/* Main horizontal line */}
        <div
          className="absolute top-1/2 left-0 right-0 h-1"
          style={{ backgroundColor: '#d1d5db' }}
        />

        {/* Progress line */}
        <div
          className="absolute top-1/2 left-0 h-1"
          style={{
            width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%`,
            backgroundColor: primaryColor,
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between items-center">

          {steps.map((step, index) => {
            const isAbove = index % 2 === 0;
            const isCompleted = step.status === 'completed';

            return (
              <div key={step.id} className="relative flex flex-col items-center w-40">

                {/* Top card */}
                {isAbove && (
                  <div className="mb-6 flex flex-col items-center">
                    <div
                      className="w-1 h-8"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <div className={`p-3 rounded-lg border text-center shadow-sm ${isCompleted ? 'bg-green-50 border-green-400' : 'bg-gray-50 border-gray-300'
                      }`}>
                      <p className="text-sm font-semibold">{step.title}</p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                )}

                {/* Circle node */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center border-4 bg-white z-10"
                  style={{
                    borderColor: isCompleted ? primaryColor : '#9ca3af',
                  }}
                >
                  {isCompleted ? (
                    <Check size={18} style={{ color: primaryColor }} strokeWidth={3} />
                  ) : (
                    <Clock size={18} style={{ color: '#9ca3af' }} />
                  )}
                </div>

                {/* Bottom card */}
                {!isAbove && (
                  <div className="mt-6 flex flex-col items-center">
                    <div
                      className="w-1 h-8"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <div className={`p-3 rounded-lg border text-center shadow-sm ${isCompleted ? 'bg-green-50 border-green-400' : 'bg-gray-50 border-gray-300'
                      }`}>
                      <p className="text-sm font-semibold">{step.title}</p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}