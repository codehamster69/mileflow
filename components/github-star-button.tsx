import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

type GitHubStarButtonProps = {
  className?: string;
};

export function GitHubStarButton({ className }: GitHubStarButtonProps) {
  const [starCount, setStarCount] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadStarCount = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/codehamster69/mileflow-xe', {
          headers: { Accept: 'application/vnd.github+json' },
        });
        if (!response.ok) return;
        const repo = await response.json();
        if (!ignore && typeof repo?.stargazers_count === 'number') {
          setStarCount(repo.stargazers_count);
        }
      } catch {
        // Silent fallback: button remains visible without count.
      }
    };

    loadStarCount();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <a
      href="https://github.com/codehamster69/mileflow-xe"
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50 ${className ?? ''}`}
      aria-label="Star codehamster69/mileflow-xe on GitHub"
    >
      <Star size={16} className="fill-current" />
      <span>Star</span>
      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs tabular-nums text-gray-700">
        {starCount === null ? '—' : starCount.toLocaleString()}
      </span>
    </a>
  );
}
