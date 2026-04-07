'use client';

import { useState } from 'react';
import { MilestoneCanvas } from '@/components/milestone-canvas';
import html2canvas from 'html2canvas';
import { Download, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MilestoneBuilderPage() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPNG = async () => {
    try {
      setIsExporting(true);
      const canvas = document.querySelector('[style*="flex"]') as HTMLElement;

      if (!canvas) {
        alert('Canvas not found');
        return;
      }

      const image = await html2canvas(canvas, {
        backgroundColor: '#f0f9ff',
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      link.href = image.toDataURL('image/png');
      link.download = `milestone-flow-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
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
          <h1 className="text-xl font-bold text-gray-900">Milestone Flow Diagram</h1>
        </div>

        <div className="flex items-center gap-3">
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
        <p className="font-semibold text-gray-900 mb-1">Tips:</p>
        <ul className="text-xs space-y-1 text-gray-600">
          <li>• Click milestones to edit them</li>
          <li>• Drag to move, scroll to zoom</li>
          <li>• Connect nodes by dragging handles</li>
        </ul>
      </div>
    </div>
  );
}
