from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime
from app.models.accomplishment import AccomplishmentCreate
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

        saved_accomplishment = db.accomplishments.find_one({
            "_id": result.inserted_id,
            "user_id": str(current_user["_id"])
        })

        if not saved_accomplishment:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Accomplishment was saved but could not be retrieved"
            )
        
        saved_accomplishment["id"] = str(saved_accomplishment.pop("_id"))

        return saved_accomplishment

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