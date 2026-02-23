import React from 'react';
import { cn } from '../utils/cn'; // Need to create this utility or use clsx directly

interface SystemWindowProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  type?: 'blue' | 'red' | 'green' | 'gold';
}

export function SystemWindow({ children, className, title, type = 'blue' }: SystemWindowProps) {
  const borderColors = {
    blue: 'border-primary/50 shadow-glow-blue',
    red: 'border-accent/50 shadow-glow-red',
    green: 'border-system-success/50 shadow-[0_0_10px_rgba(0,255,157,0.5)]',
    gold: 'border-system-warning/50 shadow-[0_0_10px_rgba(255,215,0,0.5)]',
  };

  const textColors = {
    blue: 'text-primary',
    red: 'text-accent',
    green: 'text-system-success',
    gold: 'text-system-warning',
  };

  return (
    <div className={cn(
      "bg-surface/90 backdrop-blur-sm border rounded-lg p-6 animate-window-open relative overflow-hidden",
      borderColors[type],
      className
    )}>
      {title && (
        <div className={cn("absolute top-0 left-0 px-4 py-1 text-xs font-system font-bold tracking-widest bg-background/50 border-b border-r rounded-br-lg", borderColors[type].split(' ')[0], textColors[type])}>
          {title.toUpperCase()}
        </div>
      )}
      {children}
    </div>
  );
}
