'use client';

import { useEffect, useRef, useState } from 'react';
import TimelineEditor from '@/components/timeline-editor';
import TimelineDisplay, { TimelineStep } from '@/components/timeline-display';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const SAMPLE_STEPS: TimelineStep[] = [
  {
    id: '1',
    title: 'Phase 1',
    description: 'Literature Review & Background Study',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Phase 2',
    description: 'Dense Index Build & Integration',
    status: 'completed',
  },
  {
    id: '3',
    title: 'Phase 3',
    description: 'Codebase Design & Lexical Baseline',
    status: 'completed',
  },
  {
    id: '4',
    title: 'Phase 4',
    description: 'Hybrid Pipeline & End-to-End Validation',
    status: 'pending',
  },
  {
    id: '5',
    title: 'Phase 5',
    description: 'Ablation Study & Fusion Tuning',
    status: 'pending',
  },
  {
    id: '6',
    title: 'Phase 6',
    description: 'Humor Classifier Fine-tuning',
    status: 'pending',
  },
  {
    id: '7',
    title: 'Phase 7',
    description: 'Report Writing & Submission',
    status: 'pending',
  },
];

export default function TimelineBuilderPage() {
  const [steps, setSteps] = useState<TimelineStep[]>(SAMPLE_STEPS);
  const [primaryColor, setPrimaryColor] = useState('#1e40af');
  const [isExporting, setIsExporting] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Try to load html2canvas dynamically
  const exportAsImage = async () => {
    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;

      if (!timelineRef.current) return;

      const canvas = await html2canvas(timelineRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `timeline-${new Date().getTime()}.png`;
      link.click();
    } catch (error) {
      console.error('[v0] Error exporting timeline:', error);
      alert('Error exporting timeline. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-background border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Timeline Builder</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Create and customize timelines, then download as PNG
            </p>
          </div>
          <Button
            onClick={exportAsImage}
            disabled={isExporting || steps.length === 0}
            size="lg"
            className="gap-2"
          >
            <Download size={20} />
            {isExporting ? 'Exporting...' : 'Download as PNG'}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Editor Panel */}
          <div className="lg:col-span-1 bg-card rounded-lg border border-border p-6 h-fit sticky top-24">
            <TimelineEditor
              steps={steps}
              onStepsChange={setSteps}
              primaryColor={primaryColor}
              onPrimaryColorChange={setPrimaryColor}
            />
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-3 bg-white rounded-lg border border-border overflow-hidden shadow-sm">
            <div ref={timelineRef}>
              <TimelineDisplay
                steps={steps}
                primaryColor={primaryColor}
                lineColor={primaryColor}
              />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="font-semibold text-blue-900 mb-3">How to Use</h2>
          <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
            <li>Add steps using the form on the left panel</li>
            <li>Edit titles and descriptions for each step</li>
            <li>Toggle between "Completed" (✓) and "Pending" (⏱) status</li>
            <li>Change the timeline color using the color picker</li>
            <li>Preview your timeline in real-time on the right</li>
            <li>Click "Download as PNG" to save your timeline</li>
            <li>Delete steps using the trash icon</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
