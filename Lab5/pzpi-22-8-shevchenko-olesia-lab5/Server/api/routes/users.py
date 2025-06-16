from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from api.auth import hash_password, verify_password, get_current_user, create_access_token
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from api.db import users, observations
from datetime import timedelta
from bson import ObjectId
import os, shutil, re, json, datetime
from api.models import UserCreate, UserUpdateModel, UserUpdate, UserUpdateProfile
from bson import json_util

router = APIRouter()
AVATAR_DIR = "static/images/avatars"
os.makedirs(AVATAR_DIR, exist_ok=True)
EXPORT_DIR = "exports"
os.makedirs(EXPORT_DIR, exist_ok=True)


@router.post("/register")
async def register(user: UserCreate):
    if users.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")

    user_data = {
        "username": user.username,
        "email": user.email,
        "password": hash_password(user.password),
        "avatar_url": "/photos/home/author.jpg",
        "bio": ""
    }
    result = users.insert_one(user_data)
    return {"message": "User created", "id": str(result.inserted_id)}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    expires_delta = timedelta(hours=2)
    access_token = create_access_token(str(user["_id"]), expires_delta)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "username": user["username"],
            "email": user["email"]
        }
    }

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    if "avatar_url" in current_user and not current_user["avatar_url"].startswith("http"):
        current_user["avatar_url"] = f"http://localhost:8000{current_user['avatar_url']}"
    
    user_id = current_user["id"]
    obs_count = observations.count_documents({"user_id": ObjectId(user_id)})
    
    return {
        "id": current_user["id"],
        "username": current_user["username"],
        "email": current_user["email"],
        "bio": current_user.get("bio", ""),
        "avatar_url": current_user.get("avatar_url", "/photos/home/default-avatar.jpg"),
        "observation_count": obs_count
    }

@router.put("/my")
async def update_user_profile(update: UserUpdateModel, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    result = users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update.dict()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Update failed or no changes made")
    return {"message": "Profile updated successfully"}

@router.put("/me")
async def update_me(
    username: str = Form(...),
    bio: str = Form(...),
    file: UploadFile = File(None),
    current_user: dict = Depends(get_current_user)
):
    update_data = {
        "username": username,
        "bio": bio
    }
    if file:
        safe_filename = file.filename.replace(" ", "_")
        file_location = f"static/avatars/{current_user['id']}_{safe_filename}"

        os.makedirs(os.path.dirname(file_location), exist_ok=True)

        with open(file_location, "wb") as f:
            f.write(await file.read())
        update_data["avatar_url"] = f"/{file_location}"

    users.update_one({"_id": ObjectId(current_user["id"])}, {"$set": update_data})
    print(f"Updated avatar URL: {update_data.get('avatar_url')}")
    return {"message": "Profile updated successfully"}

@router.delete("/me")
async def delete_profile(current_user: dict = Depends(get_current_user)):
    user_id = ObjectId(current_user["id"])
    
    users.delete_one({"_id": user_id})
    observations.delete_many({"user_id": user_id})
    
    return {"message": "User and observations deleted successfully"}

@router.get("/me/observations")
async def get_my_observations(current_user: dict = Depends(get_current_user)):
    user_id = ObjectId(current_user["id"])
    user_observations = list(observations.find({"user_id": user_id}))
    
    for obs in user_observations:
        obs["id"] = str(obs["_id"])
        del obs["_id"]
        obs["user_id"] = str(obs["user_id"])
    
    return user_observations

@router.get("/me/observations/export")
async def export_my_observations(current_user: dict = Depends(get_current_user)):
    user_id = ObjectId(current_user["id"])
    user_observations = list(observations.find({"user_id": user_id}))

    for obs in user_observations:
        obs["id"] = str(obs["_id"])
        del obs["_id"]
        obs["user_id"] = str(obs["user_id"])

    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"export_{current_user['username']}_{timestamp}.json"
    filepath = os.path.join(EXPORT_DIR, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(json_util.dumps(user_observations, indent=2, ensure_ascii=False))

    return { 
        "message": "Observations exported successfully",
        "file_path": f"/{filepath}"
    }