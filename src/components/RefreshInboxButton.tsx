'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function RefreshInboxButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/70 hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Refresh Inbox"
    >
      <span className={`inline-block transition-transform duration-500 ${isRefreshing ? 'rotate-180 opacity-50' : 'group-hover:rotate-180'}`}>
        ↻
      </span>
      {isRefreshing ? 'Refreshing...' : 'Refresh'}
    </button>
  );
}
