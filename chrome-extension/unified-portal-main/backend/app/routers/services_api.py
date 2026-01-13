"""
Services API Router
Provides endpoints for all services data
"""
from fastapi import APIRouter, HTTPException
from app.data import get_service_loader
from typing import List, Dict, Any

router = APIRouter(prefix="/api/services", tags=["Services"])
loader = get_service_loader()

@router.get("/categories")
def get_categories():
    """Get all service categories"""
    return {
        "categories": ["gas", "electricity", "water", "property"]
    }

@router.get("/{category}")
def get_services_by_category(category: str):
    """Get all services in a category"""
    if category not in ["gas", "electricity", "water", "property"]:
        raise HTTPException(status_code=400, detail="Invalid category")
    
    services = loader.get_services_by_category(category)
    return {
        "category": category,
        "count": len(services),
        "services": services
    }

@router.get("/{category}/online")
def get_online_services(category: str):
    """Get only online available services"""
    if category not in ["gas", "electricity", "water", "property"]:
        raise HTTPException(status_code=400, detail="Invalid category")
    
    services = loader.get_online_services(category)
    return {
        "category": category,
        "type": "online",
        "count": len(services),
        "services": services
    }

@router.get("/{category}/rpa")
def get_rpa_services(category: str):
    """Get only RPA enabled services"""
    if category not in ["gas", "electricity", "water", "property"]:
        raise HTTPException(status_code=400, detail="Invalid category")
    
    services = loader.get_rpa_enabled_services(category)
    return {
        "category": category,
        "type": "rpa_enabled",
        "count": len(services),
        "services": services
    }

@router.get("/{category}/{service_id}")
def get_service_details(category: str, service_id: str):
    """Get specific service details"""
    if category not in ["gas", "electricity", "water", "property"]:
        raise HTTPException(status_code=400, detail="Invalid category")
    
    service = loader.get_service_by_id(category, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    return {
        "category": category,
        "service": service
    }

@router.get("/{category}/names")
def get_service_names(category: str):
    """Get list of service names"""
    if category not in ["gas", "electricity", "water", "property"]:
        raise HTTPException(status_code=400, detail="Invalid category")
    
    names = loader.get_service_names(category)
    return {
        "category": category,
        "names": names
    }

@router.get("/search/{query}")
def search_services(query: str):
    """Search services across all categories"""
    results = {}
    query_lower = query.lower()
    
    for category in ["gas", "electricity", "water", "property"]:
        services = loader.get_services_by_category(category)
        matching = [s for s in services if query_lower in s['name'].lower()]
        if matching:
            results[category] = matching
    
    return {
        "query": query,
        "results": results
    }

@router.get("/")
def get_all_services():
    """Get all services"""
    return loader.get_all_services()
