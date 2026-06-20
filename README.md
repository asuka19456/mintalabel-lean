# Input New Label

A factory production label request management system. Workers identify themselves by department and production line, then submit label requests for articles. QC staff can update statuses and there's a built-in group chat.

## Key Technologies

- **TanStack Start** — full-stack React framework with file-based routing and server functions
- **Netlify Database** — managed Postgres (via Drizzle ORM) for persistent label requests and chat messages
- **Tailwind CSS v4** — utility-first styling
- **TypeScript** — end-to-end type safety

## Features

- User identification (department + production line selection, no password)
- Label request form with article name, destination, and week inputs
- Live request list with status tracking (wait / done)
- Password-protected status editing (`fauzann`)
- Per-row delete with confirmation
- Group chat sidebar visible to all logged-in users
- Auto-refresh every 5 seconds
- Password-protected clear-all (`fauzann`)

## Running Locally

```bash
npm install
netlify dev
```

The app runs at `http://localhost:8888` by default. Netlify CLI provisions the database automatically.
