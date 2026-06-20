# AGENTS.md — Input New Label

A factory production label request management system converted from Streamlit to TanStack Start.

## Directory Structure

```
src/
  routes/
    __root.tsx          # HTML shell, page title
    index.tsx           # Entire app: login + dashboard + chat sidebar
  server/
    labels.functions.ts # Server functions: CRUD for production_requests table
    chat.functions.ts   # Server functions: CRUD for chat_messages table
  styles.css

db/
  schema.ts             # Drizzle ORM table definitions (source of truth)
  index.ts              # Drizzle client (Netlify DB adapter, no connection string needed)

netlify/
  database/
    migrations/         # Auto-generated SQL — applied by Netlify on deploy

drizzle.config.ts       # Drizzle Kit config pointing to netlify/database/migrations
```

## Database

Two Postgres tables managed by Netlify Database:

- `production_requests` — label request records
- `chat_messages` — group chat messages

After any schema change in `db/schema.ts`, run `npx drizzle-kit generate` then deploy. Netlify applies migrations automatically. Never run `drizzle-kit migrate` or `drizzle-kit push`.

## Server Functions

All database access uses TanStack Start server functions (`createServerFn`) in `src/server/`. Called from React via `useServerFn`. Pattern: `.inputValidator(...).handler(...)`.

## Session / Auth

User identity (department + production line) is stored in `sessionStorage`. No passwords or auth system — matches original design. Status editing and clear-all use a hardcoded password (`fauzann`).

## Auto-Refresh

`setInterval` at 5-second intervals fetches `getRequests` + `getMessages` while a user is logged in.

## Conventions

- Constants (article names, line options, etc.) live at the top of `src/routes/index.tsx`
- Tailwind v4 — no config file needed
- All data flows through server functions; no direct DB imports in route files
