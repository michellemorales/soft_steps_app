from typing import Annotated, Literal
from pydantic import BaseModel, ConfigDict, Field, StrictInt, StringConstraints
from datetime import datetime

#Reusable Types
StepId = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1)
]

StepType = Literal["active", "completed"]
MessageRole = Literal["user", "assistant"]
StepStatus = Literal["in_progress", "completed"]

MoodScore = Annotated[
    StrictInt,
    Field(ge=1, le=10)
]

MessageText = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=4000
    )
]

class ReflectionSessionCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    step_id: StepId
    step_type: StepType
    mood_score: MoodScore | None = None

class ReflectionSessionResponse(BaseModel):
    id: str
    step_id: str
    step_type: StepType
    step_title: str
    step_status: StepStatus
    mood_score: MoodScore | None
    created_at: datetime
    updated_at: datetime


class ReflectionMoodUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    mood_score: MoodScore | None

class ReflectionMessageCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    text: MessageText

class ReflectionMessageResponse(BaseModel):
    id: str
    session_id: str
    role: MessageRole
    text: str
    created_at: datetime

class ReflectionChatResponse(BaseModel):
    user_message: ReflectionMessageResponse
    assistant_message: ReflectionMessageResponse

class ReflectionSessionDetailResponse(ReflectionSessionResponse):
    messages: list[ReflectionMessageResponse]