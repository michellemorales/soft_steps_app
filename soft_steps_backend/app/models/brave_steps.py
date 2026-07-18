from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

#This class receives user input for AI
class BraveStepAIRequest(BaseModel):
    user_input: str

#This class acts as interface for what the AI suggestions should contain
class BraveStepSuggestion(BaseModel):
    title: str
    situation: Optional[str] = None
    fear_level: Optional[int] = None

#This class receives last user_input and last steps generated
class BraveStepAIRetry(BaseModel):
    user_input: str
    previous_suggestions: List[BraveStepSuggestion]

#This class is used for the AI full response to user input
class BraveStepAIResponse(BaseModel):
    suggestions: List[BraveStepSuggestion]

#This class will be used to save user's final selection
class BraveStepCreate(BaseModel):
    title: str
    situation: Optional[str] = None
    fear_level: Optional[int] = None

#To return brave step
class BraveStepResponse(BaseModel):
    id: str
    title: str
    situation: Optional[str] = None
    fear_level: Optional[int] = None
    completed_at: datetime = Field(default_factory=datetime.utcnow)

