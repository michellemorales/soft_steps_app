from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from app.models.brave_steps import AccomplishmentCreate
from app.services.database import get_database
from app.core.security import get_current_user

router = APIRouter(prefix="/accomplishments", tags=["accomplishments"])


@router.post("/")
async def create_accomplishment(
    accomplishment: AccomplishmentCreate,
    current_user: dict = Depends(get_current_user)
):
    try:
        db = get_database()

        data = accomplishment.dict()
        data["completed_at"] = accomplishment.completed_at or datetime.utcnow()
        data["user_id"] = str(current_user["_id"])

        result = db.accomplishments.insert_one(data)

        return {
            "message": "Accomplishment saved",
            "id": str(result.inserted_id),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error saving accomplishment: {str(e)}"
        )


@router.get("/")
async def get_accomplishments(
    current_user: dict = Depends(get_current_user)
):
    try:
        db = get_database()

        accomplishments = []

        #find based on logged-in user
        cursor = db.accomplishments.find({"user_id": str(current_user["_id"])}).sort("completed_at", -1)
        
        for item in cursor:
            item["id"] = str(item["_id"])
            del item["_id"]
            accomplishments.append(item)

        return {"accomplishments": accomplishments}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting accomplishments: {str(e)}"
        )