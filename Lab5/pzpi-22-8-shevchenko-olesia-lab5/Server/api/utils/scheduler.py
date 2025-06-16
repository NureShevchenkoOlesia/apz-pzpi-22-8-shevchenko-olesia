from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from api.utils.email import send_subscription_email
from dateutil.parser import isoparse

def send_reminders():
    from api.db import astronomical_events
    tomorrow = datetime.utcnow() + timedelta(days=1)
    tomorrow_date = tomorrow.date()

    events = astronomical_events.find({
        "$or": [
            {"start_time": {"$exists": True}},
            {"event_date": {"$exists": True}}
        ]
    })

    for event in events:
        event_date = event.get("start_time") or event.get("event_date")
        if not event_date:
            continue

        event_datetime = isoparse(event_date)
        if event_datetime.date() == tomorrow_date:
            for email in event.get("subscribers", []):
                send_subscription_email(email, event["title"])

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(send_reminders, "cron", hour=12) 
    scheduler.start()
