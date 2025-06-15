import requests
from pymongo import MongoClient
from datetime import datetime, timedelta

client = MongoClient("mongodb://localhost:27017/")
db = client["cosmorum"]
events_collection = db["astronomical_events"]

API_KEY = "vhJOC7aO8UjviRhZyN73hy0kc8OaJUvh2tYMUD1x"  

NASA_API_BASE_URL = "https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get"

def fetch_flr_events(start_date: str, end_date: str):
    url = f"{NASA_API_BASE_URL}/FLR?startDate={start_date}&endDate={end_date}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def fetch_gst_events(start_date: str, end_date: str):
    url = f"{NASA_API_BASE_URL}/GST?startDate={start_date}&endDate={end_date}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def fetch_recent_donki_events():
    end_date = datetime.utcnow().date()
    start_date = end_date - timedelta(days=30)
    flr = fetch_flr_events(str(start_date), str(end_date))
    gst = fetch_gst_events(str(start_date), str(end_date))
    return {"flr": flr, "gst": gst}
