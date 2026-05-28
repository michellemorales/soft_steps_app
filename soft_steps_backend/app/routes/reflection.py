from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class ReflectionMessage(BaseModel):
    message: str

@router.post("/chat")
async def reflection_chat(data: ReflectionMessage):
    user_message = data.message

    return {
        "reply": "Thank you for sharing that. It sounds like you’re taking a brave step by reflecting on how this felt. Try to be gentle with yourself — small steps still count.",
        "received_message": user_message,
        "created_at": datetime.utcnow().isoformat()
    }