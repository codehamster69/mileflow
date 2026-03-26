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

  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progressPercentage = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="w-full py-16 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Timeline Container */}
        <div className="relative mb-16">
          {/* Main horizontal line */}
          <div 
            className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2"
            style={{ backgroundColor: lineColor }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0;
              const isCompleted = step.status === 'completed';

              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  {/* Box - alternates above/below */}
                  <div 
                    className={`flex flex-col items-center ${isLeft ? 'mb-8' : 'mt-8'}`}
                  >
                    <div
                      className={`w-44 rounded-lg border-2 p-4 text-center transition-all ${
                        isCompleted
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 bg-gray-50'
                      }`}
                      style={{
                        borderColor: isCompleted ? '#22c55e' : '#d1d5db',
                        backgroundColor: isCompleted ? '#f0fdf4' : '#f9fafb',
                      }}
                    >
                      <h3 
                        className="font-bold text-sm mb-1"
                        style={{ color: lineColor }}
                      >
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Vertical bold connecting line */}
                    <div
                      className="w-1 flex-1"
                      style={{
                        backgroundColor: lineColor,
                        minHeight: '2rem',
                      }}
                    />
                  </div>

                  {/* Step indicator circle on main line */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center border-4 bg-white z-10 flex-shrink-0 transition-all"
                    style={{
                      borderColor: lineColor,
                      boxShadow: `0 0 0 3px white`,
                    }}
                  >
                    {isCompleted ? (
                      <Check
                        size={24}
                        strokeWidth={3}
                        style={{ color: lineColor }}
                      />
                    ) : (
                      <Clock
                        size={24}
                        style={{ color: '#9ca3af' }}
                      />
                    )}
                  </div>

                  {/* Vertical bold connecting line after indicator */}
                  {!isLeft && (
                    <div
                      className="w-1 flex-1"
                      style={{
                        backgroundColor: lineColor,
                        minHeight: '2rem',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-12 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              Progress: {progressPercentage}% complete ({completedCount}/{steps.length} phases)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: lineColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
