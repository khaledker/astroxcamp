import { useEffect, useId, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { AssetPlaceholder } from './AssetPlaceholder';
import { buttonClassName } from './Button';
import { EVENT, FULL_TITLE } from '../data/event';

const navigation = [
  { label: 'Home', to: '/', hash: '#home' },
  { label: 'Agenda', to: '/', hash: '#agenda' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuId = useId();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-space/95 backdrop-blur-md">
      <div className="site-container flex h-20 items-center justify-between gap-2 md:h-[6.25rem] md:gap-6">
        <Link
          to="/"
          aria-label={`${FULL_TITLE} — home`}
          className="inline-flex min-h-11 shrink-0 items-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
        >
          <AssetPlaceholder
            asset="logo"
            variant="inline"
            className="h-8 w-[6.25rem] md:h-9 md:w-[9.375rem]"
          />
        </Link>

        <nav aria-label="Main navigation" className="ml-4 hidden items-center gap-7 md:flex lg:ml-10 lg:gap-9">
          {navigation.map((item) => {
            const isCurrent =
              location.pathname === '/' &&
              (location.hash === item.hash || (item.hash === '#home' && location.hash === ''));
            return (
              <Link
                key={item.label}
                to={{ pathname: item.to, hash: item.hash }}
                aria-current={isCurrent ? 'page' : undefined}
                className={clsx(
                  'flex min-h-11 items-center font-body text-body transition-colors duration-200 hover:text-yellow',
                  isCurrent ? 'text-star' : 'text-steel',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:gap-4">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-line-strong text-star transition-colors hover:border-yellow hover:text-yellow md:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span
                className={clsx(
                  'absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-200',
                  menuOpen && 'translate-y-[7px] rotate-45',
                )}
              />
              <span
                className={clsx(
                  'absolute left-0 top-[7px] h-px w-5 bg-current transition-opacity duration-200',
                  menuOpen && 'opacity-0',
                )}
              />
              <span
                className={clsx(
                  'absolute bottom-0 left-0 h-px w-5 bg-current transition-transform duration-200',
                  menuOpen && '-translate-y-[8px] -rotate-45',
                )}
              />
            </span>
          </button>

          <Link
            to="/register"
            className={buttonClassName({
              size: 'md',
              className:
                'h-14 min-w-[7rem] px-4 text-sm md:min-w-[10.75rem] md:px-6',
            })}
          >
            Register
          </Link>
        </div>
      </div>

      <div
        id={menuId}
        hidden={!menuOpen}
        className="border-t border-line/70 bg-space/95 md:hidden"
      >
        <nav aria-label="Mobile navigation" className="site-container flex flex-col py-3">
          {navigation.map((item) => (
            <Link
              key={item.label}
              to={{ pathname: item.to, hash: item.hash }}
              className="flex min-h-14 items-center border-b border-line/50 font-body text-body-lg text-steel transition-colors hover:text-yellow"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/register"
            className="flex min-h-14 items-center font-body text-body-lg text-steel transition-colors hover:text-yellow"
            onClick={() => setMenuOpen(false)}
          >
            Register for {EVENT.name} {EVENT.edition}
          </Link>
        </nav>
      </div>
    </header>
  );
}
