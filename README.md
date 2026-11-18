# dinapoli_vitrine

Showcase website for the Di Napoli restaurants, with a private admin dashboard.
Web application built with React (frontend), Express (backend API) and MySQL (database), all in TypeScript.

## Tech stack

| Layer | Technology | Hosted on |
|---|---|---|
| Frontend | React 19 + TypeScript, Vite, React Router, Leaflet (OpenStreetMap) | Vercel |
| Backend | Node.js, Express 5, TypeScript, Prisma 7, `tsx` (dev) | Render |
| Database | MySQL 8, accessed with Prisma (MariaDB driver adapter) | Railway |

## Architecture overview

```
Browser (React, port 5173)
   |  HTTP / JSON  (/api/...)   +  photos (/uploads/...)
   v
Express API (port 3000)
   |  SQL via Prisma
   v
MySQL
```

The frontend and the backend are two independent applications. They communicate only through a JSON API,
so either side can be replaced or changed without touching the other.
During development, the Vite dev server proxies every `/api` and `/uploads` request to the Express server,
which avoids CORS issues. Uploaded photos are stored in the database (`Image` table), so they survive
redeploys on hosts with an ephemeral disk.

## Project structure

```
dinapoli_vitrine/
├── front/                 React application
│   └── src/
│       ├── api/           API calls (the only place that uses fetch)
│       ├── components/    Reusable UI pieces (ui/, home/, dashboard/, layout/, map/)
│       ├── pages/         One component per screen (public + admin/)
│       ├── context/       Admin authentication
│       ├── hooks/         Reusable logic
│       ├── types/         TypeScript types for API data
│       ├── utils/         Formatting, map helpers
│       └── App.tsx        Router setup
│
└── backend/               Express API
    ├── prisma/            schema.prisma, migrations/, seed.ts
    └── src/
        ├── index.ts       Creates and starts the Express app
        ├── config/        Environment variables, Prisma client
        ├── routes/        URL -> controller mapping (public + /admin)
        ├── controllers/   Read the request, call a service, send the response
        ├── services/      Business logic (rules, calculations)
        ├── repositories/  Database queries, nothing else
        ├── middleware/    Error handling, authentication, uploads
        └── types/         Validation schemas (zod) and shared types
```

## Run locally

```bash
# backend
cd backend
cp .env.example .env        # then fill in DATABASE_URL, JWT_SECRET, ADMIN_*
npm install
npx prisma migrate deploy
SEED_DEMO=true npx prisma db seed   # optional demo content
npm run dev                  # http://localhost:3000

# front (other terminal)
cd front
npm install
npm run dev                  # http://localhost:5173
```

Admin: `/admin/login` (not linked from the site).

## Deploy

### Backend → Render (Web Service, root directory `backend`)

- Build command: `npm ci --include=dev && npm run build`
- Start command: `npm run start:prod` (applies migrations, ensures the admin account, starts the API)
- Health check path: `/api/health`
- Environment variables: `DATABASE_URL` (Railway **public** URL), `JWT_SECRET`, `ADMIN_USERNAME`,
  `ADMIN_PASSWORD`, `CORS_ORIGIN` (Vercel URL), `NODE_VERSION=22.12.0`

`render.yaml` at the repo root describes the same service as a Render Blueprint.

### Front → Vercel (root directory `front`)

- Framework preset: Vite (settings come from `front/vercel.json`)
- Environment variable: `VITE_API_URL=https://<your-render-service>.onrender.com/api`
