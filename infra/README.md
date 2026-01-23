# HarborX Infrastructure

This directory contains Docker and infrastructure-related files for HarborX.

## Docker

### docker-compose.yml
Main Docker Compose configuration for local development. Includes:
- PostgreSQL database
- Redis cache
- Auth service
- Core service
- API Gateway
- Next.js web frontend

### Scripts

#### migrate.sh
Run database migrations:
```bash
./infra/docker/migrate.sh
```

Or run directly in Docker:
```bash
docker compose exec gateway sh -c "cd ../packages/db && npm run db:migrate:deploy"
```

## Future Infrastructure

- Kubernetes manifests (when ready for production)
- Render blueprint (for deployment)
- CI/CD deployment scripts
- Infrastructure as Code (Terraform/Pulumi)
