"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { TimeframeOption } from "../types";

interface TimeframeSelectorProps {
  currentValue: TimeframeOption;
}

const TIMEFRAME_OPTIONS: { id: TimeframeOption; label: string }[] = [
  { id: "7d", label: "7 Days" },
  { id: "30d", label: "30 Days" },
  { id: "90d", label: "90 Days" },
  { id: "all", label: "All Time" },
];

export function TimeframeSelector({ currentValue }: TimeframeSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSelect = (option: TimeframeOption) => {
    if (option === currentValue) return;

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (option === "30d") {
        params.delete("timeframe");
      } else {
        params.set("timeframe", option);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  return (
    <div
      role="group"
      aria-label="Timeframe filter"
      className="inline-flex items-center gap-1 rounded-2xl bg-white/[0.04] p-1.5 border border-white/[0.08] backdrop-blur-md shadow-inner"
    >
      {TIMEFRAME_OPTIONS.map((opt) => {
        const isActive = opt.id === currentValue;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleSelect(opt.id)}
            disabled={isPending}
            className={`
              relative px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 rounded-xl
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-[#08080c]
              disabled:opacity-60 disabled:cursor-not-allowed
              ${
                isActive
                  ? "bg-accent text-black shadow-[0_0_20px_rgba(0,242,255,0.35)] font-extrabold"
                  : "text-white/60 hover:text-white hover:bg-white/[0.06] active:scale-[0.98]"
              }
            `}
          >
            {opt.label}
          </button>
        );
      })}

      {isPending && (
        <span
          className="ml-2 mr-1 h-3.5 w-3.5 animate-spin rounded-full border-2 border-accent border-t-transparent"
          aria-label="Loading metrics"
        />
      )}
    </div>
  );
}
