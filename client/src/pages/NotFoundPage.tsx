import { Link } from 'react-router-dom';
import { AssetPlaceholder } from '../components/AssetPlaceholder';
import { buttonClassName } from '../components/Button';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('Lost in space — 404');

  return (
    <section className="relative isolate flex min-h-[calc(100vh-5rem)] items-center overflow-hidden md:min-h-[calc(100vh-6.25rem)]">
      <div className="site-container relative grid items-center gap-12 py-20 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow">Error / 404</p>
          <p className="mt-6 text-display-2xl text-yellow text-glow-yellow" aria-hidden="true">
            404
          </p>
          <h1 className="mt-4 text-display-lg">Lost in space</h1>
          <p className="mt-5 max-w-xl font-body text-body-lg text-steel">
            This page drifted off its orbit. Check the address, or navigate back to mission
            control.
          </p>
          <Link
            to="/"
            className={buttonClassName({
              variant: 'secondary',
              className: 'mt-9 w-full sm:w-auto',
            })}
          >
            Back to landing
          </Link>
        </div>

        <div className="hidden justify-self-end lg:col-span-6 lg:block">
          <AssetPlaceholder asset="notFoundPlanet" className="h-auto w-full" />
        </div>
      </div>
    </section>
  );
}
