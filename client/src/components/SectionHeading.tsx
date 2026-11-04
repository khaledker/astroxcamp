import clsx from 'clsx';

interface SectionHeadingProps {
  index: string;
  label: string;
  title: string;
  description?: string;
  className?: string;
  titleId?: string;
}

export function SectionHeading({
  index,
  label,
  title,
  description,
  className,
  titleId,
}: SectionHeadingProps) {
  return (
    <header className={clsx('flex flex-col gap-4', className)}>
      <p className="eyebrow">
        {index} / {label}
      </p>
      <h2 id={titleId} className="text-display-lg">
        {title}
      </h2>
      {description && (
        <p className="max-w-prose font-body text-body text-steel">{description}</p>
      )}
    </header>
  );
}
