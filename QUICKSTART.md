# Pumpkin Quick Start Guide

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com/))

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Docker Services

```bash
# Start PostgreSQL, Redis, and MailDev
cd infrastructure/docker
docker compose up -d
cd ../..
```

### 3. Configure Environment

```bash
# Backend
cp apps/api/.env.example apps/api/.env

# Frontend (create .env.local)
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > apps/web/.env.local
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> apps/web/.env.local
```

### 4. Start Development Servers

```bash
# All services (use Turbo)
npm run dev
```

Or run individually:

```bash
# Backend API
cd apps/api
npm run start:dev

# Frontend
cd apps/web
npm run dev
```

## Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | <http://localhost:3000> | - |
| Backend API | <http://localhost:4000/api> | - |
| API Docs (Swagger) | <http://localhost:4000/api/docs> | - |
| PostgreSQL | localhost:5432 | user: `pumpkin`, password: `pumpkin_dev_password`, db: `pumpkin_dev` |
| Redis | localhost:6379 | - |
| MailDev (Email UI) | <http://localhost:1080> | - |

## Common Commands

```bash
# Development
npm run dev          # Start all apps
npm run build        # Build all apps
npm run lint         # Lint code
npm run format       # Format with Prettier
npm run clean        # Clean build artifacts

# Docker
docker compose -f infrastructure/docker/docker-compose.yml up -d     # Start services
docker compose -f infrastructure/docker/docker-compose.yml down      # Stop services
docker compose -f infrastructure/docker/docker-compose.yml logs -f   # View logs

# Database
# Connect to PostgreSQL
docker exec -it pumpkin-postgres psql -U pumpkin -d pumpkin_dev
```

## API Testing

### Register User

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "organizationName": "Test Org"
  }'
```

### Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

## Troubleshooting

### Docker not starting

```bash
# Check Docker is running
docker ps

# Restart Docker Desktop, then:
docker compose -f infrastructure/docker/docker-compose.yml restart
```

### Port conflicts

If ports 3000, 4000, 5432, or 6379 are in use:

```bash
# Find process using port
lsof -ti:3000

# Kill process
kill -9 <PID>
```

### Database connection issues

```bash
# Check PostgreSQL is ready
docker exec pumpkin-postgres pg_isready

# Reset database
docker compose -f infrastructure/docker/docker-compose.yml down -v
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

## Next Steps

1. **Explore API Docs**: Visit <http://localhost:4000/api/docs>
2. **Build UI**: Create auth pages in `apps/web/app/(auth)`
3. **Add CRM Module**: Follow implementation plan
4. **Configure Stripe**: Add test keys to `.env`
5. **Set up OAuth**: Configure Google/GitHub OAuth

## Project Structure

```
pumpkin/
├── apps/
│   ├── api/              # NestJS backend
│   │   ├── src/
│   │   │   ├── modules/  # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   └── tenant/
│   │   │   └── main.ts
│   │   └── .env
│   └── web/              # Next.js frontend
│       ├── app/          # App Router pages
│       ├── components/   # React components
│       ├── lib/          # Utilities
│       └── .env.local
├── packages/
│   └── types/            # Shared TypeScript types
├── infrastructure/
│   └── docker/           # Docker Compose
└── scripts/              # Helper scripts
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeORM Documentation](https://typeorm.io/)
- [Stripe Documentation](https://stripe.com/docs)

---

For detailed architecture and implementation details, see the [Implementation Plan](./implementation_plan.md).
