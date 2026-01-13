from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime
from app.models import ServiceType, ApplicationStatus, DocumentType

# Auth Schemas
class UserCreate(BaseModel):
    email: str
    mobile: str
    password: str
    full_name: str
    city: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: str
    mobile: str
    full_name: Optional[str]
    aadhaar_number: Optional[str]
    pan_number: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    pincode: Optional[str]
    date_of_birth: Optional[str]
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    aadhaar_number: Optional[str] = None
    pan_number: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    date_of_birth: Optional[str] = None

# Document Schemas
class DocumentResponse(BaseModel):
    id: int
    doc_type: DocumentType
    file_url: str
    file_name: Optional[str]
    extracted_data: Optional[dict]
    is_verified: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Electricity Schemas
class ElectricityAccountCreate(BaseModel):
    provider: str
    service_number: str
    t_no: Optional[str] = None
    consumer_name: str
    connection_address: Optional[str] = None
    meter_number: Optional[str] = None

class ElectricityAccountResponse(BaseModel):
    id: int
    provider: str
    service_number: str
    t_no: Optional[str]
    consumer_name: str
    connection_address: Optional[str]
    meter_number: Optional[str]
    
    class Config:
        from_attributes = True

# Gas Schemas
class GasAccountCreate(BaseModel):
    provider: str
    consumer_number: str
    bp_number: Optional[str] = None
    consumer_name: str
    connection_address: Optional[str] = None

class GasAccountResponse(BaseModel):
    id: int
    provider: str
    consumer_number: str
    bp_number: Optional[str]
    consumer_name: str
    connection_address: Optional[str]
    
    class Config:
        from_attributes = True


# Water Schemas
class WaterAccountCreate(BaseModel):
    provider: str
    connection_id: str
    consumer_name: str
    connection_address: Optional[str] = None
    zone: Optional[str] = None
    ward: Optional[str] = None

class WaterAccountResponse(BaseModel):
    id: int
    provider: str
    connection_id: str
    consumer_name: str
    connection_address: Optional[str]
    zone: Optional[str]
    ward: Optional[str]
    
    class Config:
        from_attributes = True

# Property Schemas
class PropertyAccountCreate(BaseModel):
    survey_number: str
    property_id: Optional[str] = None
    owner_name: str
    property_type: str
    property_address: str
    city: str
    taluka: Optional[str] = None
    district: str
    area_sqft: Optional[str] = None

class PropertyAccountResponse(BaseModel):
    id: int
    survey_number: str
    property_id: Optional[str]
    owner_name: str
    property_type: str
    property_address: str
    city: str
    taluka: Optional[str]
    district: str
    area_sqft: Optional[str]
    
    class Config:
        from_attributes = True

# Application Schemas
class ApplicationCreate(BaseModel):
    service_type: ServiceType
    application_type: str
    form_data: Optional[dict] = None

class ApplicationResponse(BaseModel):
    id: int
    service_type: ServiceType
    application_type: str
    status: ApplicationStatus
    form_data: Optional[dict]
    external_reference: Optional[str]
    submitted_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Auto-fill Response
class AutoFillData(BaseModel):
    user: UserResponse
    electricity_accounts: List[ElectricityAccountResponse]
    gas_accounts: List[GasAccountResponse]
    water_accounts: List[WaterAccountResponse]
    property_accounts: List[PropertyAccountResponse]
