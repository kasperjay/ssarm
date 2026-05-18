import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'strong';
}

export function GlassCard({ children, className = '', variant = 'default' }: GlassCardProps) {
    const baseClass = variant === 'strong' ? 'glass-strong' : 'glass';
    return (
        <div className={`
            ${baseClass} 
            rounded-[48px] 
            p-8 
            shadow-[0_20px_50px_rgba(0,0,0,0.3)] 
            transition-all duration-700 
            hover:shadow-[0_30px_70px_rgba(0,0,0,0.5)] 
            hover:border-white/20 
            ${className}
        `}>
            {children}
        </div>
    );
}
