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
  lineColor?: string;
}

export default function TimelineDisplay({
  steps,
  primaryColor = '#1e40af',
  lineColor = '#1e40af',
}: TimelineDisplayProps) {
  if (steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No steps added yet
      </div>
    );
  }

  return (
    <div className="w-full py-12 px-6 bg-background" style={{ backgroundColor: '#ffffff' }}>
      <div className="relative max-w-6xl mx-auto">
        {/* Main timeline line */}
        <div
          className="absolute top-12 left-0 right-0 h-1"
          style={{
            backgroundColor: lineColor,
          }}
        />

        {/* Steps container */}
        <div className="relative space-y-0">
          {steps.map((step, index) => {
            const isAbove = index % 2 === 0;
            const isCompleted = step.status === 'completed';

            return (
              <div
                key={step.id}
                className={`flex ${isAbove ? 'flex-col' : 'flex-col-reverse'} items-center mb-16`}
              >
                {/* Box content */}
                <div
                  className={`w-48 rounded-lg border-2 p-4 text-center ${
                    isCompleted
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50'
                  } ${isAbove ? 'mb-6' : 'mt-6'}`}
                  style={{
                    borderColor: isCompleted ? '#22c55e' : '#d1d5db',
                    backgroundColor: isCompleted ? '#f0fdf4' : '#f9fafb',
                  }}
                >
                  <h3
                    className="font-bold text-sm mb-2"
                    style={{ color: lineColor }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-600">{step.description}</p>
                </div>

                {/* Status indicator and vertical line */}
                <div className="flex flex-col items-center">
                  {/* Vertical connector line */}
                  <div
                    className="w-1 h-6"
                    style={{
                      backgroundColor: lineColor,
                    }}
                  />

                  {/* Circle indicator */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center border-4 z-10 bg-white"
                    style={{
                      borderColor: lineColor,
                    }}
                  >
                    {isCompleted ? (
                      <Check
                        size={20}
                        style={{ color: lineColor }}
                        strokeWidth={3}
                      />
                    ) : (
                      <Clock
                        size={20}
                        style={{ color: '#9ca3af' }}
                      />
                    )}
                  </div>

                  {/* Vertical connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className="w-1"
                      style={{
                        height: '4rem',
                        backgroundColor: lineColor,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
