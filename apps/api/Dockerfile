FROM node:22.14.0-alpine AS base
RUN npm i -g turbo@^2.3.4


FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune api --docker


FROM base AS installer
RUN apk update
WORKDIR /app


COPY --from=builder /app/out/json/ .
RUN corepack enable
RUN pnpm install --frozen-lockfile
COPY --from=builder /app/out/full/ .
RUN turbo run db:generate
RUN pnpm exec turbo run build

FROM base AS runner
WORKDIR /app
COPY --from=installer /app .
WORKDIR /app/apps/api
CMD ["/bin/sh", "-c", "./start.sh"]
