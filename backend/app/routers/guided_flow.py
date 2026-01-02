"""
Guided Flow Router - WhatsApp-style service selection and application submission
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import json
import os

from app.database import get_db
from app.auth import get_current_user
from app.models import User, GuidedFlowApplication

router = APIRouter(prefix="/api/guided-flow", tags=["Guided Flow"])

# Load services data from JSON file
def load_services_data():
    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "services_data.json")
    with open(data_path, "r") as f:
        return json.load(f)

# Pydantic Schemas
class ServiceCategory(BaseModel):
    id: str
    name: str
    nameHindi: str
    icon: str
    gradient: str
    providerCount: int

class Provider(BaseModel):
    id: str
    name: str
    type: str
    portal_url: str
    name_change_url: str
    online_available: bool
    rpa_enabled: bool
    form_fields: List[str]

class ProvidersResponse(BaseModel):
    category: str
    providers: List[Provider]

class ApplicationSubmit(BaseModel):
    category: str
    provider_id: str
    application_type: str
    form_data: dict

class ApplicationResponse(BaseModel):
    success: bool
    tracking_id: str
    message: str
    messageHindi: str
    estimated_time: str

class GuidedFlowApplicationResponse(BaseModel):
    id: int
    tracking_id: str
    category: str
    provider_id: str
    provider_name: str
    application_type: str
    status: str
    form_data: dict
    created_at: datetime
    
    class Config:
        from_attributes = True

# Service Categories with icons and gradients
SERVICE_CATEGORIES = [
    {
        "id": "electricity",
        "name": "Electricity",
        "nameHindi": "बिजली",
        "icon": "zap",
        "gradient": "from-amber-400 to-orange-500"
    },
    {
        "id": "gas",
        "name": "Gas",
        "nameHindi": "गैस",
        "icon": "flame",
        "gradient": "from-red-400 to-rose-600"
    },
    {
        "id": "water",
        "name": "Water",
        "nameHindi": "पानी",
        "icon": "droplets",
        "gradient": "from-cyan-400 to-blue-500"
    },
    {
        "id": "property",
        "name": "Property",
        "nameHindi": "संपत्ति",
        "icon": "building",
        "gradient": "from-emerald-400 to-green-600"
    }
]

def generate_tracking_id(category: str, db: Session) -> str:
    """Generate unique tracking ID in format: {PREFIX}{YEAR}{6-DIGIT-SEQUENCE}"""
    prefix_map = {
        "gas": "GAS",
        "electricity": "ELC",
        "water": "WTR",
        "property": "PRP"
    }
    prefix = prefix_map.get(category, "APP")
    year = datetime.now().year
    
    # Get the latest sequence number for this category and year
    latest = db.query(func.max(GuidedFlowApplication.id)).filter(
        GuidedFlowApplication.category == category
    ).scalar() or 0
    
    sequence = str(latest + 1).zfill(6)
    return f"{prefix}{year}{sequence}"

# API Endpoints

@router.get("/services", response_model=List[ServiceCategory])
def get_services():
    """Get all service categories with provider counts"""
    services_data = load_services_data()
    
    result = []
    for category in SERVICE_CATEGORIES:
        provider_count = len(services_data.get(category["id"], []))
        result.append(ServiceCategory(
            id=category["id"],
            name=category["name"],
            nameHindi=category["nameHindi"],
            icon=category["icon"],
            gradient=category["gradient"],
            providerCount=provider_count
        ))
    
    return result

@router.get("/providers/{category}", response_model=ProvidersResponse)
def get_providers(category: str):
    """Get all providers for a specific service category"""
    services_data = load_services_data()
    
    if category not in services_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category '{category}' not found"
        )
    
    providers = [
        Provider(
            id=p["id"],
            name=p["name"],
            type=p["type"],
            portal_url=p["portal_url"],
            name_change_url=p["name_change_url"],
            online_available=p["online_available"],
            rpa_enabled=p["rpa_enabled"],
            form_fields=p["form_fields"]
        )
        for p in services_data[category]
    ]
    
    return ProvidersResponse(category=category, providers=providers)

@router.post("/applications", response_model=ApplicationResponse)
def submit_application(
    application: ApplicationSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit a new application through guided flow"""
    services_data = load_services_data()
    
    # Validate category
    if application.category not in services_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category: {application.category}"
        )
    
    # Find provider
    providers = services_data[application.category]
    provider = next((p for p in providers if p["id"] == application.provider_id), None)
    
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid provider: {application.provider_id}"
        )
    
    # Generate tracking ID
    tracking_id = generate_tracking_id(application.category, db)
    
    # Create application record
    db_application = GuidedFlowApplication(
        tracking_id=tracking_id,
        user_id=current_user.id,
        category=application.category,
        provider_id=application.provider_id,
        provider_name=provider["name"],
        application_type=application.application_type,
        form_data=application.form_data,
        status="submitted"
    )
    
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    
    # Estimated time based on category
    time_estimates = {
        "gas": "3-5 days",
        "electricity": "3-5 days",
        "water": "5-7 days",
        "property": "15-30 days"
    }
    
    return ApplicationResponse(
        success=True,
        tracking_id=tracking_id,
        message=f"Application submitted successfully! Your tracking ID is {tracking_id}",
        messageHindi=f"आवेदन सफलतापूर्वक जमा हो गया! आपकी ट्रैकिंग आईडी है {tracking_id}",
        estimated_time=time_estimates.get(application.category, "7-10 days")
    )

@router.get("/applications", response_model=List[GuidedFlowApplicationResponse])
def get_user_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all guided flow applications for current user"""
    applications = db.query(GuidedFlowApplication).filter(
        GuidedFlowApplication.user_id == current_user.id
    ).order_by(GuidedFlowApplication.created_at.desc()).all()
    
    return applications

@router.get("/applications/{tracking_id}", response_model=GuidedFlowApplicationResponse)
def get_application_by_tracking_id(
    tracking_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific application by tracking ID"""
    application = db.query(GuidedFlowApplication).filter(
        GuidedFlowApplication.tracking_id == tracking_id,
        GuidedFlowApplication.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application with tracking ID '{tracking_id}' not found"
        )
    
    return application


# ============================================
# Admin Endpoints - Provider Management
# ============================================

class ProviderCreate(BaseModel):
    id: str
    name: str
    type: str  # government or private
    portal_url: str
    name_change_url: str
    address_change_url: Optional[str] = ""
    api_available: bool = False
    online_available: bool = True
    rpa_enabled: bool = False
    form_fields: List[str]

class ProviderUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    portal_url: Optional[str] = None
    name_change_url: Optional[str] = None
    address_change_url: Optional[str] = None
    api_available: Optional[bool] = None
    online_available: Optional[bool] = None
    rpa_enabled: Optional[bool] = None
    form_fields: Optional[List[str]] = None

def save_services_data(data: dict):
    """Save services data to JSON file"""
    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "services_data.json")
    with open(data_path, "w") as f:
        json.dump(data, f, indent=2)

@router.get("/admin/providers", tags=["Admin"])
def get_all_providers_admin():
    """Get all providers grouped by category (Admin)"""
    services_data = load_services_data()
    return services_data

@router.get("/admin/providers/{category}", tags=["Admin"])
def get_category_providers_admin(category: str):
    """Get all providers for a category (Admin)"""
    services_data = load_services_data()
    
    if category not in services_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category '{category}' not found"
        )
    
    return {"category": category, "providers": services_data[category]}

@router.post("/admin/providers/{category}", tags=["Admin"])
def add_provider(category: str, provider: ProviderCreate):
    """Add a new provider to a category (Admin)"""
    services_data = load_services_data()
    
    if category not in services_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category: {category}"
        )
    
    # Check if provider ID already exists
    existing_ids = [p["id"] for p in services_data[category]]
    if provider.id in existing_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Provider with ID '{provider.id}' already exists"
        )
    
    # Add new provider
    new_provider = {
        "id": provider.id,
        "name": provider.name,
        "type": provider.type,
        "portal_url": provider.portal_url,
        "name_change_url": provider.name_change_url,
        "address_change_url": provider.address_change_url or provider.portal_url,
        "api_available": provider.api_available,
        "online_available": provider.online_available,
        "rpa_enabled": provider.rpa_enabled,
        "form_fields": provider.form_fields
    }
    
    services_data[category].append(new_provider)
    save_services_data(services_data)
    
    return {"message": f"Provider '{provider.name}' added successfully", "provider": new_provider}

@router.put("/admin/providers/{category}/{provider_id}", tags=["Admin"])
def update_provider(category: str, provider_id: str, updates: ProviderUpdate):
    """Update an existing provider (Admin)"""
    services_data = load_services_data()
    
    if category not in services_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category '{category}' not found"
        )
    
    # Find provider
    provider_index = None
    for i, p in enumerate(services_data[category]):
        if p["id"] == provider_id:
            provider_index = i
            break
    
    if provider_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Provider '{provider_id}' not found in category '{category}'"
        )
    
    # Update fields
    update_data = updates.dict(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            services_data[category][provider_index][key] = value
    
    save_services_data(services_data)
    
    return {"message": f"Provider '{provider_id}' updated successfully", "provider": services_data[category][provider_index]}

@router.delete("/admin/providers/{category}/{provider_id}", tags=["Admin"])
def delete_provider(category: str, provider_id: str):
    """Delete a provider (Admin)"""
    services_data = load_services_data()
    
    if category not in services_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category '{category}' not found"
        )
    
    # Find and remove provider
    original_length = len(services_data[category])
    services_data[category] = [p for p in services_data[category] if p["id"] != provider_id]
    
    if len(services_data[category]) == original_length:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Provider '{provider_id}' not found in category '{category}'"
        )
    
    save_services_data(services_data)
    
    return {"message": f"Provider '{provider_id}' deleted successfully"}
