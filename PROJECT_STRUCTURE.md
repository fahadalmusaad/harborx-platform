# HarborX Platform - Project Structure

This document provides a complete overview of the HarborX platform structure.

## Directory Tree

```
harborx-platform/
│
├── .github/
│   ├── workflows/
│   │   └── ci.yml                     # GitHub Actions CI pipeline
│   ├── ISSUE_TEMPLATE/                # Issue templates
│   └── dependabot.yml                 # Dependabot configuration
│
├── apps/
│   └── web/                           # Next.js Frontend Application
│       ├── app/
│       │   ├── [locale]/              # Internationalized routes
│       │   │   ├── layout.tsx         # Locale-specific layout
│       │   │   └── page.tsx           # Home page
│       │   ├── globals.css            # Global styles
│       │   ├── layout.tsx             # Root layout
│       │   └── page.tsx               # Root page (redirects to /en)
│       ├── components/
│       │   ├── layout/
│       │   │   └── header.tsx         # Header component
│       │   └── ui/
│       │       ├── button.tsx         # shadcn/ui Button
│       │       ├── theme-toggle.tsx   # Dark mode toggle
│       │       └── language-toggle.tsx # Language switcher
│       ├── i18n/
│       │   ├── request.ts             # i18n request config
│       │   └── routing.ts             # i18n routing config
│       ├── lib/
│       │   ├── api-client.ts          # Axios API client
│       │   ├── query-provider.tsx     # TanStack Query provider
│       │   ├── theme-provider.tsx     # Theme provider
│       │   └── utils.ts               # Utility functions
│       ├── messages/
│       │   ├── en.json                # English translations
│       │   └── ar.json                # Arabic translations
│       ├── public/
│       │   ├── manifest.json          # PWA manifest
│       │   └── [static assets]
│       ├── .env.local.example         # Environment variables example
│       ├── Dockerfile                 # Docker configuration
│       ├── middleware.ts              # Next.js middleware (i18n)
│       ├── next.config.ts             # Next.js configuration
│       ├── package.json               # Dependencies
│       └── tsconfig.json              # TypeScript configuration
│
├── services/
│   ├── gateway/                       # API Gateway Service (Port 8000)
│   │   ├── config.py                  # Configuration
│   │   ├── main.py                    # FastAPI application
│   │   ├── Dockerfile                 # Docker configuration
│   │   ├── pyproject.toml             # Ruff configuration
│   │   └── requirements.txt           # Python dependencies
│   │
│   ├── auth/                          # Authentication Service (Port 8001)
│   │   ├── config.py                  # Configuration
│   │   ├── database.py                # Database connection
│   │   ├── models.py                  # SQLAlchemy models
│   │   ├── schemas.py                 # Pydantic schemas
│   │   ├── security.py                # JWT & password utilities
│   │   ├── main.py                    # FastAPI application
│   │   ├── Dockerfile                 # Docker configuration
│   │   ├── pyproject.toml             # Ruff configuration
│   │   └── requirements.txt           # Python dependencies
│   │
│   └── core/                          # Core Business Logic Service (Port 8002)
│       ├── cache.py                   # Redis cache utilities
│       ├── config.py                  # Configuration
│       ├── database.py                # Database connection
│       ├── schemas.py                 # Pydantic schemas
│       ├── main.py                    # FastAPI application
│       ├── Dockerfile                 # Docker configuration
│       ├── pyproject.toml             # Ruff configuration
│       └── requirements.txt           # Python dependencies
│
├── packages/
│   └── db/                            # Database Package (Prisma)
│       ├── schema.prisma              # Prisma schema
│       ├── package.json               # Dependencies
│       └── README.md                  # Prisma + Python integration guide
│
├── infra/
│   ├── docker/
│   │   └── migrate.sh                 # Database migration script
│   └── README.md                      # Infrastructure documentation
│
├── docs/
│   └── adr/
│       └── 0001-architecture.md       # Architecture Decision Record
│
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules
├── docker-compose.yml                 # Docker Compose configuration
├── README.md                          # Main documentation
├── IMPLEMENTATION_SUMMARY.md          # Implementation details
├── PROJECT_STRUCTURE.md               # This file
└── verify-foundation.sh               # Verification script

```

## Key Components

### Frontend (apps/web)
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** TailwindCSS v4
- **UI Components:** shadcn/ui
- **Features:**
  - Multi-language (English/Arabic) with RTL/LTR
  - Dark mode with system preference detection
  - PWA support (installable)
  - TanStack Query for data fetching
  - Axios with interceptors for API calls

### Backend Services

#### Gateway (Port 8000)
- **Purpose:** API Gateway and reverse proxy
- **Features:**
  - Routes requests to backend services
  - Centralized error handling
  - CORS configuration
  - Health check aggregation

#### Auth (Port 8001)
- **Purpose:** Authentication and authorization
- **Features:**
  - JWT token generation and verification
  - User management
  - RBAC (Role-Based Access Control)
  - Password hashing with bcrypt

#### Core (Port 8002)
- **Purpose:** Core business logic
- **Features:**
  - Business domain operations
  - Redis caching
  - Database access via SQLAlchemy

### Database
- **Technology:** PostgreSQL
- **Schema Management:** Prisma
- **Python Access:** SQLAlchemy with asyncpg driver

### Infrastructure
- **Local Development:** Docker Compose
- **CI/CD:** GitHub Actions
- **Caching:** Redis

## Port Mapping

| Service    | Port | URL                          |
|------------|------|------------------------------|
| Frontend   | 3000 | http://localhost:3000        |
| Gateway    | 8000 | http://localhost:8000        |
| Auth       | 8001 | http://localhost:8001        |
| Core       | 8002 | http://localhost:8002        |
| PostgreSQL | 5432 | postgresql://localhost:5432  |
| Redis      | 6379 | redis://localhost:6379       |

## API Endpoints

### Gateway (Entry Point)
- `GET /health` - Gateway health + backend status
- `POST /api/v1/auth/login` - User login (proxied to Auth)
- `GET /api/v1/auth/me` - Get current user (proxied to Auth)
- `GET /api/v1/shipments` - List shipments (proxied to Core)

### Auth Service (Internal)
- `GET /health` - Service health check
- `POST /api/v1/auth/login` - Authenticate user
- `GET /api/v1/auth/me` - Get user info
- `POST /api/v1/auth/verify` - Verify JWT token

### Core Service (Internal)
- `GET /health` - Service health check
- `GET /api/v1/shipments` - List shipments (cached)

## Environment Variables

See `.env.example` for complete list. Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_ALGORITHM` - JWT algorithm (HS256)
- `AUTH_SERVICE_URL` - Auth service internal URL
- `CORE_SERVICE_URL` - Core service internal URL
- `FRONTEND_URL` - Frontend URL for CORS
- `NEXT_PUBLIC_API_URL` - API gateway URL (frontend)

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`):

1. **Web Job:**
   - Install dependencies
   - Run ESLint
   - Type check with TypeScript
   - Build production bundle

2. **Services Job:**
   - Install Python dependencies
   - Lint with Ruff
   - Check syntax with compileall

3. **Database Job:**
   - Install Prisma
   - Generate Prisma Client
   - Validate schema

## Security Measures

- ✅ No secrets in code (environment variables only)
- ✅ JWT for authentication
- ✅ Password hashing with bcrypt
- ✅ CORS configured per environment
- ✅ Input validation scaffolding
- ✅ SQL injection prevention (Prisma/SQLAlchemy)
- ✅ Proper error handling

## Quick Start

```bash
# 1. Clone and setup
git clone <repository-url>
cd harborx-platform
cp .env.example .env

# 2. Start all services
docker compose up --build

# 3. Access the application
open http://localhost:3000
```

## Development Workflow

```bash
# Run verification
bash verify-foundation.sh

# Start services individually
docker compose up web
docker compose up gateway
docker compose up auth
docker compose up core

# View logs
docker compose logs -f [service-name]

# Run migrations
bash infra/docker/migrate.sh

# Stop all services
docker compose down
```

## File Count Summary

- **Total Files:** 68
- **Frontend:** 27 files
- **Backend Services:** 20 files
- **Database:** 3 files
- **Infrastructure:** 4 files
- **Documentation:** 5 files
- **Configuration:** 9 files

## Next Steps

See `IMPLEMENTATION_SUMMARY.md` for detailed next steps and development roadmap.
