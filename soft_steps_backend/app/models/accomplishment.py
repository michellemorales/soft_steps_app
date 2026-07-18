from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AccomplishmentCreate(BaseModel):
    title: str
    completed_at: Optional[datetime] = None


class AccomplishmentResponse(BaseModel):
    id: str
    title: str
    completed_at: datetime