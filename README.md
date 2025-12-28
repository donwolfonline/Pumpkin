# Pumpkin 🎃

A production-ready, multi-tenant SaaS platform for freelancers and service-based businesses.

## Features

- **CRM** - Manage contacts, leads, and deals
- **Proposals & Contracts** - Create and send professional proposals
- **Scheduling** - Calendar and appointment management
- **Payments & Billing** - Invoicing and Stripe integration
- **Communication** - Email templates and client messaging
- **Automation** - Workflow automation engine
- **Analytics** - Business insights and reporting

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

```
pumpkin/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── ui/           # Shared UI components
│   ├── types/        # Shared TypeScript types
│   ├── utils/        # Shared utilities
│   └── config/       # Shared configuration
└── infrastructure/   # Docker, database migrations
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development database
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# Run database migrations
cd apps/api
npm run migration:run

# Start development servers
npm run dev
```

Visit:

- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:4000>
- API Docs: <http://localhost:4000/api>

## Development

```bash
# Run all apps in development mode
npm run dev

# Build all apps
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

## License

Proprietary - All rights reserved
