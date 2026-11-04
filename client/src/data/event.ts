/**
 * Event copy. The headline, description, agenda and venue are confirmed.
 * Speaker/host names are marked with bracketed placeholders in `agenda.ts`.
 * The date is 25 December 2026; 09:00 Algiers time is an assumption until the
 * confirmed start time is available.
 */
export const EVENT = {
  name: 'AstroXcamp',
  edition: '26/27',
  club: 'University of AstroTech club',
  ownerLabel: 'UNIVERSITY OF ASTROTECH CLUB',
  tagline: 'Your mission: explore the universe.',
  description:
    'AstroXcamp 26/27 is a day of talks and workshops on astronomy and technology, led by experts. Open to everyone.',
  dateLabel: '25 December 2026',
  locationLabel: 'Algiers, Algeria',
  scheduleNote:
    'All times are Algiers local time (UTC+1). The programme may change; check back closer to the event.',
  agendaHint:
    "Two workshops run in parallel at 12:00. Jumu'ah prayer is at 13:00, followed by lunch.",
  /**
   * ISO-8601 event start. Algiers is UTC+1 in December. Override with
   * VITE_EVENT_DATETIME when the confirmed start time changes.
   */
  dateTime:
    import.meta.env.VITE_EVENT_DATETIME?.trim() || '2026-12-25T09:00:00+01:00',
} as const;

export const FULL_TITLE = `${EVENT.name} ${EVENT.edition}`;
