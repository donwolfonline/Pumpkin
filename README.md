# Pumpkin 🎃

A production-ready, multi-tenant SaaS platform for freelancers and service-based businesses.

## Features

- **Product Showroom** - Detailed deep-dives into CRM, Contracts, Invoicing, Proposals, and Analytics
- **Industry Use Cases** - Tailored solutions for Creatives, Developers, Agencies, and Consultants
- **Resource Hub** - Curated guides, templates, and business tools for solo professionals
- **How It Works** - Interactive 4-step workflow visualization (Onboard, Propose, Execute, Collect)
- **CRM** - Manage contacts, leads, and deals with a mobile-friendly interface
- **Proposals & Contracts** - Create and send professional documents with dynamic templates and dual-signatures
- **Scheduling** - Integrated calendar and appointment management
- **Payments & Billing** - Multi-tiered subscription plans, invoicing, and instant settlements
- **Security & Status** - Real-time system monitoring and bank-grade data encryption
- **Mobile Optimized** - Fully responsive design with native-feeling mobile navigation
- **Smart Notifications** - Integrated header notifications with a creative popup system

## Tech Stack

### Frontend

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**

### Backend

- **NestJS**
- **PostgreSQL**
- **Redis**
- **Stripe**

## Project Structure

```text
pumpkin/
├── apps/
│   ├── web/          # Next.js frontend application
│   │   ├── app/      # App Router pages and layouts
│   │   ├── components/ # Reusable UI components
│   │   ├── lib/      # Utilities and types
│   │   └── public/   # Static assets
│   └── api/          # NestJS backend application
│       ├── src/      # Source code
│       └── test/     # E2E tests
├── packages/
│   ├── types/        # Shared TypeScript types
│   └── ui/           # Shared UI components (optional)
├── infrastructure/   # Docker and deployment config
└── scripts/          # Developer scripts
```

## Getting Started

Follow these steps to set up the project locally for development.

### Prerequisites

- **Node.js**: v18 or later
- **npm**: v9 or later
- **Docker**: For running the database (PostgreSQL) and other services
- **Git**: To clone the repository

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pumpkin
   ```

2. **Install dependencies**
   Install all dependencies for the entire workspace from the root directory:

   ```bash
   npm install
   ```

3. **Environment Configuration**
   The project uses environment variables for configuration. You need to set these up in both the `web` and `api` apps.

   - **Backend (apps/api)**:

     ```bash
     cp apps/api/.env.example apps/api/.env
     ```

   - **Frontend (apps/web)**:

     ```bash
     cp apps/web/.env.example apps/web/.env
     ```

4. **Start Infrastructure (Database)**
   Run the following command to start the PostgreSQL database container:

   ```bash
   docker-compose -f infrastructure/docker/docker-compose.yml up -d
   ```

5. **Initialize Database**
   Run migrations to set up the database schema:

   ```bash
   cd apps/api
   npm run migration:run
   cd ../..
   ```

6. **Start Development Servers**
   From the root directory, start all applications in development mode:

   ```bash
   npm run dev
   ```

   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **API**: [http://localhost:4000](http://localhost:4000)
   - **API Docs**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

## Features & Usage

### 📄 Proposals & Contracts

- **Create Proposals**: Generate professional proposals with dynamic pricing.
- **Dual Signatures**: Provider signs first, then shares via **QR Code** or **Public Link** for client signature.
- **PDF Download**: Automatically generate and download high-quality PDFs of signed documents.

### 💳 Payments

- **Stripe Integration**: Secure payment processing for subscriptions and invoices.
- **Subscription Plans**: Managed via the admin dashboard.

### 📊 CRM & Analytics

- **Dashboard**: Real-time overview of business performance.
- **Client Management**: Track leads and client interactions.

## Development Workflow

### Workspace Overview

This is a monorepo managed with **Turborepo** and **npm workspaces**.

- `apps/web`: Next.js 16 (Turbopack) frontend
- `apps/api`: NestJS backend
- `packages/types`: Shared TypeScript definitions
- `packages/ui`: Shared UI components (using shadcn/ui)

### Common Commands

Run these commands from the **root directory**:

```bash
# Start all apps in watch mode
npm run dev

# Build all packages and applications
npm run build

# Run linting for all workspaces
npm run lint

# Format code with Prettier
npm run format

# Run tests across all workspaces
npm run test
```

### Working with Workspaces

To run a command for a specific workspace:

```bash
# Run dev only for the web app
npm run dev --workspace=web

# Add a package to the api app
npm install <package-name> --workspace=api
```

### Database Management

The backend uses **TypeORM**. Common database commands (run in `apps/api`):

```bash
# Generate a new migration
npm run migration:generate -- src/migrations/MigrationName

# Apply migrations
npm run migration:run

# Revert the last migration
npm run migration:revert
```

## Deployment

### Deploying to Vercel

This project is optimized for deployment on **Vercel** using **Turborepo**.

#### 1. Setup Vercel Project

- Connect your GitHub repository to Vercel.
- Vercel will detect the Turborepo monorepo automatically.

#### 2. Configure Web App (Frontend)

For the frontend application (`apps/web`):

- **Root Directory**: `apps/web` (or `.` if using Turborepo integration)
- **Build Command**: `cd ../.. && npx turbo run build --filter=web`
- **Output Directory**: `.next`
- **Install Command**: `cd ../.. && npm install`

> [!TIP]
> Alternatively, keep the **Root Directory** as `.` and set the **Build Command** to `npx turbo run build --filter=web` and **Output Directory** to `apps/web/.next`.

#### 3. Environment Variables

Ensure the following environment variables are set in the Vercel Dashboard:

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | The production URL of your NestJS API (e.g., `https://api.yourdomain.com/api`) |
| `DATABASE_URL` | Production PostgreSQL connection string (if using Vercel Postgres or external DB) |
| `NEXTAUTH_SECRET` | Secret for authentication |

#### 4. Deploying the API (Backend)

While Next.js is hosted on Vercel, it is recommended to host the **NestJS API** on a platform that supports persistent processes or specialized serverless runners:

- **Options**: [Railway](https://railway.app), [Render](https://render.com), [Fly.io](https://fly.io), or [AWS App Runner](https://aws.amazon.com/apprunner/).
- **Build Command**: `npm run build --workspace=api`
- **Start Command**: `npm run start:prod --workspace=api`

### Production Checklist

- [ ] Set `NODE_ENV` to `production`.
- [ ] Configure production database migrations.
- [ ] Ensure all API endpoints used by the frontend point to the production API URL.
- [ ] Set up Stripe production keys if applicable.

## Troubleshooting

- **Port 4000 already in use**: This is a common issue if a previous backend process didn't terminate correctly. Find the process and kill it: `lsof -i :4000` then `kill -9 <PID>`.
- **Database Connection Refused**: Ensure Docker is running and the database container is healthy: `docker ps`.
- **Turbo Lock Issues**: If you see `Unable to acquire lock`, ensure no other instances of the dev server are running. You may need to manually delete `apps/web/.next/dev/lock`.

## License

Proprietary - All rights reserved
