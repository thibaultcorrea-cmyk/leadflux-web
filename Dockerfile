# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
# npm plutot que corepack : les images Node recentes (25+) n'embarquent
# plus corepack par defaut, npm si.
RUN npm install -g pnpm@latest

# 1. Dependances (couche cachee tant que les lockfiles ne changent pas)
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# 2. Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# `next build` evalue core/env.ts (Zod) pendant la collecte des pages ; seul
# BETTER_AUTH_SECRET n'a pas de valeur par defaut. Placeholder de build
# uniquement : le vrai secret est injecte au `docker run` (--env-file), qui
# prime toujours sur cet ENV fige dans l'image.
ENV BETTER_AUTH_SECRET="build-time-placeholder-do-not-use-in-prod"

# A l'inverse de BETTER_AUTH_SECRET : les NEXT_PUBLIC_* sont lues cote
# client (lib/auth-client.ts, core/params.ts importe par des hooks "use
# client"), donc inlinees par Next.js dans le JS servi au navigateur des ce
# `pnpm build` — un --env-file au `docker run` arrive trop tard pour elles,
# contrairement a BETTER_AUTH_SECRET qui reste lue cote serveur au runtime.
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GRAPHQL_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GRAPHQL_URL=$NEXT_PUBLIC_GRAPHQL_URL

RUN pnpm build

# 3. Image de prod : uniquement la sortie standalone (cf. next.config.ts)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && chown nextjs:nodejs /app

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000

CMD ["node", "server.js"]
