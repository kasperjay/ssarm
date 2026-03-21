'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export function RefreshInboxButton({ totalCount }: { totalCount: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      const currentSkip = parseInt(searchParams.get('skip') || '0', 10);
      let nextSkip = currentSkip + 3;
      if (nextSkip >= totalCount) {
        nextSkip = 0;
      }
      router.push(`/?skip=${nextSkip}`);
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isPending}
      className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent/70 hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Refresh Inbox"
    >
      <span className={`inline-block transition-transform duration-500 ${isPending ? 'animate-spin opacity-50' : 'group-hover:rotate-180'}`}>
        ↻
      </span>
      {isPending ? 'Refreshing...' : 'Refresh'}
    </button>
  );
}
