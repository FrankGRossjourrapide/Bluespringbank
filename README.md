# Blue Spring Online Bank

This repository contains a React client and a PostgreSQL-backed API. Authentication, balances, transactions, deposits, and transfers are persisted by the API rather than treated as trusted browser state.

## Local setup

1. Copy `.env.example` to `.env` and set strong secrets.
2. Start PostgreSQL, then run `npm run db:migrate`.
3. Provision the first administrator with `npm run db:seed-admin`.
4. Start the API with `npm run dev:server` and the client with `npm run dev`.

The client uses `VITE_API_URL` when set, otherwise `http://localhost:4000`.

## Production

`Dockerfile` creates a non-root API image. `docker-compose.yml` provides PostgreSQL and an Nginx proxy; run multiple API instances behind a managed load balancer or with `docker compose up --scale api=3`. PostgreSQL should use managed backups, encryption, monitoring, and point-in-time recovery in a real deployment.

API endpoints include `/health/live`, `/health/ready`, `/api/auth/*`, `/api/me`, `/api/me/sections/:section`, `/api/transactions`, `/api/deposits`, `/api/transfers`, `/api/admin/users`, `/api/admin/users/:id/sections/:section`, `/api/admin/accounts/:id`, `/api/admin/transactions/:id`, and `/api/admin/audit-logs`.

Admin changes are role-protected and audited. Profile, preferences, KYC metadata, card records, beneficiaries, and statement records are stored as validated JSON section documents so the admin can manage them from one console. KYC binary files still require an object-storage provider; store only encrypted storage keys and metadata in PostgreSQL. Secrets must be supplied through the deployment environment, never committed to source control.

Before handling real funds, add a regulated payment provider, MFA/WebAuthn, KYC/AML review, fraud controls, idempotency keys, independent security testing, encrypted document storage, and compliance/legal review.
