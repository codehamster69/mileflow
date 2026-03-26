import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-primary">Timeline Builder</h1>
          <p className="text-xl text-muted-foreground">
            Create beautiful, customizable project timelines and export them as PNG images
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          <div className="p-6 bg-white rounded-lg border border-border shadow-sm">
            <div className="text-3xl mb-2">✏️</div>
            <h3 className="font-semibold mb-2">Easy Editing</h3>
            <p className="text-sm text-muted-foreground">
              Add, edit, and delete timeline steps with a simple form interface
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-border shadow-sm">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-semibold mb-2">Custom Colors</h3>
            <p className="text-sm text-muted-foreground">
              Choose any color for your timeline and status indicators
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-border shadow-sm">
            <div className="text-3xl mb-2">💾</div>
            <h3 className="font-semibold mb-2">Download PNG</h3>
            <p className="text-sm text-muted-foreground">
              Export your timeline as a high-quality PNG image
            </p>
          </div>
        </div>

        <Link href="/timeline-builder">
          <Button size="lg" className="gap-2">
            Get Started
            <ArrowRight size={20} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
