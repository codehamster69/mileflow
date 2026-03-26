'use client';

import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'in-progress' | 'pending';
  subtitle?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  variant?: 'vertical' | 'horizontal';
  activeColor?: string;
  completedColor?: string;
  pendingColor?: string;
  showProgress?: boolean;
  progressLabel?: string;
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  (
    {
      items,
      variant = 'horizontal',
      activeColor = 'bg-blue-500',
      completedColor = 'bg-emerald-500',
      pendingColor = 'bg-gray-300',
      showProgress = true,
      progressLabel = true,
    },
    ref
  ) => {
    const completedCount = items.filter(
      (item) => item.status === 'completed'
    ).length;
    const progressPercentage = Math.round(
      (completedCount / items.length) * 100
    );

    const getStatusStyles = (status: string) => {
      switch (status) {
        case 'completed':
          return `${completedColor} text-white`;
        case 'in-progress':
          return `${activeColor} text-white`;
        case 'pending':
          return `${pendingColor} text-gray-600`;
        default:
          return pendingColor;
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'completed':
          return <CheckCircle2 className="w-5 h-5" />;
        case 'in-progress':
          return <Clock className="w-5 h-5 animate-pulse" />;
        case 'pending':
          return <Circle className="w-5 h-5" />;
        default:
          return <Circle className="w-5 h-5" />;
      }
    };

    if (variant === 'vertical') {
      return (
        <div ref={ref} className="w-full max-w-2xl mx-auto">
          {/* Progress Bar */}
          {showProgress && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  Progress
                </h3>
                {progressLabel && (
                  <span className="text-xs font-medium text-gray-600">
                    {completedCount} of {items.length} completed
                  </span>
                )}
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${completedColor} rounded-full transition-all duration-500`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Timeline Items */}
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={item.id} className="flex gap-4">
                {/* Timeline Node */}
                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-full p-1.5 ${getStatusStyles(
                      item.status
                    )}`}
                  >
                    {getStatusIcon(item.status)}
                  </div>
                  {index !== items.length - 1 && (
                    <div className="w-1 h-16 bg-gray-200 mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="pt-1 pb-6">
                  <h4 className="font-semibold text-gray-900">
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="text-sm text-gray-600 mt-1">
                      {item.subtitle}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Horizontal Timeline
    return (
      <div ref={ref} className="w-full">
        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Progress</h3>
              {progressLabel && (
                <span className="text-xs font-medium text-gray-600">
                  {completedCount} of {items.length} completed
                </span>
              )}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${completedColor} rounded-full transition-all duration-500`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200">
            <div
              className={`h-full ${completedColor} transition-all duration-500`}
              style={{
                width: `${(completedCount / (items.length - 1 || 1)) * 100}%`,
              }}
            />
          </div>

          {/* Timeline Items */}
          <div className="grid grid-cols-auto-fit gap-4">
            <style>{`
              .grid-cols-auto-fit {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(max(200px, 100%/${items.length}), 1fr));
                gap: 1rem;
              }
            `}</style>
            {items.map((item) => (
              <div key={item.id} className="flex flex-col items-center">
                {/* Timeline Node */}
                <div className="relative z-10 mb-4">
                  <div
                    className={`rounded-full p-2 ${getStatusStyles(
                      item.status
                    )} border-4 border-white shadow-sm`}
                  >
                    {getStatusIcon(item.status)}
                  </div>
                </div>

                {/* Content Box */}
                <div
                  className={`w-full p-4 rounded-lg border text-center transition-all ${
                    item.status === 'completed'
                      ? 'bg-emerald-50 border-emerald-200'
                      : item.status === 'in-progress'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <h4 className="font-semibold text-sm text-gray-900">
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="text-xs text-gray-600 mt-1">
                      {item.subtitle}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

Timeline.displayName = 'Timeline';

export default Timeline;
