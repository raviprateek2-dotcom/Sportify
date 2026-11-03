import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'tech' | 'lime' | 'orange';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider font-mono rounded-none border transition-colors',
        variant === 'default' && 'bg-primary text-primary-foreground border-transparent',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground border-transparent',
        variant === 'outline' && 'text-foreground border-border',
        variant === 'tech' && 'bg-zinc-900 text-zinc-300 border-zinc-700',
        variant === 'lime' && 'bg-lime-950/60 text-lime-400 border-lime-800/80',
        variant === 'orange' && 'bg-orange-950/60 text-orange-400 border-orange-800/80',
        className
      )}
      {...props}
    />
  );
}

export { Badge };
