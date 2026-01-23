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
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
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
    
    TODO: Implement actual authentication against database.
    Currently returns a stub token for development.
    """
    logger.info(f"Login attempt for email: {request.email}")
    
    # TODO: Implement actual authentication
    # 1. Query user from database
    # 2. Verify password
    # 3. Generate JWT token
    
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
    
    TODO: Implement actual user retrieval from JWT token.
    Currently returns stub data for development.
    """
    # TODO: Implement actual user retrieval
    # 1. Extract and verify JWT token from Authorization header
    # 2. Query user from database
    # 3. Return user information
    
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
