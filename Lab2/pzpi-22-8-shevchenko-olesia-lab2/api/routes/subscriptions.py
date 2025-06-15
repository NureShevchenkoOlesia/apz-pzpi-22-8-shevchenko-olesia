from fastapi import APIRouter, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import List
from bson import ObjectId
from api.db import astronomical_events
from api.auth import get_current_user
from api.utils.email import send_subscription_email 
from api.models import SubscriptionRequest

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])


@router.post("")
async def subscribe(
    data: SubscriptionRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
):
    user_email = current_user["email"]

    for event_id in data.event_ids:
        event = astronomical_events.find_one({"_id": ObjectId(event_id)})
        if event:
            astronomical_events.update_one(
                {"_id": ObjectId(event_id)},
                {"$addToSet": {"subscribers": user_email}}
            )
            background_tasks.add_task(send_subscription_email, user_email, event["title"])

    return {"message": "Subscribed successfully"}
