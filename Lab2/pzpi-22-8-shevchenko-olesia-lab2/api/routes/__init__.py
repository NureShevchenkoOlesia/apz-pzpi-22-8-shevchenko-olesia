from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["cosmorum"]

collections = ["users", "observations", "astronomical_events"]
for collection in collections:
    if collection not in db.list_collection_names():
        db.create_collection(collection)

if "email_1" not in db.users.index_information():
    db.users.create_index("email", unique=True)

if "created_at_1" not in db.observations.index_information():
    db.observations.create_index("created_at")

if "event_date_1" not in db.astronomical_events.index_information():
    db.astronomical_events.create_index("event_date")

print("You did it!")
