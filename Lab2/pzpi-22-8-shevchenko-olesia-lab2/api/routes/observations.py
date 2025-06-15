import datetime
from fastapi import APIRouter, HTTPException, Path, Depends
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from bson import ObjectId
from api.db import observations, users
from api.auth import get_current_user
from api.models import ObservationModel, ObservationUpdateModel, ObjectInFieldModel
from api.utils.geolocation import geocode_place_name

router = APIRouter()

async def enrich_location_if_needed(location: dict) -> dict:
    place_name = location.get("place_name")
    if place_name and (not location.get("latitude") or not location.get("longitude")):
        lat, lon = await geocode_place_name(place_name)
        if lat is not None and lon is not None:
            location["latitude"] = lat
            location["longitude"] = lon
        else:
            raise HTTPException(status_code=400, detail="Could not resolve location")
    return location

def serialize_doc(doc):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    if "user_id" in doc:
        doc["user_id"] = str(doc["user_id"])
    return doc

async def enrich_location_if_needed(location: dict) -> dict:
    place_name = location.get("place_name")
    if place_name and (not location.get("latitude") or not location.get("longitude")):
        lat, lon = await geocode_place_name(place_name)
        if lat is not None and lon is not None:
            location["latitude"] = lat
            location["longitude"] = lon
        else:
            raise HTTPException(status_code=400, detail="Could not resolve location")
    return location

@router.post("/confirm", response_model=dict)
async def confirm_observation(
    observation: ObservationModel,
    current_user: dict = Depends(get_current_user)
):
    observation_dict = observation.model_dump()
    observation_dict["user_id"] = ObjectId(current_user["id"])

    location = observation_dict.get("location")
    if location:
        location = await enrich_location_if_needed(location)
        observation_dict["location"] = location  

    inserted = observations.insert_one(observation_dict)
    return {"id": str(inserted.inserted_id)}

@router.put("/{observation_id}", response_model=dict)
async def update_observation(
    observation_id: str,
    observation: ObservationUpdateModel
):
    update_data = {k: v for k, v in observation.model_dump(exclude_unset=True).items()}
    update_data["last_modified"] = datetime.datetime.utcnow()

    location = update_data.get("location")
    if location:
        location = await enrich_location_if_needed(location)
        update_data["location"] = location  

    result = observations.update_one(
        {"_id": ObjectId(observation_id)},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Observation not found")
    return {"message": "Observation updated successfully"}

@router.get("/", response_model=List[dict])
async def list_observations():
    results = list(observations.find())
    enriched = []
    for obs in results:
        obs = serialize_doc(obs)
        user = users.find_one({"_id": ObjectId(obs["user_id"])}) if obs.get("user_id") else None
        obs["username"] = user["username"] if user else "Unknown"
        enriched.append(obs)
    return enriched

@router.get("/{observation_id}", response_model=dict)
async def get_observation(observation_id: str = Path(..., title="Observation ID")):
    observation = observations.find_one({"_id": ObjectId(observation_id)})
    if not observation:
        raise HTTPException(status_code=404, detail="Observation not found")

    return serialize_doc(observation)

@router.delete("/{observation_id}", response_model=dict)
async def delete_observation(observation_id: str):
    result = observations.delete_one({"_id": ObjectId(observation_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Observation not found")
    return {"message": "Observation deleted successfully"}

@router.get("/me/observations", response_model=List[dict])
async def get_my_observations(user: dict = Depends(get_current_user)):
    user_id = user["id"]
    obs_cursor = observations.find({"user_id": ObjectId(user_id)})
    obs_list = []

    async for obs in obs_cursor:
        obs_list.append(serialize_doc(obs))

    return obs_list
