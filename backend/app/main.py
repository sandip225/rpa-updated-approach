from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, users, services, applications, demo_government_simple as demo_government, services_api, whatsapp, documents, services_data, portal_redirect, torrent_power, proxy
from app.config import get_settings

settings = get_settings()

# Create database tables (only creates if they don't exist)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Unified Portal for Gas, Electricity, Water & Property Services with Chrome Extension Automation",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:5173",
        "http://54.167.51.207",
        "http://52.204.134.92",
        "https://52.204.134.92",
        "http://54.235.42.222",
        "https://54.235.42.222",
        "http://localhost",
        "http://50.19.189.29:3000",
        "http://50.19.189.29:8000",
        "http://50.19.189.29",
        "https://50.19.189.29:3000",
        "https://50.19.189.29:8000",
        "https://50.19.189.29"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(services.router)
app.include_router(services_api.router)
app.include_router(services_data.router)
app.include_router(portal_redirect.router)
app.include_router(applications.router)
app.include_router(documents.router)
app.include_router(demo_government.router)
app.include_router(whatsapp.router)
app.include_router(torrent_power.router)
app.include_router(proxy.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to Unified Services Portal",
        "services": ["Electricity", "Gas", "Water", "Property"],
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
