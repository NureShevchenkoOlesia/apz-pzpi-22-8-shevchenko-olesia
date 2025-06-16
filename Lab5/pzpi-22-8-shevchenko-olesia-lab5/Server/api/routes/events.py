from fastapi import APIRouter, Depends, HTTPException
from api.utils.nasa_importer import fetch_recent_donki_events
from api.db import get_mongo_db, db
from api.routes.users import UserCreate
from api.auth import get_current_user
from pymongo.collection import Collection
import json
from bson import ObjectId
from api.models import FlrEvent, KpIndexEntry, GstEvent


router = APIRouter(prefix="/events", tags=["Events"])

@router.post("/import")
def import_donki_events(db=Depends(get_mongo_db)):
    events_collection: Collection = db["astronomical_events"]
    data = fetch_recent_donki_events()
    imported = 0

    for item in data.get("flr", []):
        if not events_collection.find_one({"link": item.get("link")}):
            event = FlrEvent(
                title=f"Solar Flare {item.get('classType', '')}",
                start_time=item.get("beginTime"),
                source_location=item.get("sourceLocation"),
                class_type=item.get("classType"),
                link=item.get("link"),
                raw_data=item
            )
            clean_doc = json.loads(event.json())
            events_collection.insert_one(clean_doc)
            imported += 1

    for item in data.get("gst", []):
        if not events_collection.find_one({"link": item.get("link")}):
            kp_data_raw = item.get("allKpIndex", [])
            try:
                kp_data = [KpIndexEntry(**entry) for entry in kp_data_raw]
                event = GstEvent(
                    title = f"Geomagnetic Storm",
                    start_time=item.get("startTime"),
                    kp_index=kp_data,
                    link=item.get("link"),
                    raw_data=item
                )
                clean_doc = json.loads(event.json(by_alias=True))
                events_collection.insert_one(clean_doc)
                imported += 1
            except Exception as e:
                print(f"Failed to import GST event: {e}")

    return {"imported": imported}

@router.get("/events")
def list_events(db=Depends(get_mongo_db)):
    events_collection: Collection = db["astronomical_events"]
    events = list(events_collection.find().sort("start_time", 1))
    for e in events:
        e["_id"] = str(e["_id"]) 
    return events

@router.post("/events/{event_id}/subscribe")
async def subscribe_to_event(event_id: str, user: UserCreate = Depends(get_current_user)):
    result = await db.events.update_one(
        {"_id": ObjectId(event_id)},
        {"$addToSet": {"subscribers": user.id}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Subscribed"}