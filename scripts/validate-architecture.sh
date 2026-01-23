#!/bin/bash
# Architecture Readiness Validation Script
# Validates that HarborX platform meets production readiness standards

# Don't exit on errors, we want to complete all checks
set +e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}HarborX Architecture Readiness Check${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""

# Function to check if a file exists
check_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $description"
        ((FAILED++))
        return 1
    fi
}

# Function to check if a directory exists
check_directory() {
    local dir=$1
    local description=$2
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $description"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $description"
        ((FAILED++))
        return 1
    fi
}

# Function to check file content
check_content() {
    local file=$1
    local pattern=$2
    local description=$3
    
    if [ -f "$file" ] && grep -q "$pattern" "$file"; then
        echo -e "${GREEN}✓${NC} $description"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $description"
        ((FAILED++))
        return 1
    fi
}

# Function to warn about optional items
warn_missing() {
    local description=$1
    echo -e "${YELLOW}⚠${NC} $description"
    ((WARNINGS++))
}

echo "=== Architecture Documentation ==="
check_file "docs/adr/0001-architecture.md" "Microservices architecture documented"
check_file "docs/adr/0002-production-readiness-standards.md" "Production readiness standards documented"
check_file "README.md" "Main documentation exists"
check_file "PROJECT_STRUCTURE.md" "Project structure documented"
echo ""

echo "=== Security Configuration ==="
check_file ".github/workflows/codeql.yml" "CodeQL security scanning configured"
check_file ".github/workflows/dependency-review.yml" "Dependency review configured"
check_file ".github/dependabot.yml" "Dependabot configured"
check_file "SECURITY.md" "Security documentation exists"
check_file ".env.example" "Environment variables template exists"

# Check that .env is not committed
if [ ! -f ".env" ] || ! git ls-files --error-unmatch .env > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} .env file not committed to repository"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} .env file should not be committed!"
    ((FAILED++))
fi
echo ""

echo "=== CI/CD Pipeline ==="
check_file ".github/workflows/ci.yml" "CI workflow configured"
check_content ".github/workflows/ci.yml" "lint" "Linting enabled in CI"
check_content ".github/workflows/ci.yml" "build" "Build verification in CI"
echo ""

echo "=== Service Structure ==="
check_directory "services/gateway" "API Gateway service exists"
check_directory "services/auth" "Auth service exists"
check_directory "services/core" "Core service exists"
check_directory "apps/web" "Frontend application exists"
check_directory "packages/db" "Database package exists"
echo ""

echo "=== Service Health Checks ==="
check_content "services/gateway/main.py" "health" "Gateway health check endpoint"
check_content "services/auth/main.py" "health" "Auth health check endpoint"
check_content "services/core/main.py" "health" "Core health check endpoint"
echo ""

echo "=== Configuration Files ==="
check_file "docker-compose.yml" "Docker Compose configuration"
check_file "render.yaml" "Render deployment configuration"
check_file ".gitignore" "Git ignore rules"
echo ""

echo "=== Security Best Practices ==="
check_content ".gitignore" ".env" ".env files ignored"
check_content ".gitignore" "node_modules" "Dependencies ignored"
check_content "SECURITY.md" "stub" "Stub implementation warnings documented"

# Check for common security issues
if grep -rE "password[[:space:]]*[:=][[:space:]]*['\"][^'\"]*['\"]" services/ --include="*.py" 2>/dev/null | grep -v "# " | grep -v "password_hash" > /dev/null; then
    echo -e "${RED}✗${NC} Hardcoded passwords found in code"
    ((FAILED++))
else
    echo -e "${GREEN}✓${NC} No hardcoded passwords detected"
    ((PASSED++))
fi

if grep -rEi "(api[_-]?key|api[_-]?secret)[[:space:]]*[:=][[:space:]]*['\"][^'\"]*['\"]" services/ --include="*.py" 2>/dev/null | grep -v "# " > /dev/null; then
    echo -e "${RED}✗${NC} Potential API keys in code"
    ((FAILED++))
else
    echo -e "${GREEN}✓${NC} No API keys detected in code"
    ((PASSED++))
fi
echo ""

echo "=== CORS Configuration ==="
# Check if CORS is properly configured
if grep -r "allow_origins=\[\"\\*\"\]" services/ --include="*.py" > /dev/null; then
    warn_missing "CORS allows all origins (should be restricted in production)"
else
    echo -e "${GREEN}✓${NC} CORS not using wildcard (*)"
    ((PASSED++))
fi
echo ""

echo "=== Dependency Management ==="
check_file "apps/web/package.json" "Frontend dependencies defined"
check_file "services/auth/requirements.txt" "Auth service dependencies defined"
check_file "services/core/requirements.txt" "Core service dependencies defined"
check_file "services/gateway/requirements.txt" "Gateway service dependencies defined"
echo ""

echo "=== Documentation Quality ==="
if [ -f "README.md" ] && [ $(wc -l < README.md) -gt 100 ]; then
    echo -e "${GREEN}✓${NC} README is comprehensive (>100 lines)"
    ((PASSED++))
else
    warn_missing "README should be more comprehensive"
fi

if [ -f "SECURITY.md" ] && [ $(wc -l < SECURITY.md) -gt 50 ]; then
    echo -e "${GREEN}✓${NC} Security documentation is comprehensive"
    ((PASSED++))
else
    warn_missing "Security documentation could be more detailed"
fi
echo ""

echo "=== Production Deployment Readiness ==="
warn_missing "Tests not implemented (optional but recommended)"
warn_missing "Rate limiting not implemented (required for production)"
warn_missing "Auth stub implementation needs replacement (critical for production)"
warn_missing "Secret scanning requires GitHub organization settings"
warn_missing "Monitoring/observability not configured (recommended)"
echo ""

echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}=================================${NC}"
echo -e "${GREEN}Passed:${NC}   $PASSED"
echo -e "${RED}Failed:${NC}   $FAILED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ Architecture readiness check PASSED${NC}"
    echo -e "${YELLOW}Note: Review warnings for production deployment${NC}"
    exit 0
else
    echo -e "${RED}✗ Architecture readiness check FAILED${NC}"
    echo -e "Fix the failed checks before proceeding"
    exit 1
fi
