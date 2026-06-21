# ── Stage 1: install dependencies ────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts

# ── Stage 2: build the Vite SPA ──────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
RUN npm run build

# ── Stage 3: production runtime ──────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Non-root user — reduces blast radius if server.mjs has a path-traversal bug
RUN addgroup -g 1001 -S app && adduser -S app -u 1001

# Only copy what the server needs at runtime
COPY --from=build --chown=app:app /app/dist        ./dist
COPY --from=build --chown=app:app /app/server.mjs  ./server.mjs
COPY --from=build --chown=app:app /app/package.json ./package.json

USER app

EXPOSE 5173

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5173/ || exit 1

CMD ["node", "server.mjs"]
