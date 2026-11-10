dinapoli_vitrine
Web application built with React (frontend), Express (backend API) and MySQL (database), all in TypeScript.
Tech stack
Layer	Technology
Frontend	React + TypeScript, built with Vite
Backend	Node.js, Express 5, TypeScript, `tsx` (dev)
Database	MySQL 8.4, accessed with `mysql2`
Architecture overview
```
Browser (React, port 5173)
   |  HTTP / JSON  (/api/...)
   v
Express API (port 3000)
   |  SQL via mysql2
   v
MySQL (port 3308)
```
The frontend and the backend are two independent applications. They communicate only through a JSON API, so either side can be replaced or changed without touching the other.
During development, the Vite dev server proxies every `/api` request to the Express server, which avoids CORS issues.
Project structure
```
dinapoli_vitrine/
├── front/                 React application
│   └── src/
│       ├── components/    Reusable UI pieces (Button, Navbar, ...)
│       ├── pages/         One component per screen
│       ├── services/      API calls (the only place that uses fetch)
│       ├── hooks/         Reusable logic
│       ├── types/         TypeScript types for API data
│       └── App.tsx        Router setup
│
└── backend/               Express API
    └── src/
        ├── index.ts       Starts the server
        ├── app.ts         Creates the Express app (middleware, routes)
        ├── config/        Environment variables, database pool
        ├── routes/        URL -> controller mapping
        ├── controllers/   Read the request, call a service, send the response
        ├── services/      Business logic (rules, calculations)
        ├── repositories/  SQL queries, nothing else
        ├── middleware/    Error handling, authentication, validation
        └── types/         TypeScript types for the data
```

