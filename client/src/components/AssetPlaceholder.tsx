import clsx from 'clsx';
import { ASSETS, type AssetName } from '../assets/manifest';

type AssetPlaceholderVariant = 'card' | 'inline';

interface AssetPlaceholderProps {
  asset: AssetName;
  className?: string;
  variant?: AssetPlaceholderVariant;
}

/**
 * Renders the real asset when `available` is true in the manifest, otherwise a
 * labelled placeholder with the expected dimensions and format.
 */
export function AssetPlaceholder({
  asset,
  className,
  variant = 'card',
}: AssetPlaceholderProps) {
  const spec = ASSETS[asset];

  if (spec.available) {
    return (
      <img
        src={spec.path}
        alt={variant === 'inline' ? '' : spec.alt}
        aria-hidden={variant === 'inline' || undefined}
        width={spec.width}
        height={spec.height}
        className={clsx('block object-contain', className)}
        loading={asset === 'heroPlanet' || asset === 'logo' ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }

  return (
    <div
      className={clsx(
        'asset-placeholder',
        variant === 'inline' && 'asset-placeholder--inline',
        className,
      )}
      role={variant === 'inline' ? undefined : 'img'}
      aria-hidden={variant === 'inline' || undefined}
      aria-label={
        variant === 'inline'
          ? undefined
          : `Placeholder for ${spec.name}, expected ${spec.width} by ${spec.height} ${spec.format}`
      }
    >
      <span className="asset-placeholder-name">{spec.name}</span>
      <span className="asset-placeholder-meta">
        {spec.width}×{spec.height} · {spec.format}
      </span>
    </div>
  );
}
