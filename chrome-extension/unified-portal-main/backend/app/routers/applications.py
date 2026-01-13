from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models import User, Application, ApplicationStatus, ServiceType
from app.schemas import ApplicationCreate, ApplicationResponse
from app.auth import get_current_user
from app.services.rpa_service import rpa_service

router = APIRouter(prefix="/api/applications", tags=["Applications"])

@router.post("/", response_model=ApplicationResponse)
def create_application(
    app_data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    application = Application(
        user_id=current_user.id,
        service_type=app_data.service_type,
        application_type=app_data.application_type,
        form_data=app_data.form_data,
        status=ApplicationStatus.DRAFT
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application

@router.get("/", response_model=List[ApplicationResponse])
def get_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Application).filter(Application.user_id == current_user.id).all()

@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

@router.post("/{application_id}/submit")
def submit_application(
    application_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Update status
    application.status = ApplicationStatus.PENDING
    application.submitted_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Application submitted", "status": application.status}

@router.post("/{application_id}/autofill-external")
def autofill_external_form(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Trigger RPA to fill external website form"""
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Prepare data for RPA
    form_data = application.form_data or {}
    form_data.update({
        "email": current_user.email,
        "mobile": current_user.mobile,
        "full_name": current_user.full_name
    })
    
    # Call appropriate RPA based on service type
    if application.service_type == ServiceType.ELECTRICITY:
        if application.application_type == "name_change":
            result = rpa_service.fill_torrent_power_name_change(form_data)
        else:
            result = {"success": False, "message": "Application type not supported for RPA"}
    
    elif application.service_type == ServiceType.GAS:
        if application.application_type == "name_change":
            result = rpa_service.fill_adani_gas_name_change(form_data)
        else:
            result = {"success": False, "message": "Application type not supported for RPA"}
    
    else:
        result = {"success": False, "message": "Service type not supported for RPA yet"}
    
    return result

@router.get("/prefill/{service_type}/{application_type}")
def get_prefill_data(
    service_type: ServiceType,
    application_type: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get pre-filled data for a specific application type"""
    prefill_data = {
        "full_name": current_user.full_name,
        "email": current_user.email,
        "mobile": current_user.mobile,
        "address": current_user.address,
        "city": current_user.city,
        "pincode": current_user.pincode,
        "aadhaar_number": current_user.aadhaar_number,
        "pan_number": current_user.pan_number
    }
    
    # Add service-specific data
    if service_type == ServiceType.ELECTRICITY:
        accounts = current_user.electricity_accounts
        if accounts:
            account = accounts[0]
            prefill_data.update({
                "service_number": account.service_number,
                "t_no": account.t_no,
                "consumer_name": account.consumer_name,
                "provider": account.provider
            })
    
    elif service_type == ServiceType.GAS:
        accounts = current_user.gas_accounts
        if accounts:
            account = accounts[0]
            prefill_data.update({
                "consumer_number": account.consumer_number,
                "bp_number": account.bp_number,
                "consumer_name": account.consumer_name,
                "provider": account.provider
            })
    
    elif service_type == ServiceType.WATER:
        accounts = current_user.water_accounts
        if accounts:
            account = accounts[0]
            prefill_data.update({
                "connection_id": account.connection_id,
                "consumer_name": account.consumer_name,
                "provider": account.provider
            })
    
    elif service_type == ServiceType.PROPERTY:
        accounts = current_user.property_accounts
        if accounts:
            account = accounts[0]
            prefill_data.update({
                "survey_number": account.survey_number,
                "property_id": account.property_id,
                "owner_name": account.owner_name,
                "property_type": account.property_type
            })
    
    return prefill_data
