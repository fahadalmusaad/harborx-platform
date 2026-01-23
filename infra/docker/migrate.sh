#!/bin/bash
# Script to run database migrations

set -e

echo "📦 Installing Prisma dependencies..."
cd packages/db
npm install

echo "🔄 Running database migrations..."
npm run db:migrate:deploy

echo "✅ Database migrations completed successfully!"
