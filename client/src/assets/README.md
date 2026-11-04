# Asset drop zone

Place the final exports in `client/public/assets/`, then set `available: true`
for the matching entry in `src/assets/manifest.ts`. Filenames currently wired up:

| Manifest key | File | Size | Format |
| --- | --- | --- | --- |
| logo | `logo.svg` | 192×48 | SVG |
| heroPlanet | `hero-planet.png` | 1124×680 | PNG |
| hudBrackets | `hud.png` | 1672×941 | PNG |
| badge | `badge.svg` | 88×88 | SVG |
| sabers | `sabers.png` | 1200×1200 | PNG |
| notFoundPlanet | `blackhole.png` | 1672×941 | PNG |
| agendaShip | `spaceship.png` | 1536×1024 | PNG |
| registerPlanet | `register-planet.png` | 896×560 | PNG |
| successBadge | `badge.svg` | 88×88 | SVG |
| favicon | `favicon.svg` | 64×64 | SVG |

The starfield is drawn in CSS by the `Starfield` component, so it has no file
entry. `favicon.svg` currently contains a placeholder; replace it with the real
icon.
