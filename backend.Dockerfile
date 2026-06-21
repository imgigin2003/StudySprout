FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev --ignore-scripts --prefer-offline --no-audit --no-fund

COPY . .

FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "server.js"]