from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.models.brave_steps import BraveStepCreate
from app.services.database import get_database

router = APIRouter(prefix="/brave-steps", tags=["brave-steps"])


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