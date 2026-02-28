# Build stage
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine AS run

WORKDIR /app

ENV NODE_ENV=production
# Solo dependencias de producción para ejecutar el server SSR
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

ENV PORT=4000
EXPOSE 4000

CMD ["node", "dist/frontend/server/server.mjs"]
