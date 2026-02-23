import React from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  className, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/50 hover:bg-primary/20 hover:shadow-glow-blue',
    secondary: 'bg-secondary/10 text-secondary border-secondary/50 hover:bg-secondary/20',
    danger: 'bg-accent/10 text-accent border-accent/50 hover:bg-accent/20 hover:shadow-glow-red',
    ghost: 'bg-transparent border-transparent text-text-muted hover:text-text hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button 
      className={cn(
        "border rounded transition-all duration-200 font-system font-bold tracking-wider flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
