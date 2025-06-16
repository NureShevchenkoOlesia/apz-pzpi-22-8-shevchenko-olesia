from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import BaseModel, EmailStr
import logging
from fastapi import APIRouter
from datetime import datetime, timedelta
from api.models import EmailSchema

conf = ConnectionConfig(
    MAIL_USERNAME="olesia.shevchenko245@gmail.com",
    MAIL_PASSWORD="wfhb dvkc dhpp vhyy", 
    MAIL_FROM="olesia.shevchenko245@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_FROM_NAME="Cosmorum",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

router = APIRouter()

async def send_email(email: EmailSchema):
    try:
        message = MessageSchema(
            subject=email.subject,
            recipients=[email.email], 
            body=email.body,
            subtype="plain"
        )

        fm = FastMail(conf)
        await fm.send_message(message)
        logging.info(f"Email sent to {email.email}")
    except Exception as e:
        logging.error(f"Failed to send email to {email.email}: {str(e)}")

async def send_subscription_email(user_email: str, event_title: str):
    email = EmailSchema(
        email=user_email,
        subject="Subscription to Astronomical Event",
        body=f"Hello from the Cosmorum team! You've successfully subscribed to the event: {event_title}"
    )
    await send_email(email)

def send_event_reminders():
    from api.db import astronomical_events
    tomorrow = datetime.utcnow().date() + timedelta(days=1)
    start = datetime.combine(tomorrow, datetime.min.time())
    end = datetime.combine(tomorrow, datetime.max.time())

    events = astronomical_events.find({
        "start_time": {"$gte": start, "$lte": end},
        "subscribers": {"$exists": True, "$ne": []}
    })

    for event in events:
        title = event.get("title", "Astronomical Event")
        date_str = event.get("start_time").strftime("%Y-%m-%d %H:%M UTC")
        link = event.get("link", "")

        for email in event.get("subscribers", []):
            body = f"Reminder: '{title}' is happening on {date_str}.\n\nMore info: {link}"
            send_email(
                to=email,
                subject=f"Reminder: Upcoming Astronomical Event Tomorrow",
                body=body
            )

@router.get("/send-reminders")
def trigger_reminders():
    send_event_reminders()
    return {"message": "Reminder emails sent."}