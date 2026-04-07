'use client';

import { useState } from 'react';
import { MilestoneCanvas } from '@/components/milestone-canvas';
import html2canvas from 'html2canvas';
import { Download, Home, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GitHubStarButton } from '@/components/github-star-button';

export default function MilestoneBuilderPage() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPNG = async () => {
    try {
      setIsExporting(true);
      const canvas = document.getElementById('milestone-canvas-export') as HTMLElement | null;

      if (!canvas) {
        alert('Canvas not found');
        return;
      }

      const controls = canvas.querySelectorAll(
        '.react-flow__controls, .react-flow__minimap, .react-flow__panel, .react-flow__attribution'
      );
      controls.forEach((el) => ((el as HTMLElement).style.visibility = 'hidden'));
      try {
        const image = await html2canvas(canvas, {
          backgroundColor: '#f0f9ff',
          scale: 2,
          logging: false,
          useCORS: true,
          onclone: (doc) => {
            doc
              .querySelectorAll(
                '.react-flow__controls, .react-flow__minimap, .react-flow__panel, .react-flow__attribution'
              )
              .forEach((el) => {
                (el as HTMLElement).style.display = 'none';
              });
          },
        });

        const link = document.createElement('a');
        link.href = image.toDataURL('image/png');
        link.download = `milestone-flow-${new Date().toISOString().split('T')[0]}.png`;
        link.click();
      } finally {
        controls.forEach((el) => ((el as HTMLElement).style.visibility = 'visible'));
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Toolbar */}
      <div className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home size={18} />
              Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/icon.svg" alt="MileFlow logo" className="h-7 w-7" />
            <h1 className="text-xl font-bold text-gray-900">MileFlow</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GitHubStarButton className="rounded-md" />
          <Button
            onClick={handleExportPNG}
            disabled={isExporting}
            variant="default"
            className="gap-2"
          >
            <Download size={18} />
            {isExporting ? 'Exporting...' : 'Export as PNG'}
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-hidden">
        <MilestoneCanvas />
      </div>

      {/* Help Text */}
      <div className="absolute bottom-4 left-4 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 max-w-xs">
        <p className="text-xs text-gray-500 mb-1">
          Credits:{' '}
          <a href="https://github.com/codehamster69" target="_blank" rel="noreferrer" className="font-semibold hover:underline">
            @codehamster69
          </a>
        </p>
        <p className="font-semibold text-gray-900 mb-1">Tips:</p>
        <ul className="text-xs space-y-1 text-gray-600">
          <li>• Click milestones to edit them</li>
          <li>• Use hand/pointer tools to switch pan vs drag-select</li>
          <li>• Connect nodes by dragging handles</li>
        </ul>
      </div>
    </div>
  );
}
