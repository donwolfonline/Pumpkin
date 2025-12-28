#!/bin/bash
set -e

echo "🎃 Starting Pumpkin Development Environment"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    echo "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    echo ""
    echo "After installing Docker, run this script again."
    exit 1
fi

# Start Docker services
echo "📦 Starting Docker services (PostgreSQL, Redis, MailDev)..."
cd infrastructure/docker
docker compose up -d
cd ../..

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📚 Installing root dependencies..."
    npm install
fi

if [ ! -d "apps/api/node_modules" ]; then
    echo "📚 Installing API dependencies..."
    cd apps/api
    npm install
    cd ../..
fi

if [ ! -d "apps/web/node_modules" ]; then
    echo "📚 Installing Web dependencies..."
    cd apps/web
    npm install
    cd ../..
fi

echo ""
echo "✅ Environment ready!"
echo ""
echo "Available services:"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo "  - MailDev UI: http://localhost:1080"
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
