# 🎃 Pumpkin 🎃

<img width="1430" height="662" alt="Screenshot" src="https://github.com/user-attachments/assets/d825f9ba-f87d-47e0-8470-43fc616a8c90" />

A production-ready, multi-tenant SaaS platform for startups and modern service businesses. Now featuring **Dual AI Assistants** and native mobile support.

## 🌟 New Features (v1.0.0)

### 🤖 Dual AI System

Pumpkin now features two distinct AI personalities tailored to the user's context:

- **Global AI (Sales Focus)**: Lives on the landing page. Helps visitors understand the product, pricing, and features with a friendly, marketing-oriented personality.
- **User Assistant (Support Focus)**: Activated upon login. This **draggable** assistant lives in the dashboard and helps with specific tasks like creating invoices, managing projects, and troubleshooting account issues. It knows your business context!

### 📱 Native Mobile Support

- **Expo / React Native**: A simplified mobile codebase (`apps/expo-mobile`) ready for iOS and Android deployment.
- **Unified Backend**: Mobile app shares the same robust NestJS backend and API as the web platform.

### 🛠 Service Provider Tools

- **Website Builder**: Launch a professional service website with custom domains.
- **Legal Vault**: Verified contract templates with e-signature integration.
- **CRM & Leads**: Auto-capture leads from your public website directly into your dashboard.
- **Project Management**: Kanban boards, task tracking, and file sharing.

---

## Core Features

- **Proposals & Contracts**: Create, send, and e-sign professional documents.
- **Robust PDF Engine**: High-fidelity client-side PDF generation.
- **Payments & Billing**: Stripe integration for subscriptions and invoicing (Apple Pay supported).
- **Security**: Real-time status monitoring, bank-grade encryption, and role-based access.
- **Smart Notifications**: creative popup system for important alerts.

## Tech Stack

### Frontend

- **Next.js 14+** (App Router)
- **React Native / Expo** (Mobile)
- **TypeScript**
- **Tailwind CSS** & **Framer Motion**
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
│   ├── api/          # NestJS backend application
│   └── expo-mobile/  # React Native mobile application
├── packages/
│   ├── types/        # Shared TypeScript types
│   └── ui/           # Shared UI components
├── infrastructure/   # Docker and deployment config
└── scripts/          # Developer scripts
```

## Getting Started

### Prerequisites

- **Node.js**: v18+
- **Docker**: For PostgreSQL/Redis
- **Git**

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

3. **Environment Config**
    Copy `.env.example` to `.env` in `apps/web`, `apps/api`, and `apps/expo-mobile`.

4. **Start Infrastructure**

    ```bash
    docker-compose -f infrastructure/docker/docker-compose.yml up -d
    ```

5. **Initialize Database**

    ```bash
    cd apps/api && npm run migration:run
    ```

6. **Start Development**

    ```bash
    npm run dev
    ```

    - **Web**: [http://localhost:3000](http://localhost:3000)
    - **API**: [http://localhost:4000](http://localhost:4000)

## Deployment

### ⚡️ Quick Deploy

Deploy easily to Vercel (Web) and your preferred cloud provider (API).

1. **Deploy API**: Set up your PostgreSQL database (e.g., Neon) and deploy the `apps/api` folder.
2. **Deploy Web**: Connect the `apps/web` folder to Vercel and set `NEXT_PUBLIC_API_URL` to your live API.

---
*Built with 🎃 by the Pumpkin Team*
