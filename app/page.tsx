import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GitHubStarButton } from '@/components/github-star-button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="h-16 border-b border-blue-100 bg-white/80 backdrop-blur-sm px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/icon.svg" alt="MileFlow logo" className="h-8 w-8" />
          <span className="text-lg font-bold text-primary">MileFlow</span>
        </div>
        <GitHubStarButton />
      </header>

      <div className="max-w-4xl mx-auto px-6 py-14 text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-primary">MileFlow</h1>
          <p className="text-xl text-muted-foreground">
            Create professional milestone flow diagrams with an interactive canvas. Customize, visualize, and export as PNG.
          </p>
        </div>

        <Link href="/milestone-builder" className="max-w-2xl mx-auto w-full">
          <div className="p-8 bg-white rounded-2xl border border-border shadow-lg hover:shadow-xl transition-all cursor-pointer h-full group">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold mb-2 text-primary group-hover:text-blue-600">Milestone Flow Diagram</h3>
            <p className="text-gray-600 mb-4">Interactive canvas with zoom, pan, drag, undo/redo, and full customization. Export as PNG.</p>
            <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
              Get Started <ArrowRight size={20} />
            </div>
          </div>
        </Link>

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

        <p className="text-sm text-muted-foreground">
          Credits: Built and maintained by{' '}
          <a href="https://github.com/codehamster69" target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">
            @codehamster69
          </a>
          .
        </p>
      </div>
    </div>
  );
}
