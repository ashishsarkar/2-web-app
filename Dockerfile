# --- Original Dockerfile (commented) ---
# FROM node:20-alpine
# WORKDIR /app
#
# COPY package*.json ./
#
# RUN npm install
#
# COPY . .
#
# EXPOSE 3000
# CMD ["npm", "run", "dev"]

# --- Recommended Dockerfile ---

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY packages/ ./packages/

RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install || npm install

# Stage 2: Development (use: docker build --target dev .)
FROM node:20-alpine AS dev
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000
CMD ["pnpm", "run", "dev"]

# # Stage 3: Production build
# FROM node:20-alpine AS builder
# WORKDIR /app

# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# ENV NEXT_TELEMETRY_DISABLED=1

# RUN pnpm run build || npm run build

# # Stage 4: Production runtime (use: docker build --target runner .)
# FROM node:20-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1

# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json

# EXPOSE 3000
# ENV PORT=3000
# ENV HOSTNAME="0.0.0.0"

# CMD ["npx", "next", "start"]