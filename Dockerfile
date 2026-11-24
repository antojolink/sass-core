FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY package.json knexfile.js ./
COPY src ./src
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["sh", "-c", "npm run migrate && node src/server.js"]
