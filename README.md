# FuelPass — Fuel Order Booking (QA Challenge App)

A small **fuel order booking** web app for the FuelPass aviation-fuel marketplace.
Used as a **QA take-home coding challenge**.

- **Frontend:** React + TypeScript + Vite + [HeroUI](https://heroui.com/)
- **Backend:** NestJS + TypeScript, **in-memory** data store (no database)
- **No external infrastructure** — no Postgres, no Docker, no Redis.

> **Candidates:** read **[CANDIDATE.md](./CANDIDATE.md)** for your brief.
> Maintainers: the planted issues are documented in `solutions.md` (do **not** share it with candidates).

---

## Prerequisites

- **Node.js ≥ 18.18** and **npm ≥ 9** (that's it — nothing else to install).

## Getting started

```bash
# 1. install all workspace dependencies (root + backend + frontend)
npm install

# 2. start both backend and frontend together
npm run dev
```

- Frontend: **http://localhost:5173**
- Backend API: **http://localhost:3001/api** (e.g. `GET /api/orders`)

The Vite dev server proxies `/api/*` to the backend automatically.

## The app

- **Orders list** (`/`) — table of fuel orders with a status filter.
- **New fuel order** (`/orders/new`) — book fuel for an aircraft (airport, tail number, fuel type, volume, delivery date) with a live estimated total.
- **Order detail** (`/orders/:id`) — read-only summary, status, and next action.

Data lives in memory in the backend and **resets every time the backend restarts**.

## Testing

**No test runner is pre-wired** — this is intentional. How you test is entirely up to
the candidate: set up your own test suite(s) with whatever framework(s) you prefer
(Jest, Vitest, Playwright, Cypress, supertest, …) **and/or** test manually. See
`CANDIDATE.md`.

## Project layout

```
packages/
  backend/    NestJS API + in-memory store   (src/orders/*)
  frontend/   React + HeroUI app             (src/pages/*)
```
