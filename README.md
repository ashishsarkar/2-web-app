# 2-web-app — Booking Frontend

<!-- CI Status — Dynamic badges pulled directly from GitHub Actions (auto-update on every run) -->
[![Unit tests](https://github.com/ashishsarkar/2-web-app/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/ashishsarkar/2-web-app/actions/workflows/unit-tests.yml)
[![Integration tests](https://github.com/ashishsarkar/2-web-app/actions/workflows/integration-tests.yml/badge.svg)](https://github.com/ashishsarkar/2-web-app/actions/workflows/integration-tests.yml)

<!-- Code Quality -->
[![ESLint](https://img.shields.io/badge/code%20style-eslint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![Tested with Jest](https://img.shields.io/badge/tested%20with-jest-C21325?logo=jest&logoColor=white)](https://jestjs.io/)

<!-- Version & License -->
[![GitHub release](https://img.shields.io/github/v/release/ashishsarkar/2-web-app?include_prereleases)](https://github.com/ashishsarkar/2-web-app/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<!-- Stack -->
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/node-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker&logoColor=white)](https://hub.docker.com/)

<!-- Community -->
[![GitHub issues](https://img.shields.io/github/issues/ashishsarkar/2-web-app)](https://github.com/ashishsarkar/2-web-app/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/ashishsarkar/2-web-app/pulls)

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

The badges at the top show the live run status for each workflow, pulled directly from GitHub Actions for `ashishsarkar/2-web-app`.

Workflows live under **`.github/workflows/`**:

- **`unit-tests.yml`** — runs on push/PR to `main`, `develop`, `feature/webapp-ui` when `src/` or `__tests__/` change; runs `npm run test:unit` (Jest, excludes integration).
- **`integration-tests.yml`** — same triggers; runs `npm run test:integration` (Jest + MSW in `__tests__/integration/`).
- **`frontend-ci.yml`** — full security + build + sign pipeline (19 jobs across 6 groups). See below.

### Frontend CI Pipeline (`frontend-ci.yml`)

A comprehensive CI pipeline triggered on push to `main`, `develop`, `release/**`, `feature/**` and PRs to `main`, `develop`, `release/**`.

| Group | Jobs | Tools |
|-------|------|-------|
| **1 — Source Analysis** | Secrets scan, Lint/typecheck, SCA, SBOM generation, Dependency-Track upload, SAST | Gitleaks, ESLint/tsc, OWASP Dependency-Check, npm audit, Syft, Semgrep |
| **2 — Unit Testing** | Jest unit tests with coverage | Jest, Istanbul |
| **3 — Dockerfile Scan** | Hadolint lint, Trivy config scan | Hadolint, Trivy |
| **4 — Build** | Docker image build with BuildKit | Docker Buildx |
| **5 — Image Scan** | Trivy container image vulnerability scan | Trivy |
| **6 — Publish & Sign** | Push to registry, Cosign signing, SBOM attestation, SLSA provenance, signature verification | Docker Hub, Cosign, Syft, slsa-github-generator, Rekor |

Group 6 runs only on `main`, `develop`, and `release/**` branches (not on feature branches or PRs).

**CI config files in this project:**

| File | Purpose |
|------|---------|
| `.gitleaks.toml` | Gitleaks rules and allowlists |
| `.semgrepignore` | Semgrep scan exclusions |
| `.trivyignore` | Trivy CVE suppressions |
| `suppression.xml` | OWASP Dependency-Check false positive suppressions |
| `container-structure-test.yaml` | Google Container Structure Test assertions |
| `.github/dependabot.yml` | Automated dependency updates (npm + GitHub Actions) |
| `.github/CODEOWNERS` | Required reviewers for CI/security file changes |
| `SECRETS.md` | All 17 required GitHub Actions secrets with setup instructions |

**CI infrastructure services** (DefectDojo, Dependency-Track, MinIO, Container Registry) are in `5-ci-infra/`. See `5-ci-infra/README.md`.

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

## Unit test coverage

Tests live next to source files (`*.test.js` / `*.test.jsx`). Run with `npm run test:unit`.

| Test file | Covers |
|-----------|--------|
| `components/ui/Button/Button.test.jsx` | Renders, click |
| `components/ui/Input/Input.test.jsx` | Renders, controlled value |
| `components/ui/Card/Card.test.jsx` | Renders children |
| `components/ui/Modal/Modal.test.jsx` | Open/close, children |
| `components/ui/LocationAutocomplete/LocationAutocomplete.test.jsx` | Input render, dropdown, item select, keyboard (Escape), controlled value, error/disabled |
| `components/shared/PriceDisplay/PriceDisplay.test.jsx` | Price formatting |
| `components/booking/FlightItinerary/FlightItinerary.test.jsx` | Booking display |
| `components/flights/FlightCard/FlightCard.test.jsx` | Airline, route, price, wishlist add/remove |
| `lib/api/booking.test.js` | `createBooking`, `getBookingById`, `cancelBooking` |
| `lib/api/flights.test.js` | `searchFlights`, `getFlightById`, error propagation |
| `lib/api/locations.test.js` | `searchLocations` — params, type filter, size, error |
| `lib/store/currencyStore.test.js` | `setCurrency`, `format()`, `convert()` |
| `lib/constants/routes.test.js` | Static routes, dynamic route helpers |
| `lib/constants/locations.test.js` | `STATIC_LOCATIONS` integrity, `filterStaticLocations` |
| `lib/validations/flights.test.js` | `flightSearchSchema` — required fields, optional returnDate |
| `lib/validations/hotels.test.js` | `hotelSearchSchema` — required fields, checkOut > checkIn |
| `lib/validations/checkout.test.js` | `checkoutSchema` — card, expiry, cvv |

---

## Project layout

- **`src/app/`** — Next.js App Router (marketing, auth, booking, app routes)
- **`src/components/`** — UI, shared, flights, hotels, booking, checkout, chatbot, layout
- **`src/lib/api/`** — API client modules (flights, hotels, booking, confirmations, user, chat, locations)
- **`src/lib/store/`** — Zustand stores
- **`src/lib/validations/`** — Zod schemas
- **`src/lib/constants/`** — `routes.js`, `locations.js` (static fallback dataset + `filterStaticLocations`)
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
- **SECRETS.md** — CI pipeline secrets inventory (17 GitHub Actions secrets with sources, rotation policies, and setup).
- **`5-ci-infra/README.md`** — CI infrastructure stack (DefectDojo, Dependency-Track, MinIO, Container Registry) with credentials and how to run.
