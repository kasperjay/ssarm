import React from 'react';

interface StatusPillProps {
    status: string;
    className?: string;
}

export function StatusPill({ status, className = '' }: StatusPillProps) {
    const s = status.toUpperCase();

    const getColors = () => {
        switch (s) {
            case 'NEW': return 'text-accent border-accent/20 bg-accent/10';
            case 'QUALIFIED': return 'text-success border-success/20 bg-success/10';
            case 'FOLLOW_UP': return 'text-warning border-warning/20 bg-warning/10';
            case 'CONTACTED': return 'text-cyan-400 border-cyan-400/20 bg-cyan-400/10';
            case 'WON': return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10';
            case 'LOST': return 'text-error border-error/20 bg-error/10';
            case 'ARCHIVED': return 'text-muted border-white/10 bg-white/5';
            default: return 'text-foreground border-white/10 bg-white/5';
        }
    };

    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${getColors()} ${className}`}>
            <span className="mr-1.5 h-1 w-1 rounded-full bg-current animate-pulse" />
            {status.replace(/_/g, ' ')}
        </span>
    );
}
