import { Link } from 'react-router-dom';
import { AssetPlaceholder } from '../components/AssetPlaceholder';
import { buttonClassName } from '../components/Button';
import { EVENT, FULL_TITLE } from '../data/event';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export function RegistrationSuccess() {
  useDocumentTitle(`Registration complete — ${FULL_TITLE}`);

  return (
    <section className="site-container flex flex-col items-center py-16 text-center md:py-24">
      <AssetPlaceholder
        asset="successBadge"
        className="h-[10.5rem] w-[10.5rem] rounded-full"
      />

      <p className="eyebrow mt-10">Registration / Success</p>

      <h1 className="mt-5 max-w-4xl text-display-lg md:text-display-xl">
        Registration complete
      </h1>

      <p className="mt-6 max-w-2xl font-body text-body-lg text-steel">
        Your registration for {FULL_TITLE} has been submitted.
      </p>

      <p className="mt-8 font-mono text-sm uppercase tracking-[0.08em] text-yellow">
        {EVENT.dateLabel} <span className="px-2 text-muted">/</span> {EVENT.locationLabel}
      </p>

      <Link
        to="/"
        className={buttonClassName({
          variant: 'secondary',
          className: 'mt-10 w-full sm:w-auto',
        })}
      >
        Back to landing
      </Link>
    </section>
  );
}
