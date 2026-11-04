import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  tone?: 'default' | 'subtle';
}

export function Card({
  padded = true,
  tone = 'default',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-sm border border-line',
        tone === 'default' ? 'bg-surface/90' : 'bg-elevated/50',
        padded && 'p-6 md:p-8',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
