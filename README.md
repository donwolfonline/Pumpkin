# Pumpkin 🎃

A production-ready, multi-tenant SaaS platform for freelancers and service-based businesses.

## Features

- **CRM** - Manage contacts, leads, and deals with a mobile-friendly interface
- **Proposals & Contracts** - Create and send professional documents with dynamic templates
- **Scheduling** - Integrated calendar and appointment management
- **Payments & Billing** - Multi-tiered subscription plans (Seedling, Sprout, Big Pumpkin), invoicing, and PDF export
- **Registration Flow** - Integrated signup and secure mock checkout for subscription management
- **Communication** - Email templates and client messaging
- **Automation** - Workflow automation engine
- **Analytics** - Real-time business insights and reporting
- **Mobile Optimized** - Fully responsive design with native-feeling mobile navigation
- **Appointment Management** - Schedule with clients, delete appointments, and get notified
- **Smart Notifications** - Integrated header notifications with a creative popup system
- **Document Vault** - Secure storage for business documents with PDF generation
- **Settings & Preferences** - Comprehensive control over company profile, team members, notifications, and security

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

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm 9+

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd pumpkin
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Setup**
    - Copy `.env.example` to `.env` in `apps/web` and `apps/api`.
    - Update the variables with your configuration.

4. **Start Database**

    ```bash
    docker-compose -f infrastructure/docker/docker-compose.yml up -d
    ```

5. **Run Migrations (Backend)**

    ```bash
    cd apps/api
    npm run migration:run
    ```

6. **Start Development Servers**

    ```bash
    # From root directory
    npm run dev
    ```

Visit:

- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:4000>

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

## Troubleshooting

### Common Issues

- **Port Conflicts**: Ensure ports `3000` (Web) and `4000` (API) are free.
- **Database Connection**: Check if Docker container is running (`docker ps`).
- **Missing Signatures in PDF**: Ensure you have signed the proposal as *both* provider and client to see both signatures.
- **"Proposal Not Found"**: Verify the ID in the URL allows public access and isn't expired.

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
```

## License

Proprietary - All rights reserved
