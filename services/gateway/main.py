from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
from config import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="HarborX API Gateway",
    description="Central API Gateway for HarborX Microservices",
    version="1.0.0",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ServiceUnavailableError(Exception):
    """Raised when a backend service is unavailable."""
    pass


@app.exception_handler(ServiceUnavailableError)
async def service_unavailable_handler(request: Request, exc: ServiceUnavailableError):
    """Handle service unavailable errors with clean error messages."""
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "error": "Service Unavailable",
            "message": "The requested service is currently unavailable. Please try again later.",
            "detail": str(exc)
        }
    )


@app.exception_handler(httpx.RequestError)
async def request_error_handler(request: Request, exc: httpx.RequestError):
    """Handle HTTP request errors."""
    logger.error(f"Request error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "error": "Service Communication Error",
            "message": "Unable to communicate with backend services.",
        }
    )


@app.exception_handler(httpx.HTTPStatusError)
async def http_status_error_handler(request: Request, exc: httpx.HTTPStatusError):
    """Handle HTTP status errors from backend services."""
    logger.error(f"HTTP status error: {exc}")
    
    # Try to parse JSON response, fallback to generic error if not JSON
    try:
        error_content = exc.response.json()
    except (ValueError, AttributeError):
        error_content = {
            "error": "Backend Service Error",
            "message": f"Backend service returned error: {exc.response.status_code}"
        }
    
    return JSONResponse(
        status_code=exc.response.status_code,
        content=error_content
    )


async def forward_request(service_url: str, path: str, request: Request):
    """
    Forward request to a backend service.
    
    Args:
        service_url: Base URL of the service
        path: Path to forward to
        request: Original request
    
    Returns:
        Response from the backend service
    """
    url = f"{service_url}{path}"
    
    # Prepare headers (forward Authorization if present)
    headers = {}
    if "authorization" in request.headers:
        headers["authorization"] = request.headers["authorization"]
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            if request.method == "GET":
                response = await client.get(url, headers=headers, params=request.query_params)
            elif request.method == "POST":
                body = await request.json() if request.headers.get("content-type") == "application/json" else None
                response = await client.post(url, headers=headers, json=body)
            elif request.method == "PUT":
                body = await request.json() if request.headers.get("content-type") == "application/json" else None
                response = await client.put(url, headers=headers, json=body)
            elif request.method == "DELETE":
                response = await client.delete(url, headers=headers)
            else:
                raise HTTPException(status_code=405, detail="Method not allowed")
            
            response.raise_for_status()
            return response.json()
        
        except httpx.RequestError as exc:
            logger.error(f"Request to {url} failed: {exc}")
            raise ServiceUnavailableError(f"Failed to connect to backend service")
        
        except httpx.HTTPStatusError as exc:
            logger.error(f"HTTP error from {url}: {exc}")
            raise


@app.get("/health")
async def health_check():
    """Gateway health check endpoint."""
    # Check if backend services are reachable
    services_status = {}
    
    async with httpx.AsyncClient(timeout=5.0) as client:
        # Check auth service
        try:
            auth_response = await client.get(f"{settings.auth_service_url}/health")
            services_status["auth"] = "healthy" if auth_response.status_code == 200 else "unhealthy"
        except:
            services_status["auth"] = "unreachable"
        
        # Check core service
        try:
            core_response = await client.get(f"{settings.core_service_url}/health")
            services_status["core"] = "healthy" if core_response.status_code == 200 else "unhealthy"
        except:
            services_status["core"] = "unreachable"
    
    overall_status = "healthy" if all(s == "healthy" for s in services_status.values()) else "degraded"
    
    return {
        "status": overall_status,
        "service": "gateway",
        "version": "1.0.0",
        "backend_services": services_status
    }


# Auth routes - Forward to auth service
@app.api_route("/api/v1/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def auth_proxy(path: str, request: Request):
    """Forward authentication requests to auth service."""
    return await forward_request(settings.auth_service_url, f"/api/v1/auth/{path}", request)


# Core routes - Forward to core service
@app.api_route("/api/v1/shipments{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def core_proxy(path: str, request: Request):
    """Forward core business logic requests to core service."""
    return await forward_request(settings.core_service_url, f"/api/v1/shipments{path}", request)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
