# AstroXcamp 26/27

Full-stack site for the University of AstroTech club event: a responsive public
landing page, a validated registration flow, and a private organiser dashboard.

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, TypeScript, Zod, SQLite (`better-sqlite3`)
- **Auth:** bcrypt password hash from env + signed httpOnly JWT cookie
- **Motion:** shared starfield, route-to-route fade transition, live countdown,
  lightsaber ignition on the landing page
- **Repo:** npm workspaces (`client` + `server`)

---

## 1. Quick start

### Prerequisites

- Node.js 20 or newer (developed on Node 24)
- npm 10 or newer
- A C++ build toolchain if no prebuilt `better-sqlite3` binary is available for
  your platform.

### Install

```bash
npm install
```

### Configure the server

Copy the example environment file and fill it in:

```powershell
Copy-Item server/.env.example server/.env
```

```bash
# macOS / Linux
cp server/.env.example server/.env
```

Generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Generate the admin password hash (minimum 12 characters):

```bash
npm run hash -w server -- "your-strong-password-here"
```

Put the printed `ADMIN_PASSWORD_HASH=...` line in `server/.env`. Never commit
`server/.env`; it is already ignored.

Required values:

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | `development`, `test` or `production` |
| `PORT` | API port (default `4000`) |
| `CORS_ORIGIN` | Comma-separated frontend origins, no trailing slash |
| `JWT_SECRET` | Random value, at least 32 characters |
| `ADMIN_EMAIL` | Admin sign-in email |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash from the hash script |
| `DATABASE_PATH` | SQLite file path; relative paths resolve from `server/` |
| `SESSION_TTL_HOURS` | Admin session lifetime (default `8`) |
| `COOKIE_SAMESITE` | Optional: `lax` (dev default), `strict`, or `none` |

### Run

```bash
npm run dev
```

- Site: <http://localhost:5173>
- API: <http://localhost:4000>
- Health check: <http://localhost:4000/api/health>

The Vite dev server proxies `/api` to port `4000`, so no frontend env file is
needed locally.

### Optional client env

Copy `client/.env.example` to `client/.env` only if needed:

```env
# Production API origin. Leave empty when using the local Vite proxy.
VITE_API_URL=

# Optional ISO-8601 override for the event start (defaults to 25 Dec 2026, 09:00 Algiers time).
VITE_EVENT_DATETIME=2026-12-25T09:00:00+01:00
```

---

## 2. Scripts

From the repo root:

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs API + Vite dev server together |
| `npm run build` | Compiles the server and builds the client |
| `npm start` | Runs the compiled API (`server/dist`) |
| `npm run typecheck` | Type-checks both workspaces |
| `npm run hash -w server -- "password"` | Prints a bcrypt hash for `server/.env` |

Client-only production preview (API must already be running):

```bash
npm run build
npm run preview -w client
```

`vite preview` serves the build at <http://localhost:4173> and proxies `/api`
to `localhost:4000` for local smoke tests.

---

## 3. Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Landing page, event details, agenda |
| `/register` | Public | Registration form |
| `/register/success` | Public | Refresh-safe success screen |
| `/admin/login` | Public | Admin sign-in |
| `/admin` | Protected | Registrations dashboard |
| `*` | Public | In-theme 404 page |

The admin route calls `GET /api/admin/session` before rendering. If the cookie
is missing or expired it redirects to `/admin/login`.

---

## 4. API

All responses are JSON except the CSV download. Errors never expose stack
traces.

### Public

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/api/health` | Uptime/health check |
| `POST` | `/api/registrations` | Create a registration |

There is **no public read/list endpoint**. A successful registration returns
only its id. Duplicate email returns `409 EMAIL_EXISTS`.

Example:

```bash
curl -X POST http://localhost:4000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Ada Lovelace","email":"ada@example.com","phone":"+44 20 7946 0958","school":"University of AstroTech","other":"First mission"}'
```

### Admin (httpOnly cookie required)

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/api/admin/login` | Sets the session cookie |
| `POST` | `/api/admin/logout` | Clears the cookie |
| `GET` | `/api/admin/session` | Validates the current session |
| `GET` | `/api/admin/registrations` | Search/sort/paginate |
| `GET` | `/api/admin/registrations/export.csv` | CSV export |
| `DELETE` | `/api/admin/registrations/:id` | Delete one registration |

List query parameters:

- `search` — name, email, school or phone (max 100 chars)
- `page` — default `1`
- `pageSize` — default `10`, max `50`
- `sort` — `fullName`, `email`, `school`, `createdAt`
- `order` — `asc` or `desc`

CSV exports include full name, email, phone, school, other, and registration
timestamp. Values starting with `=`, `+`, `-`, `@`, tab or carriage return are
prefixed with `'` so spreadsheets do not execute them as formulas.

---

## 5. Data and validation

- SQLite database: `server/data/astrocamp.db` (ignored by git).
- The schema and indexes are created automatically at startup.
- The email column is `UNIQUE COLLATE NOCASE`.
- All SQL values are bound parameters; sort fields and directions come from
  typed allowlists.
- Text is trimmed, unicode-normalised (NFKC), stripped of control characters
  and whitespace-collapsed before validation and storage.
- Registration body is limited to **16 KB**.
- Client and server use matching Zod rules: full name 2–120, email ≤ 254,
  phone 7–15 digits, school 2–160, other ≤ 500 and optional.
- `[other]` is optional and is stored as `NULL` when blank.

To reset local demo data, stop the server and delete the SQLite files:

```powershell
Remove-Item server/data/astrocamp.db*
```

---

## 6. Design system and assets

Design tokens live in two places and are the only source of colours, fonts,
spacing additions and type scale:

- `client/src/index.css` — CSS custom properties, base and component styles
- `client/tailwind.config.js` — Tailwind mappings and animations

Fonts: **Orbitron** (display), **Exo 2** (body), **Share Tech Mono** (labels).

Reusable components: `Button`, `Input`, `Card`, `Navbar`, `SectionHeading`,
`AgendaRow`, `AssetPlaceholder`, `Reveal`, `Footer`, `Countdown`, `Starfield`,
`CrossedSabers`.

### Swapping placeholders

Every image is declared in `client/src/assets/manifest.ts`. While an asset is
unavailable, the UI renders a dashed, labelled placeholder showing its name,
expected dimensions and format. To use a real export:

1. Put the file in `client/public/assets/`.
2. Set `available: true` on that manifest entry.
3. Keep width/height/alt text accurate for layout stability.

The expected filenames are listed in `client/public/assets/README.md`.

The starfield is drawn in CSS (two drifting dot layers) rather than loaded
from an image. The favicon is a simple placeholder SVG.
Every public and admin route shares the same starfield layer. Client-side route
changes use a short content fade/slide-in rather than a full-screen effect;
`prefers-reduced-motion` skips the motion. On the landing page, the crossed
sabers ignite from their hilts when scrolled into view; reduced-motion users see
them already lit.

### Content placeholders

All unresolved Figma copy is isolated in:

- `client/src/data/event.ts` — event copy, date and venue
- `client/src/data/agenda.ts` — confirmed schedule; `[speaker]` / `[host]` names
  are still placeholders
- `client/src/assets/manifest.ts` — image specs
- `client/.env.example` — optional `VITE_EVENT_DATETIME` override

The event date is set to **25 December 2026** in Algiers (UTC+1). The 09:00
start time is an assumption until the organisers confirm it; override it with
`VITE_EVENT_DATETIME` if the start time changes.

---

## 7. Security

- Helmet security headers, `x-powered-by` disabled.
- CORS allowlist from `CORS_ORIGIN`; disallowed origins get `403`.
- Rate limiting:
  - registrations: 20 requests / 15 min / IP
  - admin login: 10 attempts / 15 min / IP
- JSON body limit: 16 KB.
- Admin password is bcrypt-hashed (cost 12) and exists only in env.
- Session is a signed JWT in an `httpOnly`, `SameSite` cookie; `Secure` is
  forced in production and for `SameSite=None`.
- Login always performs a bcrypt comparison to reduce timing differences.
- Admin reads/deletes/export require the session middleware.
- No public registration read/list route.
- Zod validation on both sides; server-side validation is authoritative.
- CSV formula-injection neutralisation.
- Unexpected errors are logged server-side and returned as generic messages.
- `robots.txt` disallows `/admin`.

Production defaults: `NODE_ENV=production` enables `trust proxy` (needed behind
Render/Vercel) and defaults the cookie to `SameSite=None; Secure`. Set
`COOKIE_SAMESITE=lax` only if the frontend/API share a site.

---

## 8. Responsive and accessibility

- Mobile-first breakpoints; verified at 390 px, 768 px and 1440 px.
- No horizontal overflow on any route at those widths.
- Minimum 44 px interactive targets; desktop and mobile navigation.
- Keyboard focus styles, skip link, visible focus, labelled inputs.
- Inline errors announced with `role="alert"`; invalid fields use
  `aria-invalid` and `aria-describedby`.
- Dialog is labelled, modal, closes with Escape, and restores focus.
- Table headers expose `aria-sort` and mobile cards expose the same data.
- `prefers-reduced-motion` disables entrance/reveal/starfield motion, the
  route fade transition and the lightsaber ignition animation.
- Lighthouse (production build): **100 Accessibility, 100 Best Practices, 100
  SEO** on `/`, `/register`, the 404 page (any unknown path), `/admin/login`,
  and the signed-in `/admin` dashboard.

---

## 9. Deployment notes

The app is two services: a static Vite client and an Express API.

### Backend on Render

Create a **Web Service** with:

- **Root directory:** `server`
- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`
- **Health check path:** `/api/health`

Environment:

```env
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
JWT_SECRET=<long-random-value>
ADMIN_EMAIL=<organiser email>
ADMIN_PASSWORD_HASH=<bcrypt hash>
DATABASE_PATH=/var/data/astrocamp.db
SESSION_TTL_HOURS=8
COOKIE_SAMESITE=none
```

Add a **persistent disk** mounted at `/var/data`. Without it, SQLite data is
lost whenever the service redeploys. `NODE_ENV=production` enables
`trust proxy` so rate limiting and secure cookies work behind Render's proxy.

### Frontend on Vercel

- **Root directory:** `client`
- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`
- `client/vercel.json` rewrites all routes to `index.html` for React Router.

Environment:

```env
VITE_API_URL=https://your-api.onrender.com
VITE_EVENT_DATETIME=2026-12-25T09:00:00+01:00   # optional override
```

After the first deploy, put the Vercel origin in the API's `CORS_ORIGIN`.
Because the two services are on different sites, the admin cookie must be
`SameSite=None; Secure`; the server's production default already does this.

> **Cookie note:** `vercel.app` and `onrender.com` are different sites, so the
> session cookie is third-party. Some browsers may block it. For a more robust
> setup, use a custom domain for both services (for example
> `www.example.com` and `api.example.com`, which are same-site), set
> `COOKIE_SAMESITE=lax`, or proxy `/api/*` through the frontend host so the
> browser sees a first-party API.

### Other hosts

Any static host can serve `client/dist` if it supports SPA fallback to
`index.html`. Any Node host can run `server/dist/index.js`; provide the same
env values and a persistent volume for SQLite. For larger-scale or
multi-instance deployments, replace the SQLite repository with PostgreSQL
(the repository interface in `server/src/repositories/types.ts` isolates this).

---

## 10. Assumptions and open content

1. **Figma gaps:** the 404 page and the admin login/dashboard were not part of
   the supplied exports. They were designed in the same dark/yellow/blue system
   and should be treated as proposals.
2. **Mobile navigation:** the brief requires a mobile menu; a hamburger menu
   was added even though the mobile frame does not show one. The Register CTA
   remains visible in the header.
3. **Event copy:** the headline, description, agenda and venue (Algiers,
   Algeria) are filled in. Speaker/host names remain bracketed and 09:00 local
   is assumed. Jumu'ah is scheduled at 13:00 (Dhuhr is 12:48 on 25 December
   2026), with lunch following at 13:30.
4. **`[other]` field:** kept as the visible label and as an optional free-text
   field, matching the brief.
5. **Countdown:** live on the landing page targeting 25 December 2026 at 09:00
   Algiers time (UTC+1). Set `VITE_EVENT_DATETIME` to override the start when
   confirmed.
6. **Assets:** final exports are wired in for the logo, hero planet, HUD,
   mission badge, 404 black hole, agenda ship, registration planet, success
   badge and crossed sabers. The favicon remains a placeholder; the starfield is
   drawn in CSS.
7. **Consent/privacy copy:** no privacy or consent language was present in the
   supplied frames, so none was invented. Add approved copy before collecting
   real personal data.
8. **Admin screens were not pixel references.** Layout choices, table
   pagination and the mobile card view are implementation decisions.

---

## 11. How to verify the seven workflow steps

### Step 1 — Install and configure

```bash
npm install
Copy-Item server/.env.example server/.env   # then fill it in
npm run dev
```

Open <http://localhost:4000/api/health> and <http://localhost:5173>. Both
should load. The API refuses to start if required env values are missing or
malformed.

### Step 2 — Design system, placeholders and landing page

Open `/` at 390, 768 and 1440 px. Confirm:

- no horizontal scrollbar;
- Orbitron headings, Exo 2 body and Share Tech Mono labels;
- every missing image is a labelled dashed placeholder with dimensions/format;
- mobile hamburger opens/closes and keyboard Escape closes it;
- the starfield is present on every route;
- navigating between routes fades/slides the new page in without a full-screen flash;
- the crossed sabers ignite when scrolled into view;
- reduced-motion preference disables the reveal, starfield drift, route fade and
  lightsaber ignition.

Check tokens in `client/src/index.css` and `client/tailwind.config.js`; no
component should hard-code a colour.

### Step 3 — Registration and success

1. Open `/register`.
2. Submit empty form — all required inline errors appear and focus moves to the
   first invalid field.
3. Register with a valid email.
4. Confirm the success screen and refresh `/register/success`.
5. Submit the same email again — expect a `409` message, not a duplicate row.
6. Sign in to `/admin` — the new row must be visible.

### Step 4 — Admin authentication

1. Open `/admin` while signed out — it redirects to `/admin/login`.
2. Submit a wrong password — generic error, no account details.
3. Sign in with `ADMIN_EMAIL` and the password you hashed into `.env`.
4. Refresh `/admin` — session persists.
5. Click **Log out** — the cookie clears and `/admin` is inaccessible again.

### Step 5 — Dashboard

- Verify the total count card.
- Search by name/email/school/phone; confirm the count changes.
- Sort by name, email, school and date; confirm `aria-sort` and order toggles.
- Move between pages when there are more than 10 rows.
- Open Delete, cancel, reopen, confirm; the total decreases.
- Check the mobile card layout at 390 px.

### Step 6 — CSV, security and privacy

- Click **Export CSV**; confirm the file has the expected header and fields.
- Register a name beginning with `=` or `+`; export and confirm it is prefixed
  with `'` in the CSV.
- Request `/api/admin/registrations` without a cookie; expect `401`.
- Confirm `Cache-Control: no-store` on `/api/*`.
- Send a request from an origin not in `CORS_ORIGIN`; expect `403`.
- Send a body over 16 KB; expect `413`.
- Check `robots.txt` disallows `/admin`.

### Step 7 — Build, audit and deploy

```bash
npm run typecheck
npm run build
npm run preview -w client   # with the API running on 4000
```

Open <http://localhost:4173> and repeat the smoke checks. Lighthouse should
report 100 Accessibility / Best Practices / SEO on the five audited routes.
Then follow section 9 for Vercel + Render, and replace all content placeholders
before launch.

---

## 12. Project structure

```
.
├─ client/
│  ├─ public/assets/         # real exports + placeholder documentation
│  ├─ src/
│  │  ├─ assets/manifest.ts  # single image source of truth
│  │  ├─ components/         # reusable UI + guard
│  │  ├─ data/               # event copy + agenda
│  │  ├─ layouts/            # public layout
│  │  ├─ lib/                # API client, schemas, hooks
│  │  ├─ pages/              # public + admin views
│  │  ├─ App.tsx
│  │  └─ index.css
│  └─ vercel.json
├─ server/
│  ├─ src/
│  │  ├─ middleware/         # auth + error handling
│  │  ├─ repositories/       # storage interface + SQLite implementation
│  │  ├─ routes/             # health, registrations, admin
│  │  ├─ lib/                # CSV + HTTP helpers
│  │  ├─ scripts/            # bcrypt hash generator
│  │  ├─ app.ts
│  │  ├─ config.ts
│  │  ├─ db.ts
│  │  └─ validation.ts
│  ├─ data/                  # local SQLite (ignored)
│  └─ .env.example
├─ package.json
└─ README.md
```
