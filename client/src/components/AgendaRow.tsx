import clsx from 'clsx';
import type { AgendaAccent, AgendaItem } from '../data/agenda';

const accentClasses: Record<AgendaAccent, string> = {
  blue: 'lg:border-blue',
  neutral: 'lg:border-line',
  orange: 'lg:border-orange',
};

const tagClasses: Record<AgendaAccent, string> = {
  blue: 'border-blue/40 text-blue',
  neutral: 'border-line-strong text-muted',
  orange: 'border-orange/40 text-orange',
};

interface AgendaRowProps {
  item: AgendaItem;
}

export function AgendaRow({ item }: AgendaRowProps) {
  return (
    <li
      className={clsx(
        'flex min-h-[6rem] flex-col justify-center gap-2 rounded-sm border border-line bg-surface/50 px-5 py-5 transition-colors duration-200',
        'hover:border-blue focus-within:border-blue lg:flex-row lg:items-center lg:justify-start lg:gap-0 lg:px-8',
        accentClasses[item.accent],
      )}
    >
      <span className="font-mono text-[0.9375rem] leading-none tracking-wide text-yellow lg:w-[7.5rem] lg:shrink-0">
        {item.time}
      </span>
      <span className="font-display text-sm font-semibold uppercase tracking-wide text-star lg:text-base">
        {item.activity}
      </span>
      <span
        className={clsx(
          'mt-1 self-start rounded-sm border px-2.5 py-1 font-mono text-[0.625rem] uppercase leading-none tracking-[0.12em]',
          'lg:ml-auto lg:mt-0 lg:shrink-0 lg:self-center',
          tagClasses[item.accent],
        )}
      >
        {item.tag}
      </span>
    </li>
  );
}
