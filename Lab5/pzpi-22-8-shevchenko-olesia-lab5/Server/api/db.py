from fastapi import Depends
from pymongo import MongoClient
from pymongo.collection import Collection
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
import os

from api.utils.email import send_email

load_dotenv()

client = MongoClient(os.getenv("MONGO_URL", "mongodb://localhost:27017/"))
db = client[os.getenv("DB_NAME", "cosmorum")]

observations: Collection = db["observations"]
users: Collection = db["users"]
astronomical_events: Collection = db["astronomical_events"]

def get_mongo_db():
    return db


def save_observation(observation_id: str, data: dict):
    data["last_modified"] = datetime.now(timezone.utc)
    result = observations.replace_one(
        {"_id": observation_id},
        {"_id": observation_id, **data},
        upsert=True
    )
    return result


def get_observation(observation_id: str):
    return observations.find_one({"_id": observation_id})


def get_all_observations(filter: dict = {}):
    return list(observations.find(filter))



def save_event(events: list[dict]):
    try:
        astronomical_events.insert_many(events)
        print("Events successfully saved to MongoDB.")
    except Exception as e:
        print(f"Error saving events to database: {e}")


def get_all_events():
    return list(astronomical_events.find().sort("event_date"))


def get_event(event_id: str):
    return astronomical_events.find_one({"_id": event_id})


def subscribe_to_event(event_id: str, email: str):
    return astronomical_events.update_one(
        {"_id": event_id},
        {"$addToSet": {"subscribers": email}}
    )

def send_event_notifications():
    today = datetime.now()
    tomorrow = today + timedelta(days=1)

    start_of_day = tomorrow.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = tomorrow.replace(hour=23, minute=59, second=59, microsecond=999999)

    upcoming_events = astronomical_events.find({
        "event_date": {"$gte": start_of_day, "$lt": end_of_day}
    })

    for event in upcoming_events:
        for subscriber in event.get("subscribers", []):
            send_email(
                subscriber,
                f"Reminder: Upcoming Event - {event['title']}",
                f"Dear subscriber,\n\n"
                f"This is a reminder about the upcoming event: {event['title']}\n\n"
                f"Event Date: {event['event_date']}\n"
                f"Description: {event['description']}\n\n"
                f"For more details, visit: {event.get('source_url', 'N/A')}\n\n"
                f"Best regards,\nCosmorum Team"
            )
