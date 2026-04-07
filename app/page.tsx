import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-primary">Diagram Builder</h1>
          <p className="text-xl text-muted-foreground">
            Create professional milestone flow diagrams with an interactive canvas. Customize, visualize, and export as PNG.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Timeline Builder Card */}
          <Link href="/timeline-builder">
            <div className="p-8 bg-white rounded-2xl border border-border shadow-lg hover:shadow-xl transition-all cursor-pointer h-full group">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-2xl font-bold mb-2 text-primary group-hover:text-blue-600">Timeline Builder</h3>
              <p className="text-gray-600 mb-4">Create beautiful project timelines with steps and progress tracking</p>
              <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                Launch <ArrowRight size={20} />
              </div>
            </div>
          </Link>

          {/* Milestone Flow Card */}
          <Link href="/milestone-builder">
            <div className="p-8 bg-white rounded-2xl border border-border shadow-lg hover:shadow-xl transition-all cursor-pointer h-full group">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-2 text-primary group-hover:text-blue-600">Milestone Flow</h3>
              <p className="text-gray-600 mb-4">Interactive canvas with zoom, pan, drag, and full customization</p>
              <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                Launch <ArrowRight size={20} />
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="p-6 bg-white rounded-lg border border-border shadow-sm">
            <div className="text-4xl mb-2">✏️</div>
            <h3 className="font-semibold mb-2">Easy Editing</h3>
            <p className="text-sm text-muted-foreground">
              Customize titles, descriptions, colors, and status for each step
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-border shadow-sm">
            <div className="text-4xl mb-2">🎨</div>
            <h3 className="font-semibold mb-2">Full Control</h3>
            <p className="text-sm text-muted-foreground">
              Zoom, pan, drag nodes around, and create connections visually
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-border shadow-sm">
            <div className="text-4xl mb-2">💾</div>
            <h3 className="font-semibold mb-2">Export</h3>
            <p className="text-sm text-muted-foreground">
              Download your diagrams as high-quality PNG images
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
