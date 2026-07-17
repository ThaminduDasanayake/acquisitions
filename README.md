# Acquisitions API

A containerized Express.js user management and authentication API configured with Neon serverless PostgreSQL.

---

## Architecture Overview

This application separates development and production database access:
1. **Development Mode:** Uses **Neon Local** via Docker. The application container connects to a local proxy container (`neon-local`) which automatically routes traffic to ephemeral or static feature branches in the Neon cloud.
2. **Production Mode:** Connects directly to the cloud-hosted **Neon Cloud Database** via connection string. No proxy container is utilized.

---

## Configuration files

* **`.env.development`**: Configures the local build environment, routing the database connection to the `neon-local` container port `5432` and setting credentials for the proxy.
* **`.env.production`**: Configures production server endpoints, using the real Neon Cloud database URL.

---

## Local Development (with Neon Local)

### 1. Prerequisites
- **Docker Desktop** installed and running.
- A **Neon Account** with a project created.

### 2. Configure Environment Variables
Copy `.env.example` or modify the created `.env.development`:
```ini
# Server Configurations
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Database URL pointing to the compose-bridge network proxy service
DATABASE_URL=postgresql://neon:npg@neon-local:5432/neondb

# Neon Local proxy settings (retrieve from Neon Console > Project Settings)
NEON_API_KEY=your_neon_api_key
NEON_PROJECT_ID=your_neon_project_id
PARENT_BRANCH_ID=main
```

### 3. Spin up the Development Environment
Run the following command to start both the application and the Neon Local proxy:
```bash
docker compose -f docker-compose.dev.yml up --build
```

**What this does:**
1. Starts the `neon-local` proxy container.
2. `neon-local` talks to the Neon API to spin up an **ephemeral database branch** branched from `PARENT_BRANCH_ID`.
3. The `app` service waits for `neon-local` to be healthy, then runs Drizzle migrations (`npx drizzle-kit migrate`) against the new ephemeral branch.
4. Starts the Node.js process using `npm run dev` with files watched (`./src` volume mount) for hot reloading.
5. Once you stop the compose run (`Ctrl+C` or `docker compose down`), the ephemeral branch is automatically deleted by Neon.

---

## Production Deployment

### 1. Configure Production Environment Variables
Update the values in `.env.production`:
```ini
PORT=3000
NODE_ENV=production
LOG_LEVEL=info

# Direct cloud connection string
DATABASE_URL=postgresql://neondb_owner:<password>@<neon-host>/neondb?sslmode=require
```

### 2. Run the Production Container
Run the production build:
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

**What this does:**
1. Builds the production image (without watch processes or volume mounts).
2. Connects directly to the live serverless Neon database.
3. Exposes the app service on port `3000`.

---

## Database Migrations

### Run Migrations Locally (outside Docker)
If you are developing locally without Docker and have a local database set up:
```bash
npm run db:generate
npm run db:migrate
```

### Run Migrations in Production
To apply migrations on your production Neon instance:
```bash
# Set your production database URL and run
DATABASE_URL=postgresql://... npx drizzle-kit migrate
```
