from fastapi import APIRouter, HTTPException
from bson import ObjectId
from api.db import users, observations

router = APIRouter()

@router.get("/users/{user_id}")
async def get_user_profile(user_id: str):
    user = users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    avatar_url = user.get("avatar_url", "/photos/home/default-avatar.jpg")
    if not avatar_url.startswith("http"):
        avatar_url = f"http://localhost:8000{avatar_url}"

    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "bio": user.get("bio", ""),
        "avatar_url": avatar_url,
        "observation_count": observations.count_documents({"user_id": ObjectId(user_id)})
    }

@router.get("/users/{user_id}/observations")
async def get_user_observations(user_id: str):
    obs_list = observations.find({"user_id": ObjectId(user_id)})
    return [{
        "id": str(obs["_id"]),
        "title": obs["title"],
        "description": obs.get("description", ""),
        "image_url": obs.get("image_url", ""),
        "calibration": obs.get("calibration", {}),
        "objects_in_field": obs.get("objects_in_field", [])
    } for obs in obs_list]

