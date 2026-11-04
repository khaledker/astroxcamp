import clsx from 'clsx';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'icon';

interface ButtonVariantOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-yellow bg-yellow text-space hover:border-orange hover:bg-orange hover:shadow-glow-yellow active:border-blue active:bg-blue active:shadow-none disabled:border-line disabled:bg-muted/20 disabled:text-muted disabled:shadow-none',
  secondary:
    'border-line-strong bg-transparent text-star hover:border-yellow hover:text-yellow active:border-blue active:bg-blue/10 active:text-blue disabled:border-line disabled:text-muted',
  ghost:
    'border-transparent bg-transparent text-steel hover:bg-elevated hover:text-star active:bg-blue/10 active:text-blue',
  danger:
    'border-danger/60 bg-transparent text-danger hover:border-danger hover:bg-danger/10 active:bg-danger/20',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-11 min-w-11 px-4 text-xs',
  md: 'h-14 min-w-[10.75rem] px-6 text-sm',
  icon: 'h-11 w-11 min-w-11 px-0 text-sm',
};

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonVariantOptions = {}): string {
  return clsx(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border font-display font-semibold tracking-wide transition-all duration-200 ease-out',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue',
    'disabled:cursor-not-allowed disabled:shadow-none',
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className,
    disabled,
    children,
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClassName({ variant, size, className })}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
});
