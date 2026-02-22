# 2_web-app — Next.js frontend (dev only)
# Build: docker build -t booking-frontend:dev .
# Run:   docker run -p 3000:3000 -v $(pwd):/app 2_web-app

FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY packages/ ./packages/
RUN npm install

COPY . .
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# Point API calls to backend (browser uses this; localhost:4000 = host when frontend in Docker)
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

CMD ["npm", "run", "dev"]
