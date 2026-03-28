FROM oven/bun:1.2-alpine

WORKDIR /app

# Copy root workspace files
COPY package.json bun.lock ./
COPY apps/web/package.json apps/web/
COPY packages/trpc/package.json packages/trpc/
COPY packages/validators/package.json packages/validators/
COPY packages/config/package.json packages/config/
COPY packages/ui/package.json packages/ui/
COPY packages/db/package.json packages/db/

# Install dependencies with hardlinks (avoids broken symlinks in Docker)
RUN printf '[install]\nnode-linker = "hardlink"\n' > bunfig.toml && bun install

# Copy source code
COPY apps/web apps/web
COPY packages/trpc packages/trpc
COPY packages/validators packages/validators
COPY packages/config packages/config
COPY packages/ui packages/ui
COPY packages/db packages/db

EXPOSE 3001
CMD ["bun", "run", "--cwd", "apps/web", "dev", "--host"]
