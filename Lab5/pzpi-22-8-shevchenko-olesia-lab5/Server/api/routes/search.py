from fastapi import APIRouter, Query
from api.db import users, observations

router = APIRouter()

@router.get("/search")
async def search(q: str = Query(..., min_length=1), filter: str = Query("all")):
    users_result = []
    observations_result = []

    if filter in ("all", "users"):
        user_matches = users.find({
            "$or": [
                {"username": {"$regex": q, "$options": "i"}},
                {"bio": {"$regex": q, "$options": "i"}}
            ]
        })
        for user in user_matches:
            users_result.append({
                "id": str(user["_id"]),
                "username": user["username"],
                "avatar_url": user.get("avatar_url", ""),
                "bio": user.get("bio", "")
            })

    if filter in ("all", "observations"):
        observation_matches = observations.find({
            "$or": [
                {"title": {"$regex": q, "$options": "i"}},
                {"description": {"$regex": q, "$options": "i"}},
                {"objects_in_field.name": {"$regex": q, "$options": "i"}}
            ]
        })
        for obs in observation_matches:
            observations_result.append({
                "id": str(obs["_id"]),
                "title": obs["title"],
                "description": obs.get("description", ""),
                "image_url": obs.get("image_url", ""),
                "user_id": str(obs["user_id"])
            })

    elif filter == "objects":
        observation_matches = observations.find({
            "objects_in_field.name": {"$regex": q, "$options": "i"}
        })
        for obs in observation_matches:
            observations_result.append({
                "id": str(obs["_id"]),
                "title": obs["title"],
                "description": obs.get("description", ""),
                "image_url": obs.get("image_url", ""),
                "user_id": str(obs["user_id"])
            })

    return {
        "users": users_result,
        "observations": observations_result
    }
