import React from 'react';

interface StatusPillProps {
    status: string;
    className?: string;
}

export function StatusPill({ status, className = '' }: StatusPillProps) {
    const s = status.toUpperCase();

    const getColors = () => {
        switch (s) {
            case 'NEW': return 'text-accent border-accent/20 bg-accent/5';
            case 'QUALIFIED': return 'text-accent-secondary border-accent-secondary/20 bg-accent-secondary/5';
            case 'FOLLOW_UP': return 'text-accent-warm border-accent-warm/20 bg-accent-warm/5';
            case 'CONTACTED': return 'text-white border-white/20 bg-white/5';
            case 'WON': return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5';
            case 'LOST': return 'text-error border-error/20 bg-error/5';
            case 'ARCHIVED': return 'text-muted border-white/10 bg-white/5';
            default: return 'text-foreground border-white/10 bg-white/5';
        }
    };

    const getLabel = () => {
        switch (s) {
            case 'FOLLOW_UP': return 'Follow Up';
            case 'NEW': return 'New Lead';
            case 'QUALIFIED': return 'Qualified';
            case 'CONTACTED': return 'Contacted';
            case 'WON': return 'Converted';
            case 'LOST': return 'Closed';
            default: return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        }
    };

    return (
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${getColors()} ${className}`}>
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current animate-pulse shadow-[0_0_8px_currentColor]" />
            {getLabel()}
        </span>
    );
}
