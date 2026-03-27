# Consumer App Platform

## What is this?

A multi-tenant SaaS platform that lets retail stores (orgs) get a white-label consumer mobile app for their customers. Stores manage their product catalog and app configuration through an admin dashboard. Apps are generated via a build pipeline based on each org's configuration (theme, features, bundle ID).

## Architecture

- **Monorepo** — Turborepo with Bun as package manager and runtime
- **`apps/api`** — Hono API server running on Bun
  - Dual auth via Better Auth: admin users (`/api/admin/auth`) and consumer users (`/api/consumer/auth`) with separate tables
  - tRPC mounted at `/api/trpc` for the admin frontend
  - REST routes for the consumer-facing mobile API
- **`apps/web`** — TanStack Start admin dashboard
  - TanStack Router (file-based routing)
  - tRPC + TanStack Query for data fetching
  - Tailwind CSS v4
- **`packages/db`** — Drizzle ORM with PostgreSQL
  - Core tables: `orgs`, `apps` (with JSONB config), `products`
  - Separate auth tables for admin (`admin_user`, `admin_session`, etc.) and consumer (`consumer_user`, `consumer_session`, etc.)
  - Consumer users are scoped to a single org via `org_id` FK
- **`packages/trpc`** — Shared tRPC router (org, app, product CRUD) with protected procedures
- **`packages/validators`** — Shared Zod schemas for input validation
- **`packages/config`** — Shared TypeScript configuration

## Multi-tenancy

Shared database with `org_id` foreign keys on all tenant-scoped tables. Tenant isolation is enforced via middleware (admin routes use active org from session, consumer routes derive org from the authenticated user's `org_id`).

## Running locally

```bash
docker compose up -d          # Start Postgres
cd apps/api && bun run dev    # API on :3000
cd apps/web && bun run dev    # Admin UI on :3001
```

<!-- intent-skills:start -->
# Skill mappings - when working in these areas, load the linked skill file into context.
skills:
  - task: "implementing routing with TanStack Router"
    load: "node_modules/.bun/@tanstack+router-core@1.168.4/node_modules/@tanstack/router-core/skills/router-core/SKILL.md"
  - task: "working with TanStack Start (server functions, SSR, middleware, deployment)"
    load: "node_modules/.bun/@tanstack+start-client-core@1.167.4/node_modules/@tanstack/start-client-core/skills/start-core/SKILL.md"
  - task: "setting up or modifying tRPC server routers, procedures, and middleware"
    load: "packages/trpc/node_modules/@trpc/server/skills/trpc-router/SKILL.md"
  - task: "using tRPC with React Query for data fetching"
    load: "apps/web/node_modules/@trpc/tanstack-react-query/skills/react-query-setup/SKILL.md"
  - task: "configuring the TanStack Router bundler plugin or code splitting"
    load: "apps/web/node_modules/@tanstack/router-plugin/skills/router-plugin/SKILL.md"
<!-- intent-skills:end -->
