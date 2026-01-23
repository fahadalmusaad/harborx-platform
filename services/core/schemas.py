from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class Shipment(BaseModel):
    id: str
    tracking_number: str
    origin: str
    destination: str
    status: str
    created_at: datetime


class ShipmentListResponse(BaseModel):
    shipments: List[Shipment]
    total: int
