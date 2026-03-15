'use client';

import { useTransition } from 'react';
import { clearAllDrafts } from '@/app/actions';

export function ClearDraftsButton({ count }: { count: number }) {
  const [isPending, startTransition] = useTransition();

  const handleClear = () => {
    if (window.confirm("Are you sure you want to delete all unsent drafts?")) {
      startTransition(async () => {
        await clearAllDrafts();
      });
    }
  };

  if (count === 0) return null;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleClear();
      }}
      disabled={isPending}
      className={`text-[9px] font-bold uppercase tracking-widest text-muted hover:text-rose-500 transition-colors z-10 relative ${
        isPending ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title="Clear all drafts"
    >
      {isPending ? 'Clearing...' : '[ Clear ]'}
    </button>
  );
}
