# Architecture Decision Record: Microservices with API Gateway

**Status:** Accepted  
**Date:** 2024-01-23  
**Decision Makers:** CTO, Engineering Team

## Context

HarborX is a freight management platform targeting the Middle East market. We need to build a scalable, maintainable, and production-ready foundation that can:

1. Support multiple independent services (auth, core business logic, etc.)
2. Handle Arabic and English languages with RTL/LTR support
3. Scale individual components independently
4. Enable parallel development by multiple teams
5. Maintain clear service boundaries and responsibilities

## Decision

We will adopt a **microservices architecture with an API Gateway pattern** for the HarborX platform.

### Architecture Components

#### 1. API Gateway (`services/gateway`)
- **Purpose:** Single entry point for all client requests
- **Responsibilities:**
  - Route requests to appropriate backend services
  - Centralized error handling and mapping
  - CORS configuration
  - Request/response transformation
  - Future: Rate limiting, request logging, API versioning
- **Technology:** FastAPI
- **Port:** 8000

#### 2. Auth Service (`services/auth`)
- **Purpose:** Authentication and authorization
- **Responsibilities:**
  - User authentication (JWT issuance)
  - Token verification
  - RBAC (Role-Based Access Control)
  - User management
- **Technology:** FastAPI
- **Port:** 8001
- **Database:** PostgreSQL (shared)

#### 3. Core Service (`services/core`)
- **Purpose:** Core business logic
- **Responsibilities:**
  - Domain-specific operations (shipments, bookings, etc.)
  - Business rules enforcement
  - Data aggregation
- **Technology:** FastAPI
- **Port:** 8002
- **Database:** PostgreSQL (shared)
- **Cache:** Redis

#### 4. Frontend (`apps/web`)
- **Purpose:** User interface
- **Technology:** Next.js 15, TypeScript, TailwindCSS, shadcn/ui
- **Features:**
  - Multi-language (Arabic/English) with RTL/LTR
  - Dark mode support
  - PWA capabilities
  - Responsive design
- **Port:** 3000

#### 5. Database (`packages/db`)
- **Purpose:** Schema management and migrations
- **Technology:** Prisma
- **Database:** PostgreSQL
- **Port:** 5432

#### 6. Cache (`redis`)
- **Purpose:** Performance optimization, session storage
- **Technology:** Redis
- **Port:** 6379

### Communication Patterns

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP/HTTPS
       ▼
┌─────────────┐
│  Gateway    │ :8000
└──────┬──────┘
       │
       ├──────► Auth Service :8001
       │
       └──────► Core Service :8002
                     │
                     ├──► PostgreSQL :5432
                     │
                     └──► Redis :6379
```

## Consequences

### Positive

1. **Service Independence**
   - Services can be developed, deployed, and scaled independently
   - Different teams can work on different services without conflicts
   - Technology stack can vary per service if needed

2. **Clear Boundaries**
   - Each service has a single, well-defined responsibility
   - Easier to understand and maintain
   - Reduced coupling between components

3. **Scalability**
   - Can scale individual services based on load
   - Auth service can handle high authentication load
   - Core service can scale for business operations

4. **Development Velocity**
   - Parallel development possible
   - Smaller codebases are easier to understand
   - Faster build and test times per service

5. **Fault Isolation**
   - Failure in one service doesn't bring down entire system
   - Gateway can implement circuit breakers
   - Graceful degradation possible

### Negative

1. **Increased Complexity**
   - More services to manage and monitor
   - Network communication adds latency
   - Distributed system challenges (eventual consistency, etc.)

2. **Development Overhead**
   - Docker/docker-compose required for local development
   - More complex debugging across services
   - API contract management needed

3. **Data Management**
   - Shared database requires coordination
   - Future: May need to split databases per service
   - Transaction boundaries across services are complex

### Mitigation Strategies

1. **Docker Compose for Local Development**
   - Single command to start all services
   - Consistent development environment
   - Easy onboarding for new developers

2. **Centralized Schema Management**
   - Prisma manages all database schemas
   - Single source of truth for database structure
   - Python services use SQLAlchemy with matching models

3. **Comprehensive Documentation**
   - ADRs for major decisions
   - README with setup instructions
   - API documentation (future: OpenAPI/Swagger)

4. **CI/CD Pipeline**
   - Automated testing for all services
   - Linting and type checking
   - Pre-merge quality gates

## Alternatives Considered

### 1. Monolithic Architecture
- **Pros:** Simpler to start, easier debugging, no network overhead
- **Cons:** Harder to scale, larger codebase, potential for tight coupling
- **Why Rejected:** Doesn't meet scalability requirements for growth

### 2. Serverless Architecture
- **Pros:** Auto-scaling, pay-per-use, minimal infrastructure management
- **Cons:** Vendor lock-in, cold start latency, complex local development
- **Why Rejected:** Team prefers control over infrastructure, local development complexity

### 3. Modular Monolith
- **Pros:** Balanced approach, clear modules, single deployment
- **Cons:** Still shares resources, harder to scale individual parts
- **Why Rejected:** Wanted clear service boundaries and independent deployment

## Future Considerations

1. **Service Mesh:** As services grow, consider Istio/Linkerd for service-to-service communication
2. **API Gateway Enhancement:** Add rate limiting, request transformation, API versioning
3. **Database per Service:** Consider splitting database when services mature
4. **Event-Driven Architecture:** Introduce message queue (RabbitMQ/Kafka) for async communication
5. **Service Discovery:** Implement Consul/Eureka if moving beyond Docker networking
6. **Observability:** Add centralized logging (ELK) and monitoring (Prometheus/Grafana)

## References

- [Martin Fowler - Microservices](https://martinfowler.com/articles/microservices.html)
- [API Gateway Pattern](https://microservices.io/patterns/apigateway.html)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
