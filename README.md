# 2-web-app — Booking Frontend

[![Unit tests](https://github.com/OWNER/REPO/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/unit-tests.yml)
[![Integration tests](https://github.com/OWNER/REPO/actions/workflows/integration-tests.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/integration-tests.yml)

Next.js 14 flight & hotel booking frontend. All API calls go to the FastAPI backend (`3-backend-app`).

---

## Dependencies

### Runtime

- **Node.js** 20+ (LTS recommended)
- **npm** (or pnpm / yarn)

### NPM packages

```bash
npm install
```

- **Production:** `next`, `react`, `react-dom`, `axios`, `zustand`, `@tanstack/react-query`, `react-hook-form`, `zod`, `@hookform/resolvers`, `jspdf`, `html2canvas`, `tailwindcss`, `@booking/partner-sdk`
- **Dev / test:** `jest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `msw`, `@playwright/test`, `eslint`, `eslint-config-next`

See `package.json` for exact versions.

### Backend

The app expects the booking API at **`NEXT_PUBLIC_API_BASE_URL`** (default `http://localhost:4000`). Start `3-backend-app` for full functionality.

---

## CI / GitHub Actions

The badges at the top show the latest run status for each workflow. Replace **`OWNER`** and **`REPO`** with your GitHub org/username and repo name (e.g. `ashishsarkar/2-web-app`) so the badges point to your repo.

Workflows live under **`.github/workflows/`** (repo root when this app is the whole repo):

- **`unit-tests.yml`** — runs on push/PR to `main`, `develop`, `feature/webapp-ui` when `src/` or `__tests__/` change; runs `npm run test:unit` (Jest, excludes integration).
- **`integration-tests.yml`** — same triggers; runs `npm run test:integration` (Jest + MSW in `__tests__/integration/`).

- **`paths:`** — workflow runs only when changed files match these globs (`src/**`, `__tests__/**`). Avoids running frontend CI when only docs or other apps change.
- **`working-directory:`** — not used here; steps run from the repo root (this frontend app).

If this app lives inside a **monorepo** (e.g. root has `2-web-app`, `3-backend-app`), use a workflow at the **repository root** `.github/workflows/` that runs these tests with `working-directory: 2-web-app` and `paths: 2-web-app/**`.

---

## How to run the app

### 1. Local development

```bash
cd 2-web-app
npm install
cp .env.example .env.local   # optional; edit if API URL differs
npm run dev
```

- App: **http://localhost:3000**
- Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000` in `.env.local` so the app talks to the backend.

### 2. Production build (local)

```bash
npm run build
npm run start
```

Runs the production server (default port 3000).

### 3. Full stack with Docker Compose

From the repo root (or the folder containing `project-automation-docker-file`):

```bash
cd project-automation-docker-file
docker compose up --build
```

Starts Postgres, MongoDB, Redis, Kafka, RabbitMQ, backend, and frontend. Frontend is on **http://localhost:3000**.

### 4. Frontend only in Docker (dev mode)

```bash
cd 2-web-app
docker build -t booking-frontend .
docker run -p 3000:3000 booking-frontend
```

Uses the Dockerfile’s default `CMD` (`npm run dev`). Ensure the backend is reachable at `http://localhost:4000` from the **host** (e.g. run backend locally or with correct host/port).

### 5. Frontend only in Docker (production build)

Build and run a production image:

```bash
cd 2-web-app
docker build -t booking-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=http://localhost:4000 booking-frontend npm run build && npm run start
```

Or use a multi-stage Dockerfile that runs `npm run build` in the image and `npm run start` as CMD (you can add that if needed).

---

## How to run tests

### Unit tests (Jest + React Testing Library)

- **Run all unit tests** (excludes integration):

```bash
npm run test:unit
```

- **Run all Jest tests** (unit + integration):

```bash
npm run test
```

- **Watch mode:**

```bash
npm run test:watch
```

- **Coverage:**

```bash
npm run test:coverage
```

Unit tests live next to source (e.g. `src/lib/api/booking.test.js`, `src/components/ui/Button.test.jsx`).

### Integration tests (Jest + MSW)

- **Run only integration tests:**

```bash
npm run test:integration
```

Integration tests are in **`__tests__/integration/`** and use MSW to mock the backend (confirmation page, flight search page, checkout flow).

### E2E tests (Playwright)

- **Run E2E tests** (requires app and/or backend; see `e2e/`):

```bash
npm run test:e2e
```

Specs: `e2e/flight-search.spec.js`, `e2e/hotel-search.spec.js`, `e2e/auth-bookings.spec.js`, `e2e/chatbot.spec.js`.

---

## Running the app and tests in Docker

### Run the app in Docker

```bash
cd 2-web-app
docker build -t booking-frontend .
docker run -p 3000:3000 booking-frontend
```

App at **http://localhost:3000**. Backend should be at `http://localhost:4000` on the host.

### Run unit tests in Docker

```bash
cd 2-web-app
docker build -t booking-frontend .
docker run --rm booking-frontend npm run test:unit
```

### Run integration tests in Docker

```bash
cd 2-web-app
docker build -t booking-frontend .
docker run --rm booking-frontend npm run test:integration
```

### Run all Jest tests (unit + integration) in Docker

```bash
docker run --rm booking-frontend npm run test
```

### Run tests with coverage in Docker

```bash
docker run --rm booking-frontend npm run test:coverage
```

### Run E2E tests in Docker

Playwright in Docker usually needs a base image with browser dependencies. Example:

```bash
docker run --rm booking-frontend npx playwright install --with-deps 2>/dev/null; npm run test:e2e
```

For CI, use the official Playwright image (e.g. `mcr.microsoft.com/playwright:v1.40.0-jammy`) or add a stage in the Dockerfile that installs Playwright deps and runs `npm run test:e2e`.

---

## Scripts summary

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server (http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |
| `npm run test` | All Jest tests (unit + integration) |
| `npm run test:unit` | Unit tests only |
| `npm run test:integration` | Integration tests only |
| `npm run test:watch` | Jest watch mode |
| `npm run test:coverage` | Jest with coverage report |
| `npm run test:e2e` | Playwright E2E tests |

---

## Project layout

- **`src/app/`** — Next.js App Router (marketing, auth, booking, app routes)
- **`src/components/`** — UI, shared, flights, hotels, booking, checkout, chatbot, layout
- **`src/lib/api/`** — API client modules (flights, hotels, booking, confirmations, user, chat)
- **`src/lib/store/`** — Zustand stores
- **`src/lib/validations/`** — Zod schemas
- **`__tests__/integration/`** — Integration tests (Jest + MSW)
- **`e2e/`** — Playwright E2E specs
- **`mocks/`** — MSW handlers and fixtures

---

## Environment

- **`.env.local`** (optional): `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`
- See **`.env.example`** for a template.

---

## Docs

- **CURSOR.md** — Project context, routes, API table, conventions, and how to run/tests/Docker for AI and handoff.
