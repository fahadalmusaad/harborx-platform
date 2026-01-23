# Prisma Database Package

This package manages the database schema and migrations for HarborX using Prisma.

## Setup

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Open Prisma Studio (Database GUI)
npm run db:studio
```

## Using with Python Services

Prisma is used for schema definition and migrations only. Python services use SQLAlchemy or asyncpg for runtime database access.

### Approach

1. **Schema Management**: Define models in `schema.prisma`
2. **Migrations**: Run `npm run db:migrate` to create and apply migrations
3. **Python Access**: Python services use SQLAlchemy with models that match the Prisma schema

### Example: Python SQLAlchemy Model

```python
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    USER = "USER"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.USER)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)
```

## Scripts

- `db:generate` - Generate Prisma Client
- `db:migrate` - Create and apply migrations (dev)
- `db:migrate:deploy` - Apply migrations (production)
- `db:studio` - Open Prisma Studio
- `db:push` - Push schema changes without migrations (dev only)
