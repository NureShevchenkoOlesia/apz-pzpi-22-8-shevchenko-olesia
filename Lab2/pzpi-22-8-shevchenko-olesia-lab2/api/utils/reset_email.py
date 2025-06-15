import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv

load_dotenv()

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
EMAIL_FROM = os.getenv("EMAIL_FROM")

def send_reset_email(to_email: str, reset_token: str):
    reset_url = f"{os.getenv('FRONTEND_URL')}/reset-password?token={reset_token}"
    message = Mail(
        from_email=EMAIL_FROM,
        to_emails=to_email,
        subject="Reset your password",
        html_content=f"""
        <p>Hello,</p>
        <p>Click the link below to reset your password:</p>
        <a href="{reset_url}">Reset Password</a>
        <p>This link will expire in 30 minutes.</p>
        """,
    )

    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        sg.send(message)
    except Exception as e:
        print(f"SendGrid Error: {e}")
