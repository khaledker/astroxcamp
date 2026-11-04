import clsx from 'clsx';

interface StarfieldProps {
  className?: string;
}

/**
 * Full-page animated star background shared by every route. The wrapper is
 * positioned behind page content inside an isolated stacking context.
 */
export function Starfield({ className }: StarfieldProps) {
  return (
    <div
      className={clsx('starfield pointer-events-none absolute inset-0 -z-10', className)}
      aria-hidden="true"
    />
  );
}
