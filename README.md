# HarborX Platform

Modern freight management platform for the Middle East, built with a microservices architecture.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Python 3.11+ (for local development)

### One-Command Start

```bash
# Clone the repository
git clone https://github.com/fahadalmusaad/harborx-platform.git
cd harborx-platform

# Copy environment variables
cp .env.example .env

# Start all services
docker compose up --build
```

Access the application:
- **Frontend:** http://localhost:3000
- **API Gateway:** http://localhost:8000
- **Auth Service:** http://localhost:8001
- **Core Service:** http://localhost:8002
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379

## 📁 Project Structure

```
harborx-platform/
├── apps/
│   └── web/                 # Next.js frontend
│       ├── app/            # App router pages
│       ├── components/     # React components
│       ├── lib/            # Utilities and API client
│       └── messages/       # i18n translations
├── services/
│   ├── gateway/            # API Gateway (Port 8000)
│   ├── auth/               # Auth service (Port 8001)
│   └── core/               # Core business logic (Port 8002)
├── packages/
│   └── db/                 # Prisma schema & migrations
├── infra/
│   └── docker/             # Docker configurations
├── docs/
│   └── adr/                # Architecture Decision Records
├── .github/
│   └── workflows/          # CI/CD pipelines
└── docker-compose.yml      # Local development setup
```

## 🏗️ Architecture

HarborX uses a **microservices architecture with API Gateway pattern**:

```
Browser → Gateway (:8000) → Auth Service (:8001)
                          → Core Service (:8002)
                                ↓
                          PostgreSQL (:5432)
                          Redis (:6379)
```

See [ADR-0001](docs/adr/0001-architecture.md) for detailed architecture decisions.

## 🛠️ Development

### Frontend (Next.js)

```bash
cd apps/web

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

**Features:**
- ✅ TypeScript
- ✅ TailwindCSS + shadcn/ui components
- ✅ Dark mode support
- ✅ Multi-language (Arabic/English) with RTL/LTR
- ✅ PWA ready
- ✅ TanStack Query for data fetching
- ✅ Axios with interceptors for API calls

### Backend Services (FastAPI)

```bash
cd services/[service-name]

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --port [PORT]
```

**Available Services:**
- **Gateway** (8000): Request routing, error handling, CORS
- **Auth** (8001): JWT authentication, user management, RBAC
- **Core** (8002): Business logic, shipments, Redis caching

### Database (Prisma)

```bash
cd packages/db

# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Create migration
npm run db:migrate

# Apply migrations (production)
npm run db:migrate:deploy

# Open Prisma Studio
npm run db:studio
```

**Important:** Prisma is used for schema management and migrations only. Python services use SQLAlchemy/asyncpg for runtime database access.

#### Using Database in Python Services

1. Prisma defines the schema in `packages/db/schema.prisma`
2. Run migrations: `npm run db:migrate`
3. Python services use SQLAlchemy models that match the Prisma schema
4. Example in `services/auth/models.py` and `services/core/database.py`

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL=postgresql://harborx:password@postgres:5432/harborx

# Redis
REDIS_URL=redis://redis:6379/0

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_ALGORITHM=HS256

# Services (for Docker networking)
AUTH_SERVICE_URL=http://auth:8001
CORE_SERVICE_URL=http://core:8002

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

**⚠️ Security Notes:**
- Never commit `.env` files
- Use strong, random JWT secrets in production
- Rotate secrets regularly
- Use GitHub Secrets for CI/CD

## 🧪 Testing & CI

### Run CI Checks Locally

```bash
# Frontend
cd apps/web
npm run lint
npm run build

# Backend services
cd services/auth
pip install ruff
ruff check .
python -m compileall -q .

# Database
cd packages/db
npm run db:generate
npx prisma validate
```

### GitHub Actions

CI runs automatically on push and PR:
- ✅ Frontend: lint, type-check, build
- ✅ Services: lint (ruff), syntax check
- ✅ Database: schema validation

## 🌐 API Endpoints

### Health Checks
- `GET /health` - Gateway health (includes backend services status)
- `GET /healthz` - Alternative health check endpoint
- `GET /api/v1/auth/*` - Auth service endpoints
- `GET /api/v1/shipments` - Core service endpoints

### Authentication
- `POST /api/v1/auth/login` - User login (returns JWT)
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/auth/verify` - Verify JWT token (internal use)

### Shipments
- `GET /api/v1/shipments` - List shipments (cached in Redis for 30s)

## 🌍 Multi-Language Support

The frontend supports English and Arabic with automatic RTL/LTR switching:

- **English:** http://localhost:3000/en
- **Arabic:** http://localhost:3000/ar

Add translations in `apps/web/messages/[locale].json`

## 📱 PWA Support

The application is configured as a Progressive Web App:
- Installable on mobile and desktop
- Offline support (basic)
- Manifest: `/public/manifest.json`

## 🐳 Docker Commands

```bash
# Start all services
docker compose up

# Start with rebuild
docker compose up --build

# Stop all services
docker compose down

# View logs
docker compose logs -f [service-name]

# Run migrations in container
docker compose exec gateway sh -c "cd ../packages/db && npm run db:migrate"
```

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker compose ps postgres

# View PostgreSQL logs
docker compose logs postgres

# Reset database
docker compose down -v
docker compose up postgres
```

### Service Not Starting
```bash
# Check service logs
docker compose logs [service-name]

# Rebuild specific service
docker compose up --build [service-name]
```

### Port Already in Use
```bash
# Find process using port
lsof -i :[PORT]  # macOS/Linux
netstat -ano | findstr :[PORT]  # Windows

# Change port in docker-compose.yml or .env
```

## 📚 Documentation

- [Architecture Decision Records](docs/adr/)
- [Database README](packages/db/README.md)
- [Deployment Checklist](docs/DEPLOYMENT_CHECKLIST.md)
- [Render Deployment Architecture](docs/adr/001-render-deployment-architecture.md)

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure CI passes
4. Submit a PR with description

## 📄 License

[Add License Here]

## 🔒 Security

- No secrets in code
- JWT for authentication
- Environment-based configuration
- CORS configured per environment
- Input validation on all endpoints
- SQL injection prevention (Prisma/SQLAlchemy)
- Regular security updates via Dependabot

For security issues, contact: security@harborx.example.com

---

Built with ❤️ for the Middle East freight industry
