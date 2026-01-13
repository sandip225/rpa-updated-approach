from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Application, RPASubmission, RPASubmissionStatus, ApplicationStatus
from app.auth import get_current_user
from app.services.rpa_service import rpa_service
from app.services.mock_rpa_service import mock_rpa_service
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/rpa", tags=["RPA Automation"])

class RPASubmissionRequest(BaseModel):
    application_id: int
    target_website: str  # torrent-power, adani-gas, gujarat-gas
    submission_data: Dict[str, Any]

class RPASubmissionResponse(BaseModel):
    id: int
    application_id: int
    target_website: str
    status: str
    confirmation_number: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime

def process_rpa_submission_background(
    submission_id: int, 
    target_website: str, 
    submission_data: Dict[str, Any],
    db: Session
):
    """Background task to process RPA submission"""
    
    # Get submission record
    submission = db.query(RPASubmission).filter(RPASubmission.id == submission_id).first()
    if not submission:
        logger.error(f"RPA submission {submission_id} not found")
        return
    
    try:
        # Update status to processing
        submission.status = RPASubmissionStatus.PROCESSING
        submission.started_at = datetime.utcnow()
        db.commit()
        
        logger.info(f"Starting RPA submission {submission_id} for {target_website}")
        
        # Route to Mock RPA service for embedded experience (no Chrome windows)
        if target_website == "torrent-power":
            result = mock_rpa_service.submit_torrent_power_application(submission_data)
        elif target_website == "adani-gas":
            result = mock_rpa_service.submit_adani_gas_application(submission_data)
        elif target_website == "amc-water":
            result = mock_rpa_service.submit_amc_water_application(submission_data)
        elif target_website == "anyror-gujarat":
            result = mock_rpa_service.submit_anyror_gujarat_application(submission_data)
        else:
            raise ValueError(f"Unsupported target website: {target_website}")
        
        # Update submission with result
        if result["success"]:
            submission.status = RPASubmissionStatus.SUCCESS
            submission.confirmation_number = result.get("confirmation_number")
            submission.response_data = result
            
            # Update application status
            application = db.query(Application).filter(Application.id == submission.application_id).first()
            if application:
                application.status = ApplicationStatus.SUBMITTED
                application.external_reference = result.get("confirmation_number")
                application.submitted_at = datetime.utcnow()
            
            logger.info(f"RPA submission {submission_id} completed successfully: {result.get('confirmation_number')}")
            
        else:
            submission.status = RPASubmissionStatus.FAILED
            submission.error_message = result.get("error", "Unknown error")
            submission.response_data = result
            
            logger.error(f"RPA submission {submission_id} failed: {result.get('error')}")
        
        submission.completed_at = datetime.utcnow()
        db.commit()
        
    except Exception as e:
        logger.error(f"RPA submission {submission_id} failed with exception: {str(e)}")
        
        # Update submission with error
        submission.status = RPASubmissionStatus.FAILED
        submission.error_message = str(e)
        submission.completed_at = datetime.utcnow()
        submission.retry_count += 1
        
        # Mark for retry if under max retries
        if submission.retry_count < submission.max_retries:
            submission.status = RPASubmissionStatus.RETRY
            logger.info(f"RPA submission {submission_id} marked for retry ({submission.retry_count}/{submission.max_retries})")
        
        db.commit()

@router.post("/submit", response_model=RPASubmissionResponse)
def submit_rpa_application(
    request: RPASubmissionRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit application via RPA to external government website"""
    
    # Verify application belongs to user
    application = db.query(Application).filter(
        Application.id == request.application_id,
        Application.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check if RPA submission already exists for this application
    existing_submission = db.query(RPASubmission).filter(
        RPASubmission.application_id == request.application_id,
        RPASubmission.target_website == request.target_website,
        RPASubmission.status.in_([RPASubmissionStatus.QUEUED, RPASubmissionStatus.PROCESSING])
    ).first()
    
    if existing_submission:
        raise HTTPException(
            status_code=400, 
            detail="RPA submission already in progress for this application"
        )
    
    # Create RPA submission record
    rpa_submission = RPASubmission(
        application_id=request.application_id,
        target_website=request.target_website,
        target_url=f"demo-govt/{request.target_website}",
        submission_data=request.submission_data,
        status=RPASubmissionStatus.QUEUED
    )
    
    db.add(rpa_submission)
    db.commit()
    db.refresh(rpa_submission)
    
    # Start background processing
    background_tasks.add_task(
        process_rpa_submission_background,
        rpa_submission.id,
        request.target_website,
        request.submission_data,
        db
    )
    
    # Send WhatsApp notification that RPA processing started
    try:
        user_mobile = request.submission_data.get('mobile')
        service_type = request.submission_data.get('service_type', 'service')
        if user_mobile:
            whatsapp_service.send_rpa_processing(user_mobile, service_type)
    except Exception as e:
        logger.warning(f"Failed to send WhatsApp notification: {e}")
    
    logger.info(f"RPA submission {rpa_submission.id} queued for {request.target_website}")
    
    return rpa_submission

@router.get("/status/{submission_id}")
def get_rpa_submission_status(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get RPA submission status"""
    
    submission = db.query(RPASubmission).join(Application).filter(
        RPASubmission.id == submission_id,
        Application.user_id == current_user.id
    ).first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="RPA submission not found")
    
    return {
        "id": submission.id,
        "application_id": submission.application_id,
        "target_website": submission.target_website,
        "status": submission.status,
        "confirmation_number": submission.confirmation_number,
        "error_message": submission.error_message,
        "retry_count": submission.retry_count,
        "max_retries": submission.max_retries,
        "created_at": submission.created_at,
        "started_at": submission.started_at,
        "completed_at": submission.completed_at,
        "response_data": submission.response_data
    }

@router.get("/submissions")
def get_user_rpa_submissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all RPA submissions for current user"""
    
    submissions = db.query(RPASubmission).join(Application).filter(
        Application.user_id == current_user.id
    ).order_by(RPASubmission.created_at.desc()).all()
    
    return [
        {
            "id": sub.id,
            "application_id": sub.application_id,
            "target_website": sub.target_website,
            "status": sub.status,
            "confirmation_number": sub.confirmation_number,
            "error_message": sub.error_message,
            "created_at": sub.created_at,
            "completed_at": sub.completed_at
        }
        for sub in submissions
    ]

@router.post("/retry/{submission_id}")
def retry_rpa_submission(
    submission_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retry failed RPA submission"""
    
    submission = db.query(RPASubmission).join(Application).filter(
        RPASubmission.id == submission_id,
        Application.user_id == current_user.id,
        RPASubmission.status.in_([RPASubmissionStatus.FAILED, RPASubmissionStatus.RETRY])
    ).first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="RPA submission not found or cannot be retried")
    
    if submission.retry_count >= submission.max_retries:
        raise HTTPException(status_code=400, detail="Maximum retry attempts exceeded")
    
    # Reset submission for retry
    submission.status = RPASubmissionStatus.QUEUED
    submission.error_message = None
    submission.started_at = None
    submission.completed_at = None
    
    db.commit()
    
    # Start background processing
    background_tasks.add_task(
        process_rpa_submission_background,
        submission.id,
        submission.target_website,
        submission.submission_data,
        db
    )
    
    logger.info(f"RPA submission {submission_id} queued for retry")
    
    return {"message": "RPA submission queued for retry", "submission_id": submission_id}