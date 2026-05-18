import React from 'react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'lime' | 'purple' | 'fuchsia' | 'amber' | 'pink' | 'outline' | 'ghost'; // Consistently Purple-themed
    size?: 'sm' | 'md' | 'lg';
}

export function NeonButton({
    children,
    variant = 'lime',
    size = 'md',
    className = '',
    ...props
}: NeonButtonProps) {
    const sizeClasses = {
        sm: 'px-4 py-1.5 text-xs',
        md: 'px-6 py-2.5 text-xs',
        lg: 'px-8 py-3.5 text-sm',
    };

    const variantStyles = {
        lime: {
            base: 'bg-surface-strong/80 text-white border-accent neon-glow border-[1px]',
            hover: 'hover:bg-accent hover:text-black hover:scale-[1.02]'
        },
        purple: {
            base: 'bg-surface-strong/80 text-white border-accent-secondary neon-glow-purple border-[1px]',
            hover: 'hover:bg-accent-secondary hover:text-black hover:scale-[1.02]'
        },
        fuchsia: {
            base: 'bg-surface-strong/80 text-white border-accent-warm neon-glow-pink border-[1px]',
            hover: 'hover:bg-accent-warm hover:text-black hover:scale-[1.02]'
        },
        amber: {
            base: 'bg-surface-strong/80 text-white border-warning neon-glow border-[1px]',
            hover: 'hover:bg-warning hover:text-black hover:scale-[1.02]'
        },
        pink: {
            base: 'bg-surface-strong/80 text-white border-accent-warm neon-glow-pink border-[1px]',
            hover: 'hover:bg-accent-warm hover:text-black hover:scale-[1.02]'
        },
        outline: {
            base: 'bg-transparent border border-white/10 text-white/70',
            hover: 'hover:border-white/20 hover:text-white hover:bg-white/5'
        },
        ghost: {
            base: 'bg-transparent border-none text-white/50',
            hover: 'hover:text-white hover:bg-white/5'
        }
    };

    const currentVariant = variantStyles[variant as keyof typeof variantStyles] || variantStyles.lime;

    return (
        <button
            className={`relative inline-flex items-center justify-center rounded-full font-bold uppercase tracking-[0.2em] transition-all duration-300 active:scale(0.98) disabled:opacity-50 disabled:pointer-events-none ${sizeClasses[size]} ${currentVariant.base} ${currentVariant.hover} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
