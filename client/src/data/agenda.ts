/**
 * Agenda content — edit this file to populate the schedule. Times are strings
 * so the organisers can keep formatting such as “09:00” or “9.00–10.00”.
 *
 * Speaker and host names are intentionally left as bracketed placeholders
 * until the programme is confirmed. The lunch slot was checked against Algiers
 * prayer times for 25 December 2026 (Friday): Dhuhr 12:48, so Jumu'ah prayer
 * sits at 13:00 and lunch follows at 13:30.
 */
export type AgendaAccent = 'blue' | 'neutral' | 'orange';
export type AgendaTag =
  | 'Arrival'
  | 'Opening'
  | 'Talk'
  | 'Break'
  | 'Workshop'
  | 'Panel'
  | 'Closing'
  | 'Activity';

export interface AgendaItem {
  id: string;
  time: string;
  activity: string;
  tag: AgendaTag;
  accent: AgendaAccent;
}

export const agenda: AgendaItem[] = [
  {
    id: 'slot-01',
    time: '09:00',
    activity: 'Check-in and badges',
    tag: 'Arrival',
    accent: 'neutral',
  },
  {
    id: 'slot-02',
    time: '09:30',
    activity: 'Opening: welcome to AstroXcamp 26/27',
    tag: 'Opening',
    accent: 'blue',
  },
  {
    id: 'slot-03',
    time: '10:00',
    activity: 'Talk: How we observe the night sky [speaker]',
    tag: 'Talk',
    accent: 'blue',
  },
  {
    id: 'slot-04',
    time: '10:45',
    activity: 'Talk: What light tells us about the universe [speaker]',
    tag: 'Talk',
    accent: 'blue',
  },
  {
    id: 'slot-05',
    time: '11:30',
    activity: 'Coffee break and networking',
    tag: 'Break',
    accent: 'neutral',
  },
  {
    id: 'slot-06',
    time: '12:00',
    activity: 'Workshop A: Mapping the sky with free software [host]',
    tag: 'Workshop',
    accent: 'orange',
  },
  {
    id: 'slot-07',
    time: '12:00',
    activity: 'Workshop B: Arduino and light sensors [host]',
    tag: 'Workshop',
    accent: 'orange',
  },
  {
    id: 'slot-08',
    time: '13:00',
    activity: "Jumu'ah prayer break",
    tag: 'Break',
    accent: 'neutral',
  },
  {
    id: 'slot-09',
    time: '13:30',
    activity: 'Lunch break',
    tag: 'Break',
    accent: 'neutral',
  },
  {
    id: 'slot-10',
    time: '14:30',
    activity: 'Expert panel: Q&A on getting started in astronomy',
    tag: 'Panel',
    accent: 'blue',
  },
  {
    id: 'slot-11',
    time: '15:30',
    activity: 'Workshop: Analyzing astronomy data with Python [host]',
    tag: 'Workshop',
    accent: 'orange',
  },
  {
    id: 'slot-12',
    time: '16:30',
    activity: 'Closing, group photo, and next steps',
    tag: 'Closing',
    accent: 'blue',
  },
  {
    id: 'slot-13',
    time: '17:00',
    activity: 'Optional: observation session, weather permitting',
    tag: 'Activity',
    accent: 'orange',
  },
];
