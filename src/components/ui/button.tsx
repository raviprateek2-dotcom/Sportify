import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'tech';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
          // Variant styling
          variant === 'default' &&
            'bg-brand-orange text-white hover:bg-orange-600 shadow-sm',
          variant === 'secondary' &&
            'bg-secondary text-secondary-foreground hover:bg-zinc-800',
          variant === 'outline' &&
            'border border-border bg-transparent hover:bg-secondary hover:text-foreground',
          variant === 'ghost' &&
            'hover:bg-secondary hover:text-foreground',
          variant === 'destructive' &&
            'bg-destructive text-destructive-foreground hover:bg-red-700',
          variant === 'tech' &&
            'bg-brand-graphite border border-brand-surface text-brand-white hover:border-brand-orange hover:text-brand-orange uppercase tracking-wider font-mono text-xs',
          // Size styling
          size === 'sm' && 'h-8 px-3 text-xs rounded-sm',
          size === 'md' && 'h-10 px-5 text-sm rounded-sm',
          size === 'lg' && 'h-12 px-8 text-base rounded-sm',
          size === 'icon' && 'h-10 w-10 p-0 rounded-sm',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
