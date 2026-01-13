from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Document, DocumentType
from app.schemas import UserResponse, UserUpdate, DocumentResponse, AutoFillData
from app.auth import get_current_user
from app.services.ocr_service import ocr_service
import uuid

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.put("/profile", response_model=UserResponse)
def update_profile(
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    for field, value in user_data.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/documents/upload", response_model=DocumentResponse)
async def upload_document(
    doc_type: DocumentType,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{current_user.id}/{doc_type.value}/{uuid.uuid4()}.{file_extension}"
    
    # In production, upload to S3
    # For now, save locally
    file_url = f"/uploads/{unique_filename}"
    
    # Read file content for OCR
    content = await file.read()
    
    # Extract data using OCR based on document type
    extracted_data = {}
    doc_type_mapping = {
        DocumentType.AADHAAR: "aadhaar",
        DocumentType.PAN: "pan",
        DocumentType.ELECTRICITY_BILL: "electricity_bill",
        DocumentType.GAS_BILL: "gas_bill",
        DocumentType.PROPERTY_DOC: "property_doc",
    }
    
    ocr_type = doc_type_mapping.get(doc_type)
    if ocr_type:
        extracted_data = ocr_service.process_document(content, ocr_type)
    
    # Create document record
    document = Document(
        user_id=current_user.id,
        doc_type=doc_type,
        file_url=file_url,
        file_name=file.filename,
        extracted_data=extracted_data
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    
    # Update user profile with extracted data
    if doc_type == DocumentType.AADHAAR and extracted_data:
        if extracted_data.get("aadhaar_number"):
            current_user.aadhaar_number = extracted_data["aadhaar_number"]
        if extracted_data.get("full_name") and not current_user.full_name:
            current_user.full_name = extracted_data["full_name"]
        if extracted_data.get("date_of_birth"):
            current_user.date_of_birth = extracted_data["date_of_birth"]
        if extracted_data.get("address"):
            current_user.address = extracted_data["address"]
        if extracted_data.get("pincode"):
            current_user.pincode = extracted_data["pincode"]
        if extracted_data.get("gender"):
            current_user.gender = extracted_data["gender"]
        db.commit()
    
    elif doc_type == DocumentType.PAN and extracted_data:
        if extracted_data.get("pan_number"):
            current_user.pan_number = extracted_data["pan_number"]
        if extracted_data.get("full_name") and not current_user.full_name:
            current_user.full_name = extracted_data["full_name"]
        if extracted_data.get("date_of_birth") and not current_user.date_of_birth:
            current_user.date_of_birth = extracted_data["date_of_birth"]
        db.commit()
    
    return document

@router.get("/documents", response_model=List[DocumentResponse])
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Document).filter(Document.user_id == current_user.id).all()

@router.get("/autofill-data", response_model=AutoFillData)
def get_autofill_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all user data for auto-filling forms"""
    return AutoFillData(
        user=current_user,
        electricity_accounts=current_user.electricity_accounts,
        gas_accounts=current_user.gas_accounts,
        water_accounts=current_user.water_accounts,
        property_accounts=current_user.property_accounts
    )
