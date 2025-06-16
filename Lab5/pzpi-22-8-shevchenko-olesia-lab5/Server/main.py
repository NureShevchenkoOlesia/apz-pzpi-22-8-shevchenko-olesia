from fastapi import FastAPI
from api.routes.upload import router as upload_router
from api.routes.astrometry import router as astrometry_router
from api.routes.observations import router as observations_router
from fastapi.staticfiles import StaticFiles
from api.routes.users import router as users_router
from api.routes.public_users import router as public_users_router
from fastapi.middleware.cors import CORSMiddleware
from api.routes import search, events, subscriptions
from api.utils import email, reset_email
from api import auth
from api.utils.scheduler import start_scheduler
from dotenv import load_dotenv
import os

app = FastAPI()

load_dotenv()

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/upload", tags=["Upload"])
app.include_router(astrometry_router, prefix="/astrometry", tags=["Astrometry"])
app.include_router(observations_router, prefix="/observations", tags=["Observations"])
app.mount("/images", StaticFiles(directory="static/images"), name="images")
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(events.router)
app.include_router(search.router)
app.include_router(public_users_router)
app.include_router(subscriptions.router)
app.include_router(email.router)
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.mount("/exports", StaticFiles(directory="exports"), name="exports")

@app.on_event("startup")
def startup_event():
    start_scheduler()
