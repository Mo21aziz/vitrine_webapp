# Di Napoli — site vitrine

| Part | Tech | Hosted on |
|---|---|---|
| `front/` | React 19 + Vite + React Router + Leaflet | Vercel |
| `backend/` | Express 5 + Prisma 7 (MySQL) | Render |
| Database | MySQL | Railway |

Uploaded photos are stored in the database (`Image` table), so they survive Render redeploys.

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
npm run dev                  # http://localhost:5173 (proxies /api and /uploads to :3000)
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
