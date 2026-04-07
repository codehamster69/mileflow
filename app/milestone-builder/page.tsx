'use client';

import { useState } from 'react';
import { MilestoneCanvas, type MilestoneCanvasHandle } from '@/components/milestone-canvas';
import { Download, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GitHubStarButton } from '@/components/github-star-button';
import { useRef } from 'react';

export default function MilestoneBuilderPage() {
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<MilestoneCanvasHandle>(null);

  const handleExportPNG = async () => {
    try {
      setIsExporting(true);
      if (!canvasRef.current) {
        alert('Canvas not ready yet. Please try again.');
        return;
      }
      await canvasRef.current.exportAsPNG();
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
      <div className="min-h-16 border-b border-gray-200 bg-white px-3 md:px-6 py-2 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home size={18} />
              Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/icon.svg" alt="MileFlow logo" className="h-7 w-7" />
            <h1 className="text-lg md:text-xl font-bold text-gray-900">MileFlow</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
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
        <MilestoneCanvas ref={canvasRef} />
      </div>

      {/* Help Text */}
      <div className="hidden lg:block absolute bottom-4 left-4 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 max-w-xs z-10">
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
          <li>• Press F to focus the flow when lost</li>
        </ul>
      </div>
    </div>
  );
}
