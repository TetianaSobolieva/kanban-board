# Kanban Boards

An anonymous, Trello-style kanban board app. Anyone can create a board, share its ID, and manage
cards across **To Do → In Progress → Done** with drag-and-drop. No login required.

## Demo
 
🔗 **Live app:** [https://kanban-board-1-vmpj.onrender.com/](https://kanban-board-1-vmpj.onrender.com/)
🔗 **API health check:** [https://kanban-board-km6q.onrender.com/health](https://kanban-board-km6q.onrender.com/health)

> Hosted on Render's free tier — the backend spins down after 15 minutes of inactivity, so the
> first request after a pause can take 30–50s while it wakes up.
 
Quick walkthrough:
1. Open the live app and create a board (or paste an existing board ID to open it).
2. Add a few cards to **To Do**.
3. Drag cards between **To Do → In Progress → Done**, or reorder them within a column.
4. Copy the board ID from the header to share the board with someone else.

## Tech stack

| Layer      | Choice                                                                 |
| ---------- | ----------------------------------------------------------------------|
| Frontend   | React 18 (hooks only) + TypeScript + Vite + Redux Toolkit (RTK Query) |
| Drag&Drop  | `@hello-pangea/dnd` (actively maintained `react-beautiful-dnd` fork)  |
| Backend    | Express.js + TypeScript + TypeORM                                     |
| Database   | PostgreSQL                                                             |
| Validation | Zod                                                                    |
| Lint/format| ESLint + Prettier (frontend & backend)                                |
| Testing    | Jest + Supertest (backend), Vitest + Testing Library (frontend)       |
| CI         | GitHub Actions (lint, test, build for both apps)                      |
| Containers | Dockerfiles for both apps + `docker-compose.yml`                      |

## Project structure

```
kanban-boards/
├── backend/            # Express + TypeORM API
│   ├── src/
│   │   ├── entities/       # Board, Card TypeORM entities
│   │   ├── validators/     # Zod request schemas
│   │   ├── services/       # business logic, DB access
│   │   ├── controllers/    # thin HTTP handlers
│   │   ├── routes/         # Express routers
│   │   ├── middlewares/    # error handling, validation
│   │   ├── app.ts          # Express app factory
│   │   └── server.ts       # bootstraps DB + HTTP server
│   └── tests/               # Supertest integration tests
├── frontend/            # React + Redux Toolkit SPA
│   └── src/
│       ├── api/             # RTK Query API slice
│       ├── app/             # store setup
│       ├── components/      # BoardHeader, Column, CardItem, CardModal
│       ├── pages/            # HomePage, BoardPage
│       └── types/            # shared TS types
├── docker-compose.yml    # postgres + backend + frontend
└── .github/workflows/ci.yml
```

## Data model

- **Board**: `id` (10-char nanoid, used as the shareable board ID), `name`, timestamps.
- **Card**: `id` (uuid), `boardId`, `title`, `description`, `column` (`todo` / `in_progress` / `done`),
  `order` (position within its column), timestamps.

Columns are not a separate DB table — every board conceptually has the same fixed three
columns, so a card's `column` enum plus `order` is enough to reconstruct the board layout, and
avoids an unnecessary join for a fixed, non-user-editable structure.

## API

All routes are prefixed with `/api`.

| Method | Path                                  | Description                                   |
|--------|----------------------------------------|------------------------------------------------|
| POST   | `/boards`                              | Create a board — `{ name }`                    |
| GET    | `/boards/:boardId`                     | Get a board with cards grouped by column        |
| PATCH  | `/boards/:boardId`                     | Rename a board — `{ name }`                     |
| DELETE | `/boards/:boardId`                     | Delete a board and its cards                    |
| POST   | `/boards/:boardId/cards`               | Create a card — `{ title, description?, column? }` |
| PATCH  | `/boards/:boardId/cards/:cardId`       | Update a card's title / description / column / order |
| DELETE | `/boards/:boardId/cards/:cardId`       | Delete a card                                   |
| PATCH  | `/boards/:boardId/cards/reorder`       | Bulk-update column/order for cards (drag & drop) |

## Running locally

### Option A — Docker Compose (recommended)

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend health check: http://localhost:4000/health
- Postgres: localhost:5432 (user/pass `postgres` / `postgres`, db `kanban_boards`)

### Option B — run each app manually

You'll need a local Postgres instance (or `docker compose up -d db`).

```bash
# Backend
cd backend
cp .env.example .env   # adjust DB_* values if needed
npm install
npm run dev             # http://localhost:4000

# Frontend (in a second terminal)
cd frontend
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

The dev server proxies `/api/*` requests to `http://localhost:4000`.

## Linting, formatting & tests

```bash
# In either backend/ or frontend/
npm run lint
npm run format:check
npm test
```

Backend tests are integration tests run against a real Postgres database (see
`backend/tests/board.test.ts`); start `docker compose up -d db` first, or point the `DB_*`
env vars at any disposable database.

## Deployment notes

- Each app has a standalone, multi-stage `Dockerfile` producing a small production image
  (Node for the API, Nginx serving the built static SPA and proxying `/api` to the backend).
- `docker-compose.yml` wires Postgres, backend, and frontend together for a one-command deploy
  to any Docker host (Render, Railway, Fly.io, a VPS, etc.). Set `CORS_ORIGIN` on the backend and
  `VITE_API_BASE_URL` on the frontend build if the two are deployed to different origins.
- `.github/workflows/ci.yml` runs ESLint, Prettier, the test suite, and a production build for
  both apps on every push/PR to `main`.

