from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import ShipmentListResponse, Shipment
from cache import cache
from datetime import datetime
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="HarborX Core Service",
    description="Core Business Logic Service",
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


@app.on_event("startup")
async def startup_event():
    """Initialize connections on startup."""
    await cache.connect()
    logger.info("Core service started")


@app.on_event("shutdown")
async def shutdown_event():
    """Clean up connections on shutdown."""
    await cache.disconnect()
    logger.info("Core service stopped")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "core",
        "version": "1.0.0"
    }


@app.get("/api/v1/shipments", response_model=ShipmentListResponse)
async def get_shipments():
    """
    Get list of shipments (protected endpoint).
    
    This endpoint demonstrates Redis caching.
    TODO: Implement actual database queries and authentication.
    """
    cache_key = "shipments:list"
    
    # Try to get from cache
    cached_data = await cache.get(cache_key)
    if cached_data:
        logger.info("Returning shipments from cache")
        data = json.loads(cached_data)
        return ShipmentListResponse(**data)
    
    # Generate stub data (TODO: Replace with actual database query)
    logger.info("Generating fresh shipments data")
    shipments = [
        Shipment(
            id="ship-001",
            tracking_number="TRK-2024-001",
            origin="Dubai, UAE",
            destination="Jeddah, Saudi Arabia",
            status="in_transit",
            created_at=datetime.utcnow()
        ),
        Shipment(
            id="ship-002",
            tracking_number="TRK-2024-002",
            origin="Abu Dhabi, UAE",
            destination="Riyadh, Saudi Arabia",
            status="delivered",
            created_at=datetime.utcnow()
        ),
    ]
    
    response = ShipmentListResponse(
        shipments=shipments,
        total=len(shipments)
    )
    
    # Cache for 30 seconds
    await cache.set(cache_key, response.model_dump_json(), expire=30)
    
    return response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
