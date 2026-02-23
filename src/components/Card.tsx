import React from 'react';
import { cn } from '../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, onClick, ...props }: CardProps) {
  return (
    <div 
      onClick={onClick}
      {...props}
      className={cn(
        "bg-surface border border-white/5 rounded-2xl p-5 shadow-sm transition-all",
        onClick && "cursor-pointer active:scale-95 hover:bg-surfaceHighlight",
        className
      )}
    >
      {children}
    </div>
  );
}
