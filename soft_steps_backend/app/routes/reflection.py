from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo import ReturnDocument
from datetime import datetime, timezone
from app.core.security import get_current_user
from app.models.reflection import (
    ReflectionSessionCreate,
    ReflectionSessionResponse,
    ReflectionSessionDetailResponse,
    ReflectionMoodUpdate,
    ReflectionMessage,
    StepId,
    StepType,
)
from app.services.database import get_database

router = APIRouter()

#Helpers
def ensure_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    
    return value.astimezone(timezone.utc)

def serialize_sessions(document: dict) -> dict:
    return{
        "id": str(document["_id"]),
        "step_id": document["step_id"],
        "step_title": document["step_title"],
        "step_status": document["step_status"],
        "step_type": document["step_type"],
        "mood_score": document["mood_score"],
        "created_at": ensure_utc(document["created_at"]),
        "updated_at": ensure_utc(document["updated_at"]),
    }

def serialize_message(document: dict) -> dict:
    return {
        "id": str(document["_id"]),
        "session_id": document["session_id"],
        "role": document["role"],
        "text": document["text"],
        "created_at": ensure_utc(document["created_at"]),
    }

#Chat endpoint
@router.post("/chat")
async def reflection_chat(
    data: ReflectionMessage,
    current_user: dict = Depends(get_current_user)
    ):

    user_message = data.message

    return {
        "reply": "Thank you for sharing that. It sounds like you’re taking a brave step by reflecting on how this felt. Try to be gentle with yourself — small steps still count.",
        "received_message": user_message,
        "created_at": datetime.utcnow().isoformat()
    }

#Create a session
@router.post(
    "/sessions",
    response_model=ReflectionSessionResponse,
    status_code=status.HTTP_201_CREATED,
)

async def create_reflection_session(
    session: ReflectionSessionCreate,
    current_user: dict = Depends(get_current_user),
):
    db = get_database()
    user_id = str(current_user["_id"])

    try:
        step_object_id = ObjectId(session.step_id)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Step not found",
        )

    if session.step_type == "active":
        step = db.brave_steps.find_one({
            "_id": step_object_id,
            "user_id": user_id,
        })
        step_status = "in_progress"
    else:
        step = db.accomplishments.find_one({
            "_id": step_object_id,
            "user_id": user_id,
        })
        step_status = "completed"

    if not step:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Step not found",
        )

    now = datetime.now(timezone.utc)

    session_document = {
        "user_id": user_id,
        "step_id": session.step_id,
        "step_title": step["title"],
        "step_status": step_status,
        "step_type": session.step_type,
        "mood_score": session.mood_score,
        "created_at": now,
        "updated_at": now,
    }

    result = db.reflection_sessions.insert_one(session_document)

    return {
        "id": str(result.inserted_id),
        "step_id": session_document["step_id"],
        "step_title": session_document["step_title"],
        "step_status": session_document["step_status"],
        "step_type": session_document["step_type"],
        "mood_score": session_document["mood_score"],
        "created_at": session_document["created_at"],
        "updated_at": session_document["updated_at"],
    }


#List all sessions for a step
@router.get("/sessions",
            response_model=list[ReflectionSessionResponse])
async def list_reflection_sessions(
    step_id: StepId,
    step_type: StepType,
    current_user: dict = Depends(get_current_user)):

    db = get_database()
    user_id = str(current_user["_id"])

    cursor = db.reflection_sessions.find({
        "user_id": user_id,
        "step_id": step_id,
        "step_type": step_type
    }).sort("updated_at", -1)

    return [
        serialize_sessions(document)
        for document in cursor
    ]


#Return a single Detailed Session (With Message History)
@router.get("/sessions/{session_id}",
            response_model=ReflectionSessionDetailResponse)

async def get_reflection_session(
    session_id: str,
    current_user: dict = Depends(get_current_user)   
):
    db = get_database()
    user_id = str(current_user["_id"])

    try:
        session_object_id = ObjectId(session_id)
    except InvalidId:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail="Reflection session not found",
        )
    
    session_document = db.reflection_sessions.find_one({
        "_id": session_object_id,
        "user_id": user_id,
    })

    if session_document is None:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail="Reflection session not found",
        )
    
    message_cursor = db.reflection_messages.find({
        "_id": session_id,
        "user_id": user_id,
    }).sort("created_at", 1)

    response = serialize_sessions(session_document)
    response["messages"] = [
        serialize_message(message)
        for message in message_cursor
    ]
    
    return response

#NOT REQUIRED: Updated mood in reflection session
@router.patch("/sessions/{session_id}/mood",
              response_model=ReflectionSessionResponse)

async def update_reflection_mood(
    session_id: str,
    mood: ReflectionMoodUpdate,
    current_user: dict = Depends(get_current_user),
):
    db = get_database()
    user_id = str(current_user["_id"])

    try:
        session_object_id = ObjectId(session_id)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reflection session not found"
        )
    
    updated_session = db.reflection_sessions.find_one_and_update(
        {
            "_id": session_object_id,
            "user_id": user_id,
        },
        {
            "$set": {
                "mood_score": mood.mood_score,
                "updated_at": datetime.now(timezone.utc),
            }
        },
        return_document=ReturnDocument.AFTER,
    )

    if not updated_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reflection session not found",
        )
    
    return serialize_sessions(updated_session)
