from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status, Body, APIRouter
from fastapi.security import OAuth2PasswordBearer
from api.db import users, db
from bson import ObjectId
from uuid import uuid4
from api.utils.reset_email import send_reset_email
from pymongo.collection import Collection
from pydantic import BaseModel, EmailStr

router = APIRouter()

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

reset_tokens: Collection = db.reset_tokens

class EmailRequest(BaseModel):
    email: EmailStr

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(user_id: str, expires_delta: timedelta):
    to_encode = {"sub": user_id}
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    try:
        user = db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid user ID format")

    if user is None:
        raise credentials_exception

    user["id"] = str(user["_id"])
    del user["_id"]
    if "password" in user:
        del user["password"]

    return user

@router.post("/request-password-reset")
async def request_password_reset(data: EmailRequest):
    user = db.users.find_one({"email": data.email})
    if not user:
        return {"message": "If that email exists, a link has been sent."} 

    token = str(uuid4())
    expires_at = datetime.utcnow() + timedelta(minutes=30)

    reset_tokens.insert_one({
        "token": token,
        "user_id": user["_id"],
        "expires_at": expires_at
    })

    send_reset_email(data.email, token)
    return {"message": "Reset link sent."}

@router.post("/reset-password")
async def reset_password(token: str = Body(...), password: str = Body(...)):
    record = reset_tokens.find_one({"token": token})
    if not record:
        raise HTTPException(status_code=400, detail="Invalid token")

    if record["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token expired")

    hashed = hash_password(password)
    db.users.update_one(
        {"_id": record["user_id"]},
        {"$set": {"password": hashed}}
    )
    reset_tokens.delete_one({"_id": record["_id"]})

    return {"message": "Password updated"}
