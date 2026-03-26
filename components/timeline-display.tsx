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
  primaryColor = '#16a34a',
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
      <div className="max-w-6xl mx-auto">
        {/* Timeline Container */}
        <div className="relative mb-20">
          {/* Boxes Row - Above timeline */}
          <div className="relative mb-32 flex justify-between gap-4">
            {steps.map((step, index) => {
              const isCompleted = step.status === 'completed';
              const isLeft = index % 2 === 0;

              return (
                <div 
                  key={step.id} 
                  className="flex flex-col items-center flex-1"
                >
                  {/* Box positioned above or below based on index */}
                  {isLeft && (
                    <div
                      className="rounded-2xl border-2 p-4 text-center mb-20 w-full transition-all"
                      style={{
                        borderColor: isCompleted ? primaryColor : '#d1d5db',
                        backgroundColor: isCompleted ? '#f0fdf4' : '#f9fafb',
                      }}
                    >
                      <h3 
                        className="font-bold text-sm mb-2"
                        style={{ color: primaryColor }}
                      >
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Main Timeline Line with Indicators */}
          <div className="relative h-24 flex items-center">
            {/* Horizontal line */}
            <div 
              className="absolute left-0 right-0 h-1 top-1/2 -translate-y-1/2"
              style={{ backgroundColor: primaryColor }}
            />

            {/* Step Indicators */}
            <div className="relative w-full flex justify-between">
              {steps.map((step) => {
                const isCompleted = step.status === 'completed';

                return (
                  <div 
                    key={step.id}
                    className="flex flex-col items-center"
                  >
                    {/* Vertical line from box to indicator */}
                    <div
                      className="absolute w-1 h-20 -top-20"
                      style={{ backgroundColor: primaryColor }}
                    />

                    {/* Indicator Circle */}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center border-4 bg-white z-10 flex-shrink-0 transition-all"
                      style={{
                        borderColor: isCompleted ? primaryColor : '#d1d5db',
                      }}
                    >
                      {isCompleted ? (
                        <Check
                          size={28}
                          strokeWidth={3}
                          style={{ color: primaryColor }}
                        />
                      ) : (
                        <Clock
                          size={28}
                          style={{ color: '#d1d5db' }}
                        />
                      )}
                    </div>

                    {/* Vertical line from indicator to box below */}
                    <div
                      className="absolute w-1 h-20 top-14"
                      style={{ backgroundColor: primaryColor }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Boxes Row - Below timeline */}
          <div className="relative mt-32 flex justify-between gap-4">
            {steps.map((step, index) => {
              const isCompleted = step.status === 'completed';
              const isRight = index % 2 === 1;

              return (
                <div 
                  key={`bottom-${step.id}`}
                  className="flex flex-col items-center flex-1"
                >
                  {/* Box positioned below for alternating steps */}
                  {isRight && (
                    <div
                      className="rounded-2xl border-2 p-4 text-center w-full transition-all"
                      style={{
                        borderColor: isCompleted ? primaryColor : '#d1d5db',
                        backgroundColor: isCompleted ? '#f0fdf4' : '#f9fafb',
                      }}
                    >
                      <h3 
                        className="font-bold text-sm mb-2"
                        style={{ color: primaryColor }}
                      >
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Section */}
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
                backgroundColor: primaryColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
