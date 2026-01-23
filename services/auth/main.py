from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from schemas import LoginRequest, TokenResponse, UserMeResponse
from config import settings
from datetime import datetime, timezone
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="HarborX Auth Service",
    description="Authentication and Authorization Service for HarborX platform",
    version="1.0.0",
)

# CORS Configuration
# SECURITY: Default to localhost only for development
# Production MUST configure specific allowed origins via CORS_ORIGINS env var
if hasattr(settings, 'cors_origins') and settings.cors_origins:
    cors_origins = settings.cors_origins.split(',') if isinstance(settings.cors_origins, str) else settings.cors_origins
else:
    # Development-only default: restrict to localhost
    cors_origins = ["http://localhost:3000", "http://localhost:8000"]
    logger.warning("⚠️ CORS using development defaults. Set CORS_ORIGINS for production!")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
@app.get("/healthz")
async def health_check():
    """Health check endpoint for monitoring and load balancers"""
    return {
        "status": "healthy",
        "service": "harborx-auth",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.post("/api/v1/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """
    Login endpoint - Returns JWT token.
    
    ⚠️ SECURITY WARNING: This is a stub implementation for development only!
    
    TODO: Before production deployment, implement:
    1. Query user from database by email
    2. Verify password hash using passlib
    3. Rate limiting to prevent brute force attacks
    4. Account lockout after failed attempts
    5. Audit logging of authentication attempts
    
    DO NOT deploy to production without proper authentication!
    """
    # FAIL-SAFE: Check if we're in production
    if hasattr(settings, 'environment') and settings.environment == 'production':
        logger.error("🚨 CRITICAL: Stub authentication called in production!")
        raise HTTPException(
            status_code=500,
            detail="Authentication not properly configured for production"
        )
    
    logger.warning(f"⚠️ Using stub authentication for development: {request.email}")
    
    # Stub response for development
    from security import create_access_token
    
    # For now, accept any login and return a token
    access_token = create_access_token(
        data={
            "sub": request.email,
            "role": "USER"
        }
    )
    
    return TokenResponse(access_token=access_token)


@app.get("/api/v1/auth/me", response_model=UserMeResponse)
async def get_current_user():
    """
    Get current user information.
    
    ⚠️ SECURITY WARNING: This is a stub implementation for development only!
    
    TODO: Before production deployment, implement:
    1. Extract JWT token from Authorization header
    2. Verify token signature and expiration
    3. Query user from database using token payload
    4. Return actual user information
    
    DO NOT deploy to production without proper authentication!
    """
    # FAIL-SAFE: Check if we're in production
    if hasattr(settings, 'environment') and settings.environment == 'production':
        logger.error("🚨 CRITICAL: Stub /me endpoint called in production!")
        raise HTTPException(
            status_code=500,
            detail="User endpoint not properly configured for production"
        )
    
    logger.warning("⚠️ Using stub /me endpoint without authentication")
    
    # Stub response for development
    return UserMeResponse(
        id="stub-user-id",
        email="user@example.com",
        role="USER",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )


@app.post("/api/v1/auth/verify")
async def verify_token_endpoint(token: str):
    """
    Verify a JWT token and return the payload.
    Used internally by other services.
    """
    from security import verify_token
    
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return {"valid": True, "payload": payload}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
