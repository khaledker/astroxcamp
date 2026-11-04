import { useEffect, useState } from 'react';
import { EVENT } from '../data/event';

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const getRemaining = (target: number): Remaining | null => {
  const distance = target - Date.now();
  if (!Number.isFinite(distance) || distance <= 0) return null;

  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
};

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Live countdown to the event start. It disappears when the target has passed
 * or when VITE_EVENT_DATETIME is malformed.
 */
export function Countdown() {
  const target = EVENT.dateTime ? Date.parse(EVENT.dateTime) : Number.NaN;
  const [remaining, setRemaining] = useState<Remaining | null>(() =>
    Number.isFinite(target) ? getRemaining(target) : null,
  );

  useEffect(() => {
    if (!Number.isFinite(target)) return;
    setRemaining(getRemaining(target));
    const timer = window.setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  if (!remaining || !EVENT.dateTime) return null;

  const units = [
    { label: 'Days', value: remaining.days },
    { label: 'Hrs', value: remaining.hours },
    { label: 'Min', value: remaining.minutes },
    { label: 'Sec', value: remaining.seconds },
  ];

  return (
    <div
      className="flex flex-col items-center gap-3 text-center"
      role="timer"
      aria-live="off"
      aria-atomic="true"
    >
      <span className="font-mono text-2xs uppercase tracking-[0.16em] text-blue">
        T-minus to launch
      </span>
      <div className="flex items-start justify-center gap-4 sm:gap-6">
        {units.map((unit) => (
          <div key={unit.label} className="flex min-w-12 flex-col gap-1">
            <span className="font-display text-2xl font-semibold leading-none text-star sm:text-3xl">
              {pad(unit.value)}
            </span>
            <span className="font-mono text-2xs uppercase tracking-[0.12em] text-muted">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
      <span className="sr-only">
        Time remaining until {EVENT.dateLabel}: {remaining.days} days, {remaining.hours} hours,{' '}
        {remaining.minutes} minutes and {remaining.seconds} seconds.
      </span>
    </div>
  );
}
