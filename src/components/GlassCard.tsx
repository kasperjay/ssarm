import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'strong';
}

export function GlassCard({ children, className = '', variant = 'default' }: GlassCardProps) {
    const baseClass = variant === 'strong' ? 'glass-strong' : 'glass';
    return (
        <div className={`${baseClass} rounded-3xl p-6 shadow-2xl transition-all duration-300 ${className}`}>
            {children}
        </div>
    );
}
