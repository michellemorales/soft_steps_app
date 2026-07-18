from pymongo import MongoClient
from app.core.config import settings

class Database:
    client: MongoClient = None
    
db = Database()

def get_database():
    return db.client[settings.DATABASE_NAME]

def connect_to_mongo():
    """Connect to MongoDB"""
    db.client = MongoClient(settings.MONGODB_URL)
    print(f"Connected to MongoDB at {settings.MONGODB_URL}")
    print(f"Using database: {settings.DATABASE_NAME}")

def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")

def create_indexes():
    database = get_database()

    database.brave_steps.create_index(
        "user_id",
        unique = True,
        name = "unique_bravestep_user_id"
    )