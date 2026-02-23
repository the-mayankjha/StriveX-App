
import { cn } from '../utils/cn';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'blue' | 'red' | 'green' | 'gold';
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function ProgressBar({ value, max, color = 'blue', label, showValue = true, className }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const bgColors = {
    blue: 'bg-primary',
    red: 'bg-accent',
    green: 'bg-system-success',
    gold: 'bg-system-warning',
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between mb-1 text-xs font-mono text-text-muted">
          <span>{label}</span>
          {showValue && <span>{Math.floor(value)} / {max}</span>}
        </div>
      )}
      <div className="h-2 w-full bg-surfaceHighlight rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-500 ease-out", bgColors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
