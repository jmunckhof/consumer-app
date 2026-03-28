# Consumer App Platform

A multi-tenant SaaS platform that lets retail stores get a white-label consumer mobile app. Stores manage their product catalog and app configuration through an admin dashboard.

## Tech Stack

- **Turborepo** monorepo with **Bun** as package manager and runtime
- **TypeScript** across all packages
- **PostgreSQL** with **Drizzle ORM**

## Project Structure

```
apps/
  api/          Hono API server (REST + tRPC)
  web/          TanStack Start admin dashboard
  mobile/       React Native consumer app

packages/
  db/           Drizzle ORM schema and migrations
  trpc/         Shared tRPC router
  validators/   Shared Zod schemas
  ui/           Shared UI components (shadcn + Catalyst)
  config/       Shared TypeScript config
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.2
- [Docker](https://www.docker.com)

### Local Development

```bash
# Install dependencies
bun install

# Start Postgres
docker compose up -d postgres

# Copy env file and configure
cp apps/api/.env.example apps/api/.env

# Push schema to database
bun run db:push

# Start API and dashboard
bun dev
```

The API runs on http://localhost:3000 and the dashboard on http://localhost:3001.

### Docker (full stack)

Run everything in Docker with no local dependencies (besides Docker itself):

```bash
# Dev mode — auto-pushes schema (destructive, dev only)
docker compose --profile dev up --build

# Production mode — runs migrations
docker compose --profile prod up --build

# Just start services (no DB changes)
docker compose up --build
```

## Scripts

| Command | Description |
| --- | --- |
| `bun dev` | Start API + dashboard in dev mode |
| `bun run build` | Build all packages |
| `bun run db:generate` | Generate Drizzle migration files |
| `bun run db:migrate` | Run pending migrations |
| `bun run db:push` | Push schema to DB (dev only) |
| `bun run docker:dev` | Docker Compose with schema push |
| `bun run docker:prod` | Docker Compose with migrations |

## Architecture

### Multi-tenancy

Shared database with `org_id` foreign keys on all tenant-scoped tables. Tenant isolation is enforced via middleware — admin routes use the active org from session, consumer routes derive the org from the authenticated user's `org_id`.

### Authentication

Dual auth system via Better Auth:

- **Admin auth** (`/api/admin/auth`) — dashboard users
- **Consumer auth** (`/api/consumer/auth`) — mobile app users, scoped to a single org

### API

- **tRPC** at `/api/trpc` for the admin dashboard
- **REST** routes for the consumer-facing mobile API
- **Public** store API at `/api/store` (no auth required)
