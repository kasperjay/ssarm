import React from 'react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'cyan' | 'purple' | 'rose' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

export function NeonButton({
    children,
    variant = 'cyan',
    size = 'md',
    className = '',
    ...props
}: NeonButtonProps) {
    const sizeClasses = {
        sm: 'px-4 py-1.5 text-xs',
        md: 'px-6 py-2.5 text-sm',
        lg: 'px-8 py-3.5 text-base',
    };

    const variantClasses = {
        cyan: 'bg-accent text-black hover:bg-highlight neon-glow border-none',
        purple: 'bg-accent-secondary text-white hover:opacity-90 neon-glow-purple border-none',
        rose: 'bg-accent-warm text-white hover:opacity-90 shadow-[0_0_15px_-3px_var(--accent-warm)] border-none',
        outline: 'bg-transparent border border-accent/40 text-accent hover:bg-accent/10',
    };

    return (
        <button
            className={`relative inline-flex items-center justify-center rounded-full font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
