from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, users, services, applications, demo_government_simple as demo_government, services_api, whatsapp, documents, services_data, portal_redirect, torrent_power, torrent_automation, proxy
from .config import get_settings
import threading
import logging

settings = get_settings()
logger = logging.getLogger(__name__)

# Create database tables (only creates if they don't exist)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Unified Portal for Gas, Electricity, Water & Property Services with Chrome Extension Automation",
    version="1.0.0"
)

# CORS middleware - More permissive for localhost development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for localhost development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pre-warm Chrome on startup (in background)
@app.on_event("startup")
async def startup_event():
    """Pre-warm Chrome for faster first automation"""
    def prewarm():
        try:
            logger.info("🔥 Pre-warming Chrome in background...")
            from prewarm_chrome import prewarm_chrome
            prewarm_chrome()
        except Exception as e:
            logger.warning(f"⚠️ Chrome pre-warm failed (not critical): {e}")
    
    # Run in background thread so it doesn't block startup
    thread = threading.Thread(target=prewarm, daemon=True)
    thread.start()
    logger.info("✅ Backend started - Chrome pre-warming in background")

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
app.include_router(torrent_automation.router)
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
