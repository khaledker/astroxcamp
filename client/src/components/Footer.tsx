import { Link } from 'react-router-dom';
import { AssetPlaceholder } from './AssetPlaceholder';
import { EVENT } from '../data/event';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line/60">
      <div className="site-container flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:gap-8 md:py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Link
            to="/"
            aria-label={`${EVENT.name} ${EVENT.edition} — home`}
            className="inline-flex min-h-11 w-fit items-center rounded-sm"
          >
            <AssetPlaceholder
              asset="logo"
              variant="inline"
              className="h-7 w-[7.5rem]"
            />
          </Link>
          <p className="font-body text-sm text-steel">{EVENT.club}</p>
        </div>
        <p className="hidden font-mono text-label text-yellow sm:block">{EVENT.edition}</p>
      </div>
    </footer>
  );
}
