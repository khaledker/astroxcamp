/**
 * Single source of truth for every image/graphic.
 *
 * To swap a placeholder for the real export:
 * 1. Drop the file into `client/public/assets/` using the filename below.
 * 2. Set `available: true` on that entry.
 * No component needs to change.
 *
 * Placeholder exports are intentionally not bundled here yet — the UI renders
 * a clearly labelled dashed placeholder until `available` is true.
 */

export interface AssetSpec {
  /** Human-readable label shown in the placeholder. */
  name: string;
  /** Public path once the real file exists. */
  path: string;
  /** Intrinsic export size in CSS pixels (1x). */
  width: number;
  height: number;
  /** Expected source format. */
  format: 'SVG' | 'PNG' | 'WebP';
  /** Alt text used when the real asset is available. */
  alt: string;
  /** Set to true only after placing the real file at `path`. */
  available: boolean;
}

export const ASSETS = {
  logo: {
    name: 'Logo',
    path: '/assets/logo.svg',
    width: 192,
    height: 48,
    format: 'SVG',
    alt: 'AstroXcamp wordmark',
    available: true,
  },
  heroPlanet: {
    name: 'Hero planet + rings',
    path: '/assets/hero-planet.png',
    width: 1124,
    height: 680,
    format: 'PNG',
    alt: 'Blue planet with cyan rings',
    available: true,
  },
  hudBrackets: {
    name: 'HUD brackets',
    path: '/assets/hud.png',
    width: 620,
    height: 480,
    format: 'PNG',
    alt: '',
    available: true,
  },
  badge: {
    name: 'Mission badge',
    path: '/assets/badge.svg',
    width: 80,
    height: 80,
    format: 'SVG',
    alt: 'AstroXcamp round mission badge',
    available: true,
  },
  sabers: {
    name: 'Crossed sabers',
    path: '/assets/sabers.png',
    width: 240,
    height: 160,
    format: 'PNG',
    alt: 'Crossed blue and red light sabers',
    available: true,
  },
  notFoundPlanet: {
    name: '404 black hole',
    path: '/assets/Blackhole.png',
    width: 1672,
    height: 941,
    format: 'PNG',
    alt: 'Black hole with a glowing orange accretion disk',
    available: true,
  },
  agendaShip: {
    name: 'Agenda spaceship',
    path: '/assets/spaceship.png',
    width: 220,
    height: 140,
    format: 'PNG',
    alt: 'Spaceship flying through an orbital diagram',
    available: true,
  },
  registerPlanet: {
    name: 'Registration red planet',
    path: '/assets/register-planet.png',
    width: 320,
    height: 280,
    format: 'PNG',
    alt: 'Red planet with a yellow ring',
    available: true,
  },
  successBadge: {
    name: 'Success mission badge',
    path: '/assets/badge.svg',
    width: 180,
    height: 180,
    format: 'SVG',
    alt: 'AstroXcamp 26/27 mission badge',
    available: true,
  },
  favicon: {
    name: 'Favicon',
    path: '/assets/favicon.svg',
    width: 64,
    height: 64,
    format: 'SVG',
    alt: 'AstroXcamp favicon',
    available: false,
  },
} as const satisfies Record<string, AssetSpec>;

export type AssetName = keyof typeof ASSETS;
