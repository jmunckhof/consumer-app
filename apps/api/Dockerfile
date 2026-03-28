FROM oven/bun:1.2-alpine

WORKDIR /app

# Copy root workspace files
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/
COPY packages/db/package.json packages/db/
COPY packages/trpc/package.json packages/trpc/
COPY packages/validators/package.json packages/validators/
COPY packages/config/package.json packages/config/

# Install dependencies with hardlinks (avoids broken symlinks in Docker)
RUN printf '[install]\nnode-linker = "hardlink"\n' > bunfig.toml && bun install

# Copy source code
COPY apps/api apps/api
COPY packages/db packages/db
COPY packages/trpc packages/trpc
COPY packages/validators packages/validators
COPY packages/config packages/config

EXPOSE 3000
CMD ["bun", "run", "apps/api/src/index.ts"]
