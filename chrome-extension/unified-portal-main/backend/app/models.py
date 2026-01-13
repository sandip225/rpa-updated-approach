from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class ServiceType(str, enum.Enum):
    ELECTRICITY = "electricity"
    GAS = "gas"
    WATER = "water"
    PROPERTY = "property"

class ApplicationStatus(str, enum.Enum):
    DRAFT = "draft"
    PENDING = "pending"
    SUBMITTED = "submitted"
    PROCESSING = "processing"
    COMPLETED = "completed"
    REJECTED = "rejected"

class ApplicationSubType(str, enum.Enum):
    # Electricity
    ELECTRICITY_NAME_CHANGE = "electricity_name_change"
    ELECTRICITY_ADDRESS_CHANGE = "electricity_address_change"
    ELECTRICITY_NEW_CONNECTION = "electricity_new_connection"
    ELECTRICITY_LOAD_ENHANCEMENT = "electricity_load_enhancement"
    ELECTRICITY_METER_CHANGE = "electricity_meter_change"
    
    # Gas
    GAS_NAME_CHANGE = "gas_name_change"
    GAS_ADDRESS_CHANGE = "gas_address_change"
    GAS_NEW_CONNECTION = "gas_new_connection"
    GAS_CYLINDER_BOOKING = "gas_cylinder_booking"
    GAS_SAFETY_CERTIFICATE = "gas_safety_certificate"
    
    # Water
    WATER_NAME_CHANGE = "water_name_change"
    WATER_NEW_CONNECTION = "water_new_connection"
    WATER_METER_READING = "water_meter_reading"
    WATER_BILL_PAYMENT = "water_bill_payment"
    WATER_COMPLAINT = "water_complaint"
    
    # Property
    PROPERTY_NAME_TRANSFER = "property_name_transfer"
    PROPERTY_OWNERSHIP_TRANSFER = "property_ownership_transfer"
    PROPERTY_MUTATION = "property_mutation"
    PROPERTY_SURVEY_SETTLEMENT = "property_survey_settlement"
    PROPERTY_TAX_PAYMENT = "property_tax_payment"

class DocumentType(str, enum.Enum):
    AADHAAR = "aadhaar"
    PAN = "pan"
    ELECTRICITY_BILL = "electricity_bill"
    GAS_BILL = "gas_bill"
    WATER_BILL = "water_bill"
    PROPERTY_PAPER = "property_paper"
    PASSPORT = "passport"
    VOTER_ID = "voter_id"
    OTHER = "other"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    mobile = Column(String(15), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    aadhaar_number = Column(String(12))
    pan_number = Column(String(10))
    address = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    pincode = Column(String(6))
    date_of_birth = Column(String(10))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    documents = relationship("Document", back_populates="user")
    electricity_accounts = relationship("ElectricityAccount", back_populates="user")
    gas_accounts = relationship("GasAccount", back_populates="user")
    water_accounts = relationship("WaterAccount", back_populates="user")
    property_accounts = relationship("PropertyAccount", back_populates="user")
    applications = relationship("Application", back_populates="user")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    doc_type = Column(Enum(DocumentType), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_name = Column(String(255))
    extracted_data = Column(JSON)  # OCR extracted data
    is_verified = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="documents")

class ElectricityAccount(Base):
    __tablename__ = "electricity_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider = Column(String(100))  # Torrent Power, UGVCL, etc.
    service_number = Column(String(50))
    t_no = Column(String(50))
    consumer_name = Column(String(255))
    connection_address = Column(Text)
    meter_number = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="electricity_accounts")


class GasAccount(Base):
    __tablename__ = "gas_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider = Column(String(100))  # Adani Gas, Gujarat Gas, etc.
    consumer_number = Column(String(50))
    bp_number = Column(String(50))
    consumer_name = Column(String(255))
    connection_address = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="gas_accounts")

class WaterAccount(Base):
    __tablename__ = "water_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider = Column(String(100))  # AMC, SMC, etc.
    connection_id = Column(String(50))
    consumer_name = Column(String(255))
    connection_address = Column(Text)
    zone = Column(String(50))
    ward = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="water_accounts")

class PropertyAccount(Base):
    __tablename__ = "property_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    survey_number = Column(String(50))
    property_id = Column(String(50))
    owner_name = Column(String(255))
    property_type = Column(String(50))  # Residential, Commercial, Agricultural
    property_address = Column(Text)
    city = Column(String(100))
    taluka = Column(String(100))
    district = Column(String(100))
    area_sqft = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="property_accounts")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    service_type = Column(Enum(ServiceType), nullable=False)
    application_type = Column(String(100))  # name_change, new_connection, transfer
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.DRAFT)
    form_data = Column(JSON)  # Filled form data
    external_reference = Column(String(100))  # Reference from external site
    submitted_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="applications")
    rpa_submissions = relationship("RPASubmission", back_populates="application")

class RPASubmissionStatus(str, enum.Enum):
    QUEUED = "queued"
    PROCESSING = "processing"
    SUCCESS = "success"
    FAILED = "failed"
    RETRY = "retry"

class RPASubmission(Base):
    __tablename__ = "rpa_submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    target_website = Column(String(255))  # torrent-power, adani-gas, etc.
    target_url = Column(String(500))
    status = Column(Enum(RPASubmissionStatus), default=RPASubmissionStatus.QUEUED)
    submission_data = Column(JSON)  # Data sent to external site
    response_data = Column(JSON)  # Response from external site
    confirmation_number = Column(String(100))  # External confirmation number
    error_message = Column(Text)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    application = relationship("Application", back_populates="rpa_submissions")

# Demo Government Website Data
class DemoTorrentApplication(Base):
    __tablename__ = "demo_torrent_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    confirmation_number = Column(String(20), unique=True, index=True)
    service_number = Column(String(50))
    t_no = Column(String(50))
    applicant_name = Column(String(255))
    mobile = Column(String(15))
    email = Column(String(255))
    application_type = Column(String(100))
    status = Column(String(50), default="submitted")
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True))
    
    # Simulate government processing
    processing_notes = Column(Text)
    officer_name = Column(String(255), default="System Officer")
    department = Column(String(100), default="Customer Service")

class DemoAdaniGasApplication(Base):
    __tablename__ = "demo_adani_gas_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    confirmation_number = Column(String(20), unique=True, index=True)
    consumer_number = Column(String(50))
    bp_number = Column(String(50))
    applicant_name = Column(String(255))
    mobile = Column(String(15))
    email = Column(String(255))
    application_type = Column(String(100))
    status = Column(String(50), default="submitted")
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True))
    
    # Simulate government processing
    processing_notes = Column(Text)
    officer_name = Column(String(255), default="Gas Officer")
    department = Column(String(100), default="PNG Services")

class DemoAmcWaterApplication(Base):
    __tablename__ = "demo_amc_water_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    confirmation_number = Column(String(20), unique=True, index=True)
    connection_id = Column(String(50))
    zone = Column(String(50))
    applicant_name = Column(String(255))
    mobile = Column(String(15))
    email = Column(String(255))
    application_type = Column(String(100))
    status = Column(String(50), default="submitted")
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True))
    
    # Simulate government processing
    processing_notes = Column(Text)
    officer_name = Column(String(255), default="Water Officer")
    department = Column(String(100), default="Water Supply")

class DemoAnyrorApplication(Base):
    __tablename__ = "demo_anyror_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    confirmation_number = Column(String(20), unique=True, index=True)
    survey_number = Column(String(50))
    property_id = Column(String(50))
    district = Column(String(50))
    applicant_name = Column(String(255))
    mobile = Column(String(15))
    email = Column(String(255))
    application_type = Column(String(100))
    status = Column(String(50), default="submitted")
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True))
    
    # Simulate government processing
    processing_notes = Column(Text)
    officer_name = Column(String(255), default="Revenue Officer")
    department = Column(String(100), default="Revenue Department")


# Guided Flow Application Model
class GuidedFlowApplication(Base):
    """WhatsApp-style guided flow application submissions"""
    __tablename__ = "guided_flow_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    tracking_id = Column(String(20), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    category = Column(String(50), nullable=False)  # gas, electricity, water, property
    provider_id = Column(String(50), nullable=False)
    provider_name = Column(String(100), nullable=False)
    application_type = Column(String(50), nullable=False)  # name_change, new_connection
    form_data = Column(JSON, nullable=False)
    status = Column(String(50), default="submitted")  # submitted, processing, completed, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("User", backref="guided_flow_applications")
