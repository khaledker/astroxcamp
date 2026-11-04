import { useId } from 'react';
import clsx from 'clsx';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label: string;
  error?: string;
  hint?: string;
  hideLabel?: boolean;
};

/**
 * Text input with a persistent label, optional hint and inline error state.
 * Error text is announced via aria-live through role="alert".
 */
export const Input = ({
  label,
  error,
  hint,
  hideLabel = false,
  id,
  className,
  required,
  ...props
}: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? `field-${generatedId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={clsx('flex w-full flex-col gap-2', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={inputId}
          className={clsx(
            'font-body text-sm font-medium text-star',
            hideLabel && 'sr-only',
          )}
        >
          {label}
          {required && <span className="sr-only"> (required)</span>}
        </label>
      </div>

      <input
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        className={clsx(
          'h-14 w-full rounded-sm border bg-surface px-4 font-body text-body text-star transition-colors duration-200 placeholder:text-muted/80',
          'focus:border-blue focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error ? 'border-danger' : 'border-line-strong/80 hover:border-line-strong',
        )}
        {...props}
      />

      {hint && !error && (
        <p id={hintId} className="font-body text-xs leading-relaxed text-muted">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="font-body text-xs leading-relaxed text-danger">
          {error}
        </p>
      )}
    </div>
  );
};
