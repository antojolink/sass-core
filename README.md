# AntojoLink (`sass-core`)

Backend SaaS multi-tenant API for AntojoLink digital restaurant menus.

## Stack

- **Runtime:** Node.js 20 (CommonJS)
- **Framework:** Express
- **Database:** PostgreSQL 16 + Knex
- **Validation:** Zod
- **Logging & APM:** Pino, pino-http, AWS X-Ray SDK
- **Auth & Storage:** AWS Cognito (`aws-jwt-verify`), AWS S3 Presigned URLs (`@aws-sdk/client-s3`)
- **Testing & Quality:** Jest, Supertest, ESLint v9

## Getting Started

```bash
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

## Docker Compose

```bash
docker compose up --build
```

## Scripts

- `npm start` — Run production server
- `npm run dev` — Run server with file watching
- `npm run migrate` — Run Knex migrations
- `npm run migrate:rollback` — Rollback last migration batch
- `npm run seed` — Run Knex seeds
- `npm run lint` — Run ESLint on `src` and `tests`
- `npm test` — Run Jest test suite with coverage report
