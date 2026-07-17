from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from app.models.brave_steps import (BraveStepCreate, BraveStepAIRequest,
                                     BraveStepAIResponse, BraveStepAIRetry)
from app.services.database import get_database
from app.services.brave_step_ai import generate_suggestions, generate_retry_suggestions
from app.core.security import get_current_user

router = APIRouter(tags=["brave-steps"])

#This Route to get AI suggestions based on user input.
@router.post("/ai-suggestions", response_model=BraveStepAIResponse)
async def suggest_brave_step(request: BraveStepAIRequest):
    generated_suggestions = generate_suggestions(request.user_input)
    return BraveStepAIResponse(suggestions=generated_suggestions)

#Retry Route
@router.post("/ai-suggestions/retry", response_model=BraveStepAIResponse)
async def retry_brave_step_suggestions(request: BraveStepAIRetry):
    generated_suggestions = generate_retry_suggestions(
        request.user_input,
        request.previous_suggestions,
    )
    return BraveStepAIResponse(suggestions=generated_suggestions)


#This route would be used to save the final user's selection in db
@router.post("/")
async def create_brave_step(
    brave_step: BraveStepCreate,
    current_user: dict = Depends(get_current_user)
):
    
    try:
        db = get_database()
        now = datetime.utcnow()

        brave_step_data = brave_step.dict()
        brave_step_data["user_id"] = str(current_user["_id"])
        brave_step_data["updated_at"] = now

        result = db.brave_steps.update_one(
            {"user_id": str(current_user["_id"])},
            {
                "$set": brave_step_data,
                "$setOnInsert": {
                    "created_at": now
                }
            },
            upsert=True
        )

        return {
            "message": "Brave step saved",
            "created": result.upserted_id is not None,
            "id": str(result.upserted_id) if result.upserted_id else None
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error saving brave step: {str(e)}"
        )


@router.get("/")
async def get_brave_steps(
    current_user: dict = Depends(get_current_user)
):
    try:
        db = get_database()

        brave_steps = []
        cursor = db.brave_steps.find({
            "user_id": str(current_user["_id"])
        })

        for step in cursor:
            step["id"] = str(step["_id"])
            del step["_id"]
            brave_steps.append(step)

        return {
            "brave_steps": brave_steps
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting brave steps: {str(e)}"
        )
