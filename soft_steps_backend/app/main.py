from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.services.database import connect_to_mongo, close_mongo_connection
from app.routes import auth, reflection

app = FastAPI(title=settings.PROJECT_NAME)

# CORS middleware - allows your React Native app to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Events
@app.on_event("startup")
async def startup_db_client():
    connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    close_mongo_connection()

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_PREFIX}/auth", tags=["auth"])
app.include_router(
    reflection.router,
    prefix=f"{settings.API_V1_PREFIX}/reflection",
    tags=["reflection"]
)

@app.get("/")
async def root():
    return {"message": "Welcome to Soft Steps API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}