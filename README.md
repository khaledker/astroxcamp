# AstroXcamp 26/27

Full-stack site for the University of AstroTech club event: a responsive public
landing page, a validated registration flow, and a private organiser dashboard.

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, TypeScript, Zod, SQLite (`better-sqlite3`)
- **Auth:** bcrypt password hash from env + signed httpOnly JWT cookie
- **Motion:** shared starfield, route-to-route fade transition, live countdown,
  lightsaber ignition on the landing page
- **Repo:** npm workspaces (`client` + `server`)

. Project structure

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
