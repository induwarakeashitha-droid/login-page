# Node Auth Learning Project

Plain Express + JWT auth, no external DB. Users get stored in `data/users.json`.

## Setup

```
npm install
cp .env.example .env
```

Open `.env` and set `JWT_SECRET` to any random string.

## Run

```
node server.js
```

Then open http://localhost:5000 to test register/login/protected route through the browser, or hit the API directly:

```
POST /api/auth/register   { email, password }
POST /api/auth/login      { email, password }  -> returns { token }
GET  /api/auth/me         Authorization: Bearer <token>
```

## How it works

- `routes/auth.js` — the three endpoints
- `middleware/auth.js` — checks the JWT on protected routes
- `utils/db.js` — reads/writes `data/users.json`, stands in for a real database
- passwords are hashed with bcrypt before being stored, never saved in plain text
- login gives back a JWT signed with `JWT_SECRET`, valid for 1 hour
- `/me` is protected — no valid token, no access

## Next steps once this makes sense

- swap `utils/db.js` for a real database (Postgres/Mongo/Supabase) without touching the routes
- add refresh tokens so users don't get logged out every hour
- add express-validator for stronger input checks
- rate limit `/login` to slow down brute force attempts
