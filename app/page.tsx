'use client';

import React, { useState } from 'react';
import Timeline, { TimelineItem } from '@/components/timeline';

const researchTimeline: TimelineItem[] = [
  {
    id: '1',
    title: 'Literature Review & Background Study',
    subtitle: 'Phase 1',
    description: 'Comprehensive review of existing research and foundational work',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Dense Index Build & Integration',
    subtitle: 'Phase 2',
    description: 'Building and integrating dense index structures',
    status: 'completed',
  },
  {
    id: '3',
    title: 'Codebase Design & Lexical Baseline',
    subtitle: 'Phase 3',
    description: 'Establishing baseline architecture and design patterns',
    status: 'completed',
  },
  {
    id: '4',
    title: 'Hybrid Pipeline & End-to-End Validation',
    subtitle: 'Phase 4',
    description: 'Testing and validation of complete pipeline',
    status: 'in-progress',
  },
  {
    id: '5',
    title: 'Ablation Study & Fusion Tuning',
    subtitle: 'Phase 5',
    description: 'Fine-tuning model components and studying impact',
    status: 'pending',
  },
  {
    id: '6',
    title: 'Humor Classifier Fine-tuning',
    subtitle: 'Phase 6',
    description: 'Training and optimization of classifier models',
    status: 'pending',
  },
  {
    id: '7',
    title: 'Report Writing & Submission',
    subtitle: 'Phase 7',
    description: 'Documentation and final report preparation',
    status: 'pending',
  },
];

const productTimeline: TimelineItem[] = [
  {
    id: 'p1',
    title: 'Market Research',
    description: 'Analyze competitor offerings and market trends',
    status: 'completed',
  },
  {
    id: 'p2',
    title: 'Product Design',
    description: 'Create wireframes and design mockups',
    status: 'completed',
  },
  {
    id: 'p3',
    title: 'Development Sprint 1',
    description: 'Build core features and backend API',
    status: 'in-progress',
  },
  {
    id: 'p4',
    title: 'QA Testing',
    description: 'Quality assurance and bug fixing',
    status: 'pending',
  },
  {
    id: 'p5',
    title: 'Launch',
    description: 'Go live and monitor performance',
    status: 'pending',
  },
];

const eventTimeline: TimelineItem[] = [
  {
    id: 'e1',
    title: 'Early Bird Registration Opens',
    description: 'First 50 attendees get 30% discount',
    status: 'completed',
  },
  {
    id: 'e2',
    title: 'Speaker Confirmation',
    description: 'All keynote speakers confirmed',
    status: 'completed',
  },
  {
    id: 'e3',
    title: 'Sponsorship Drive',
    description: 'Launch sponsorship packages',
    status: 'in-progress',
  },
  {
    id: 'e4',
    title: 'Marketing Campaign',
    description: 'Social media and email marketing begins',
    status: 'pending',
  },
  {
    id: 'e5',
    title: 'Event Day',
    description: 'Main conference event',
    status: 'pending',
  },
];

export default function TimelineDemo() {
  const [activeTab, setActiveTab] = useState<'research' | 'product' | 'event' | 'vertical'>(
    'research'
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900">Timeline Component</h1>
          <p className="text-gray-600 mt-2">
            Customizable timeline for any project or workflow
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {[
            { id: 'research', label: 'Research Project' },
            { id: 'product', label: 'Product Launch' },
            { id: 'event', label: 'Event Planning' },
            { id: 'vertical', label: 'Vertical Timeline' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-4 font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Timeline Displays */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {activeTab === 'research' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Research Project Timeline
              </h2>
              <Timeline
                items={researchTimeline}
                variant="horizontal"
                completedColor="bg-blue-600"
                activeColor="bg-blue-500"
              />
            </div>
          )}

          {activeTab === 'product' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Product Launch Timeline
              </h2>
              <Timeline
                items={productTimeline}
                variant="horizontal"
                completedColor="bg-emerald-600"
                activeColor="bg-emerald-500"
              />
            </div>
          )}

          {activeTab === 'event' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Event Planning Timeline
              </h2>
              <Timeline
                items={eventTimeline}
                variant="horizontal"
                completedColor="bg-purple-600"
                activeColor="bg-purple-500"
              />
            </div>
          )}

          {activeTab === 'vertical' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Vertical Timeline Layout
              </h2>
              <Timeline
                items={productTimeline}
                variant="vertical"
                completedColor="bg-indigo-600"
                activeColor="bg-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 text-xl">✓</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Fully Customizable
            </h3>
            <p className="text-sm text-gray-600">
              Customize colors, layouts, and styles to match your brand
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-emerald-600 text-xl">◐</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Progress Tracking
            </h3>
            <p className="text-sm text-gray-600">
              Automatic progress calculation with visual indicators
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 text-xl">⇄</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Multiple Layouts
            </h3>
            <p className="text-sm text-gray-600">
              Support for horizontal and vertical timeline layouts
            </p>
          </div>
        </div>

        {/* Usage Guide */}
        <div className="mt-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Start Guide
          </h2>
          <div className="bg-white rounded-lg p-6 font-mono text-sm">
            <pre className="overflow-x-auto text-gray-700">
{`import Timeline from '@/components/timeline';

const items = [
  {
    id: '1',
    title: 'First Phase',
    description: 'Phase description',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Second Phase',
    description: 'Phase description',
    status: 'in-progress',
  },
];

export default function App() {
  return (
    <Timeline
      items={items}
      variant="horizontal"
      completedColor="bg-blue-600"
      activeColor="bg-blue-500"
      showProgress={true}
    />
  );
}`}
            </pre>
          </div>
        </div>

        {/* Props Documentation */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Component Props
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Prop
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Default
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    prop: 'items',
                    type: 'TimelineItem[]',
                    default: 'required',
                    desc: 'Array of timeline items to display',
                  },
                  {
                    prop: 'variant',
                    type: 'horizontal | vertical',
                    default: 'horizontal',
                    desc: 'Timeline layout direction',
                  },
                  {
                    prop: 'completedColor',
                    type: 'string',
                    default: 'bg-emerald-500',
                    desc: 'Color for completed items',
                  },
                  {
                    prop: 'activeColor',
                    type: 'string',
                    default: 'bg-blue-500',
                    desc: 'Color for in-progress items',
                  },
                  {
                    prop: 'pendingColor',
                    type: 'string',
                    default: 'bg-gray-300',
                    desc: 'Color for pending items',
                  },
                  {
                    prop: 'showProgress',
                    type: 'boolean',
                    default: 'true',
                    desc: 'Show progress bar and counter',
                  },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className="border border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-3 text-sm font-mono text-blue-600">
                      {row.prop}
                    </td>
                    <td className="px-6 py-3 text-sm font-mono text-gray-600">
                      {row.type}
                    </td>
                    <td className="px-6 py-3 text-sm font-mono text-gray-600">
                      {row.default}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {row.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
