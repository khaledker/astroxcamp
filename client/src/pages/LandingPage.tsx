import { Link } from 'react-router-dom';
import { AgendaRow } from '../components/AgendaRow';
import { AssetPlaceholder } from '../components/AssetPlaceholder';
import { buttonClassName } from '../components/Button';
import { Card } from '../components/Card';
import { Countdown } from '../components/Countdown';
import { CrossedSabers } from '../components/CrossedSabers';
import { Footer } from '../components/Footer';
import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { agenda, type AgendaAccent } from '../data/agenda';
import { EVENT, FULL_TITLE } from '../data/event';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const dotClasses: Record<AgendaAccent, string> = {
  blue: 'bg-blue',
  neutral: 'bg-steel',
  orange: 'bg-orange',
};

export function LandingPage() {
  useDocumentTitle(`${FULL_TITLE} — ${EVENT.club}`);

  return (
    <div className="relative isolate">
      <section id="home" aria-labelledby="hero-heading" className="relative">
        <div className="site-container grid gap-10 pb-8 pt-14 md:pt-20 lg:grid-cols-12 lg:gap-6 lg:pb-10 lg:pt-16">
          <div className="flex flex-col items-start lg:col-span-7 lg:pr-4">
            <p className="eyebrow animate-fade-up">{EVENT.ownerLabel}</p>

            <h1
              id="hero-heading"
              className="mt-6 animate-fade-up text-display-xl font-bold [animation-delay:80ms]"
            >
              <span className="block">AstroXcamp</span>
              <span className="mt-1 block text-yellow text-glow-yellow">{EVENT.edition}</span>
            </h1>

            <p className="mt-7 max-w-2xl animate-fade-up font-body text-body-lg text-star [animation-delay:160ms]">
              {EVENT.tagline}
            </p>
            <p className="mt-4 max-w-xl animate-fade-up font-body text-body text-steel [animation-delay:200ms]">
              {EVENT.description}
            </p>

            <dl className="mt-9 flex animate-fade-up flex-wrap gap-x-14 gap-y-6 [animation-delay:240ms] sm:gap-x-20">
              <div className="flex flex-col gap-2">
                <dt className="font-mono text-label uppercase text-muted">Date</dt>
                <dd className="font-body text-body-lg text-star">{EVENT.dateLabel}</dd>
              </div>
              <div className="flex flex-col gap-2">
                <dt className="font-mono text-label uppercase text-muted">Location</dt>
                <dd className="font-body text-body-lg text-star">{EVENT.locationLabel}</dd>
              </div>
            </dl>

            <Link
              to="/register"
              className={buttonClassName({
                className:
                  'mt-10 w-full animate-fade-up [animation-delay:280ms] sm:w-auto sm:min-w-[10.75rem]',
              })}
            >
              Register
            </Link>
          </div>

          <div className="relative mx-auto h-[21rem] w-full max-w-[23rem] animate-fade-up [animation-delay:180ms] sm:h-[25rem] sm:max-w-[26rem] lg:col-span-5 lg:ml-0 lg:mr-0 lg:h-[30rem] lg:max-w-none xl:h-[31rem]">
            <AssetPlaceholder
              asset="heroPlanet"
              className="absolute left-1/2 top-11 h-[13rem] w-[13rem] -translate-x-1/2 rounded-full sm:top-14 sm:h-[16rem] sm:w-[16rem] lg:left-auto lg:right-14 lg:top-12 lg:h-[23rem] lg:w-[23rem] lg:translate-x-0 xl:right-16 xl:h-[25rem] xl:w-[25rem]"
            />
           
            <AssetPlaceholder
              asset="hudBrackets"
              className="asset-placeholder--label-top absolute left-1/2 top-2 h-[17rem] w-[19rem] -translate-x-1/2 sm:h-[21rem] sm:w-[23rem] lg:left-auto lg:right-0 lg:top-4 lg:h-[25rem] lg:w-[28rem] lg:translate-x-0 xl:w-[31rem]"
            />
           
            <AssetPlaceholder
              asset="badge"
              className="absolute bottom-3 right-1 h-20 w-20 rounded-full sm:right-4 lg:bottom-2 lg:right-2 xl:right-8"
            />
            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 font-mono text-2xs tracking-[0.18em] text-muted lg:left-auto lg:right-[42%] lg:bottom-3"
              aria-hidden="true"
            >
              26/27
            </span>
          </div>
        </div>

        <div className="relative hidden h-40 w-full lg:block" aria-hidden="true">
          <CrossedSabers className="absolute left-1/2 top-0 h-40 w-60 -translate-x-1/2" />
        </div>

        <div className="site-container relative hidden items-center justify-between gap-6 pb-10 pt-8 font-mono text-label uppercase text-muted lg:flex lg:pt-2">
          <p>01 / {FULL_TITLE}</p>
          <a
            href="#agenda"
            className="hidden min-h-11 items-center gap-2 transition-colors hover:text-yellow lg:flex"
          >
            Agenda <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section id="agenda" aria-labelledby="agenda-heading" className="relative border-t border-line/40">
        <div className="site-container py-20 md:py-24 xl:py-30">
          <Reveal>
            <SectionHeading
              index="02"
              label="Agenda"
              title="The schedule"
              titleId="agenda-heading"
            />
          </Reveal>

          <p className="mt-5 max-w-xl font-body text-body text-steel lg:hidden">
            {EVENT.agendaHint}
          </p>

          <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[18.75rem_3.5rem_minmax(0,1fr)] lg:gap-8">
            <Reveal className="hidden lg:col-span-1 lg:block">
              <div className="lg:sticky lg:top-28">
                <Card className="flex min-h-[26rem] flex-col" padded={false}>
                  <div className="flex h-full flex-col p-6">
                    <p className="font-display text-display-md font-bold text-yellow">
                      {EVENT.edition}
                    </p>
                    <div className="flex flex-1 items-center justify-center py-6">
                      <AssetPlaceholder
                        asset="agendaShip"
                        className="h-[8.75rem] w-[13.75rem]"
                      />
                    </div>
                    <p className="font-body text-sm leading-relaxed text-steel">
                      {EVENT.scheduleNote}
                    </p>
                  </div>
                </Card>
              </div>
            </Reveal>

            <div className="relative hidden lg:col-span-1 lg:flex" aria-hidden="true">
              <div className="absolute bottom-8 left-1/2 top-8 w-px -translate-x-1/2 bg-blue/60" />
              <ol className="relative flex h-full w-full flex-col justify-around py-5">
                {agenda.map((item, index) => (
                  <li key={item.id} className="flex flex-col items-center gap-2">
                    <span className="flex h-11 w-9 items-center justify-center border border-line bg-elevated font-mono text-2xs text-steel">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${dotClasses[item.accent]}`}
                    />
                  </li>
                ))}
              </ol>
            </div>

            <Reveal className="lg:col-span-1">
              <ol className="flex flex-col gap-5" aria-label="AstroXcamp schedule">
                {agenda.map((item) => (
                  <AgendaRow key={item.id} item={item} />
                ))}
              </ol>
            </Reveal>
          </div>

          <p className="mt-6 font-body text-sm text-steel lg:hidden">
            {EVENT.scheduleNote}
          </p>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="hidden max-w-xl font-body text-sm leading-relaxed text-muted lg:block">
              {EVENT.agendaHint}
            </p>
            <Link
              to="/register"
              className={buttonClassName({
                className: 'w-full sm:w-auto sm:min-w-[10.75rem] sm:self-end',
              })}
            >
              Register
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="Countdown to launch" className="border-t border-line/40">
        <div className="site-container flex flex-col items-center py-20 text-center md:py-24 xl:py-30">
          <Countdown />
          <p className="mt-7 font-mono text-2xs uppercase tracking-[0.16em] text-muted">
            {FULL_TITLE}{' '}
            <span className="px-2 text-muted/60" aria-hidden="true">
              /
            </span>{' '}
            {EVENT.dateLabel}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
