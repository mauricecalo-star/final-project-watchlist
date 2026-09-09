# Watchlist

Full-stack movie/show watchlist. Search OMDb, save titles to your personal list, track watched status and rating.

## Stack
- **Backend**: Node, Express, TypeScript, Prisma, SQLite (dev)
- **Frontend**: React, TypeScript, Vite, React Router
- **Auth**: email/password, JWT
- **External API**: OMDb (proxied through the backend so the API key stays server-side)

## Setup

### 1. Get a free OMDb API key
https://www.omdbapi.com/apikey.aspx (choose the free tier, check your email for the key)

### 2. Backend
```bash
cd backend
cp .env.example .env
# edit .env: paste your OMDb key and set a random JWT_SECRET
npm run prisma:migrate -- --name init
npm run dev
```
Runs on http://localhost:4000

### 3. Frontend
```bash
cd frontend
cp .env.example .env
npm run dev
```
Runs on http://localhost:5173

## Project structure
```
backend/
  prisma/schema.prisma   # User, Item models
  src/
    routes/auth.ts       # signup, login
    routes/items.ts      # CRUD for the logged-in user's list
    routes/omdb.ts        # search proxy
    middleware/auth.ts    # JWT verification
frontend/
  src/
    pages/                # Login, Signup, Search, MyList
    AuthContext.tsx        # login state, token storage
    api.ts                 # fetch wrapper for the backend
```

## Deploying
- Frontend → Vercel or Netlify (free tier)
- Backend → Render or Railway (free tier); switch `datasource db` in `schema.prisma` to `postgresql` and point `DATABASE_URL` at the free Postgres instance they provision
