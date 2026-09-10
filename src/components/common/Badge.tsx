import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple';
  children: React.ReactNode;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  size = 'md',
  dot = false,
  className = ''
}) => {
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs font-medium' 
    : 'px-2.5 py-1 text-xs font-medium tracking-wide';

  const variantStyles = {
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/25',
    error: 'bg-rose-500/10 text-rose-400 border border-rose-500/25',
    info: 'bg-sky-500/10 text-sky-400 border border-sky-500/25',
    purple: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/25',
    neutral: 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
  };

  const dotColors = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    error: 'bg-rose-400',
    info: 'bg-sky-400',
    purple: 'bg-indigo-400',
    neutral: 'bg-slate-400'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse`} />
      )}
      {children}
    </span>
  );
};
