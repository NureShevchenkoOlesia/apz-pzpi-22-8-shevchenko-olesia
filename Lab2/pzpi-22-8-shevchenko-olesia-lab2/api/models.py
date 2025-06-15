from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl, ConfigDict, EmailStr
from typing import Optional, List, Literal, Dict, Any
from bson import ObjectId

class FlrEvent(BaseModel):
    type: Literal["FLR"] = "FLR"
    title: str
    start_time: str  
    source_location: Optional[str] = None
    class_type: Optional[str] = None
    link: Optional[HttpUrl] = None
    raw_data: Dict[str, Any]
    subscribers: List[ObjectId] = []
    model_config = ConfigDict(arbitrary_types_allowed=True)

class KpIndexEntry(BaseModel):
    observedTime: str
    kp_index: float = Field(..., alias="kpIndex")
    source: Optional[str] = None
    model_config = ConfigDict(validate_by_name=True)

class GstEvent(BaseModel):
    type: Literal["GST"] = "GST"
    title: str
    start_time: str
    kp_index: List[KpIndexEntry] = Field(default_factory=list)
    link: Optional[HttpUrl] = None
    raw_data: Dict[str, Any]
    subscribers: List[ObjectId] = []
    model_config = ConfigDict(validate_by_name=True, arbitrary_types_allowed=True)

class CalibrationModel(BaseModel):
    ra: float
    dec: float
    radius: float
    orientation: float
    pixscale: float
    parity: float

class ObjectInFieldModel(BaseModel):
    name: str

class GeoLocationModel(BaseModel):
    latitude: float
    longitude: float
    place_name: Optional[str] = None

class ObservationModel(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: str
    calibration: CalibrationModel
    objects_in_field: List[ObjectInFieldModel]
    date: datetime = Field(default_factory=datetime.utcnow)
    last_modified: datetime = Field(default_factory=datetime.utcnow)
    location: Optional[GeoLocationModel] = None
    user_id: Optional[str] = None

class ObservationUpdateModel(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    calibration: Optional[CalibrationModel] = None
    objects_in_field: Optional[List[ObjectInFieldModel]] = None
    last_modified: datetime = Field(default_factory=datetime.utcnow)
    location: Optional[GeoLocationModel] = None

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None

class UserUpdateModel(BaseModel):
    username: str
    bio: str
    avatar_url: str

class UserUpdateProfile(BaseModel):
    avatar_url: str = Field(default="/photos/home/author.jpg")
    bio: str = Field(default="")

class EmailSchema(BaseModel):
    email: EmailStr
    subject: str
    body: str

class SubscriptionRequest(BaseModel):
    event_ids: List[str]
