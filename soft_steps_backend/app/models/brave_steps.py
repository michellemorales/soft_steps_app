from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BraveStepCreate(BaseModel):
    title: str
    situation: Optional[str] = None
    fear_level: Optional[int] = None


class BraveStepResponse(BaseModel):
    id: str
    title: str
    situation: Optional[str] = None
    fear_level: Optional[int] = None
    created_at: datetime