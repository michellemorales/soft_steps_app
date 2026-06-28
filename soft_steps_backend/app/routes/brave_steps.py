from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.models.brave_steps import (BraveStepCreate, BraveStepAIRequest,
                                     BraveStepAIResponse, BraveStepSuggestion)
from app.services.database import get_database
from app.services.brave_step_ai import generate_suggestions

router = APIRouter(prefix="/brave-steps", tags=["brave-steps"])

#This Route will be used to get AI suggestions based on user input.
#Currently returns hard-coded suggestions, later will be changed with AI call
@router.post("/ai-suggestions", response_model=BraveStepAIResponse)
async def suggest_brave_step(request: BraveStepAIRequest):
    generated_suggestions = generate_suggestions(request.user_input)
    return BraveStepAIResponse(suggestions=generated_suggestions)


#This route would be used to save the final user's selection in db
@router.post("/")
async def create_brave_step(brave_step: BraveStepCreate):
    try:
        db = get_database()

        brave_step_data = brave_step.dict()
        brave_step_data["created_at"] = datetime.utcnow()

        result = db.brave_steps.insert_one(brave_step_data)

        return {
            "message": "Brave step saved",
            "id": str(result.inserted_id)
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error saving brave step: {str(e)}"
        )


@router.get("/")
async def get_brave_steps():
    try:
        db = get_database()

        brave_steps = []
        cursor = db.brave_steps.find()

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