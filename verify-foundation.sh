#!/bin/bash
# Quick verification script to check if the foundation is working

set -e

echo "🔍 HarborX Foundation Verification"
echo "===================================="
echo ""

# Check if docker is installed
echo "✓ Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi
echo "  Docker is installed"

# Check if docker-compose is available
echo "✓ Checking Docker Compose..."
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available"
    exit 1
fi
echo "  Docker Compose is available"

# Check if .env file exists
echo "✓ Checking environment configuration..."
if [ ! -f .env ]; then
    echo "  Creating .env from .env.example..."
    cp .env.example .env
fi
echo "  Environment configured"

# Check directory structure
echo "✓ Checking project structure..."
REQUIRED_DIRS=(
    "apps/web"
    "services/gateway"
    "services/auth"
    "services/core"
    "packages/db"
    "infra/docker"
    "docs/adr"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        echo "❌ Missing directory: $dir"
        exit 1
    fi
done
echo "  All required directories exist"

# Check key files
echo "✓ Checking key files..."
REQUIRED_FILES=(
    "docker-compose.yml"
    ".env.example"
    "README.md"
    "apps/web/package.json"
    "services/gateway/main.py"
    "services/auth/main.py"
    "services/core/main.py"
    "packages/db/schema.prisma"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing file: $file"
        exit 1
    fi
done
echo "  All required files exist"

echo ""
echo "✅ Foundation verification passed!"
echo ""
echo "🚀 To start the platform, run:"
echo "   docker compose up --build"
echo ""
echo "📚 Access the application:"
echo "   - Frontend: http://localhost:3000"
echo "   - Gateway:  http://localhost:8000"
echo "   - Auth:     http://localhost:8001"
echo "   - Core:     http://localhost:8002"
