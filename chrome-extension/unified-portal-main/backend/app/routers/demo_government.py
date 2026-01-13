from fastapi import APIRouter, Depends, HTTPException, Form, Request
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import (
    DemoTorrentApplication, 
    DemoAdaniGasApplication, 
    DemoAmcWaterApplication, 
    DemoAnyrorApplication
)
import random
import string
from datetime import datetime

router = APIRouter(prefix="/demo-govt", tags=["Demo Government"])

def generate_confirmation_number(prefix="TP"):
    """Generate fake confirmation number like TP2024001234"""
    return f"{prefix}{datetime.now().year}{random.randint(100000, 999999)}"

@router.get("/torrent-power", response_class=HTMLResponse)
def demo_torrent_power_form():
    """Demo Torrent Power website form"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Torrent Power - Name Change Application</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px;
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                min-height: 100vh;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 3px solid #ff6600;
            }
            .logo {
                color: #1e3c72;
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #666;
                font-size: 16px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: #333;
            }
            input, select {
                width: 100%;
                padding: 12px;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-size: 16px;
                box-sizing: border-box;
            }
            input:focus, select:focus {
                border-color: #ff6600;
                outline: none;
                box-shadow: 0 0 5px rgba(255, 102, 0, 0.3);
            }
            .submit-btn {
                background: linear-gradient(135deg, #ff6600 0%, #ff8533 100%);
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 8px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                margin-top: 20px;
                transition: transform 0.2s;
            }
            .submit-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(255, 102, 0, 0.4);
            }
            .required {
                color: red;
            }
            .info-box {
                background: #f0f8ff;
                border: 1px solid #0066cc;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">⚡ TORRENT POWER</div>
                <div class="subtitle">Name Change Application Portal</div>
            </div>
            
            <div class="info-box">
                <strong>📋 Required Documents:</strong> Aadhaar Card, Current Electricity Bill, Address Proof
            </div>
            
            <form action="/demo-govt/torrent-power/submit" method="POST" id="applicationForm">
                <div class="form-group">
                    <label for="city">City <span class="required">*</span></label>
                    <select name="city" id="city" required>
                        <option value="">Select City</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Gandhinagar">Gandhinagar</option>
                        <option value="Surat">Surat</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="serviceNumber">Service Number <span class="required">*</span></label>
                    <input type="text" name="serviceNumber" id="serviceNumber" 
                           placeholder="Enter your Service Number" required>
                </div>
                
                <div class="form-group">
                    <label for="tNo">T No <span class="required">*</span></label>
                    <input type="text" name="tNo" id="tNo" 
                           placeholder="Enter your T No" required>
                </div>
                
                <div class="form-group">
                    <label for="applicantName">Applicant Name <span class="required">*</span></label>
                    <input type="text" name="applicantName" id="applicantName" 
                           placeholder="Enter Full Name as per Aadhaar" required>
                </div>
                
                <div class="form-group">
                    <label for="mobile">Mobile Number <span class="required">*</span></label>
                    <input type="tel" name="mobile" id="mobile" 
                           placeholder="Enter 10-digit Mobile Number" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" name="email" id="email" 
                           placeholder="Enter Email Address">
                </div>
                
                <div class="form-group">
                    <label for="applicationType">Application Type <span class="required">*</span></label>
                    <select name="applicationType" id="applicationType" required>
                        <option value="">Select Application Type</option>
                        <option value="name_change">Name Change</option>
                        <option value="address_change">Address Change</option>
                        <option value="mobile_update">Mobile Number Update</option>
                    </select>
                </div>
                
                <button type="submit" class="submit-btn">
                    🚀 Submit Application
                </button>
            </form>
        </div>
        
        <script>
            // Simulate form validation
            document.getElementById('applicationForm').addEventListener('submit', function(e) {
                const mobile = document.getElementById('mobile').value;
                if (mobile.length !== 10) {
                    alert('Please enter a valid 10-digit mobile number');
                    e.preventDefault();
                    return false;
                }
            });
        </script>
    </body>
    </html>
    """

@router.post("/torrent-power/submit")
def submit_torrent_application(
    city: str = Form(...),
    serviceNumber: str = Form(...),
    tNo: str = Form(...),
    applicantName: str = Form(...),
    mobile: str = Form(...),
    email: str = Form(None),
    applicationType: str = Form(...),
    db: Session = Depends(get_db)
):
    """Process demo Torrent Power application submission"""
    
    # Generate confirmation number
    confirmation_number = generate_confirmation_number("TP")
    
    # Save to demo database
    demo_app = DemoTorrentApplication(
        confirmation_number=confirmation_number,
        service_number=serviceNumber,
        t_no=tNo,
        applicant_name=applicantName,
        mobile=mobile,
        email=email,
        application_type=applicationType,
        processing_notes=f"Application received for {applicationType} in {city}"
    )
    
    db.add(demo_app)
    db.commit()
    db.refresh(demo_app)
    
    # Return success page
    return HTMLResponse(f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Application Submitted - Torrent Power</title>
        <style>
            body {{ 
                font-family: Arial, sans-serif; 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px;
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                min-height: 100vh;
            }}
            .container {{
                background: white;
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                text-align: center;
            }}
            .success-icon {{
                font-size: 64px;
                color: #28a745;
                margin-bottom: 20px;
            }}
            .confirmation {{
                background: #d4edda;
                border: 1px solid #c3e6cb;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
            }}
            .conf-number {{
                font-size: 24px;
                font-weight: bold;
                color: #155724;
                margin: 10px 0;
            }}
            .details {{
                text-align: left;
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }}
            .btn {{
                background: #ff6600;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 6px;
                text-decoration: none;
                display: inline-block;
                margin: 10px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="success-icon">✅</div>
            <h1>Application Submitted Successfully!</h1>
            
            <div class="confirmation">
                <p><strong>Your Confirmation Number:</strong></p>
                <div class="conf-number">{confirmation_number}</div>
                <p><small>Please save this number for future reference</small></p>
            </div>
            
            <div class="details">
                <h3>📋 Application Details:</h3>
                <p><strong>Service Number:</strong> {serviceNumber}</p>
                <p><strong>T No:</strong> {tNo}</p>
                <p><strong>Applicant:</strong> {applicantName}</p>
                <p><strong>Mobile:</strong> {mobile}</p>
                <p><strong>Type:</strong> {applicationType}</p>
                <p><strong>City:</strong> {city}</p>
                <p><strong>Status:</strong> <span style="color: #28a745;">Submitted</span></p>
            </div>
            
            <p>📧 A confirmation SMS/Email will be sent to your registered mobile/email.</p>
            <p>⏱️ Processing Time: 3-5 working days</p>
            
            <a href="/demo-govt/torrent-power" class="btn">Submit Another Application</a>
            <a href="/demo-govt/torrent-power/status/{confirmation_number}" class="btn">Track Status</a>
        </div>
    </body>
    </html>
    """)

@router.get("/torrent-power/status/{confirmation_number}", response_class=HTMLResponse)
def check_application_status(confirmation_number: str, db: Session = Depends(get_db)):
    """Check demo application status"""
    
    app = db.query(DemoTorrentApplication).filter(
        DemoTorrentApplication.confirmation_number == confirmation_number
    ).first()
    
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Simulate processing stages
    statuses = ["Submitted", "Under Review", "Document Verification", "Approved", "Completed"]
    current_status = random.choice(statuses)
    
    return HTMLResponse(f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Application Status - Torrent Power</title>
        <style>
            body {{ 
                font-family: Arial, sans-serif; 
                max-width: 700px; 
                margin: 0 auto; 
                padding: 20px;
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                min-height: 100vh;
            }}
            .container {{
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }}
            .status-badge {{
                background: #28a745;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                display: inline-block;
            }}
            .timeline {{
                margin: 30px 0;
            }}
            .timeline-item {{
                padding: 15px;
                border-left: 3px solid #ddd;
                margin-left: 20px;
                position: relative;
            }}
            .timeline-item.active {{
                border-left-color: #28a745;
                background: #f8fff9;
            }}
            .timeline-dot {{
                width: 12px;
                height: 12px;
                background: #ddd;
                border-radius: 50%;
                position: absolute;
                left: -7px;
                top: 20px;
            }}
            .timeline-item.active .timeline-dot {{
                background: #28a745;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔍 Application Status</h1>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Confirmation Number:</strong> {confirmation_number}</p>
                <p><strong>Applicant:</strong> {app.applicant_name}</p>
                <p><strong>Service Number:</strong> {app.service_number}</p>
                <p><strong>Application Type:</strong> {app.application_type}</p>
                <p><strong>Submitted:</strong> {app.submitted_at.strftime('%d %b %Y, %I:%M %p')}</p>
                <p><strong>Current Status:</strong> <span class="status-badge">{current_status}</span></p>
            </div>
            
            <div class="timeline">
                <h3>📈 Processing Timeline:</h3>
                
                <div class="timeline-item active">
                    <div class="timeline-dot"></div>
                    <strong>Application Submitted</strong>
                    <p>Your application has been received successfully.</p>
                    <small>{app.submitted_at.strftime('%d %b %Y, %I:%M %p')}</small>
                </div>
                
                <div class="timeline-item {'active' if current_status in ['Under Review', 'Document Verification', 'Approved', 'Completed'] else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Under Review</strong>
                    <p>Application is being reviewed by our team.</p>
                </div>
                
                <div class="timeline-item {'active' if current_status in ['Document Verification', 'Approved', 'Completed'] else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Document Verification</strong>
                    <p>Verifying submitted documents and details.</p>
                </div>
                
                <div class="timeline-item {'active' if current_status in ['Approved', 'Completed'] else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Approved</strong>
                    <p>Application approved. Processing final steps.</p>
                </div>
                
                <div class="timeline-item {'active' if current_status == 'Completed' else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Completed</strong>
                    <p>Process completed successfully.</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="/demo-govt/torrent-power" style="background: #ff6600; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">
                    ← Back to Application Form
                </a>
            </div>
        </div>
    </body>
    </html>
    """)

# ==================== ADANI GAS DEMO SITE ====================

@router.get("/adani-gas", response_class=HTMLResponse)
def demo_adani_gas_form():
    """Demo Adani Gas website form"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Adani Total Gas - Service Application</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px;
                background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%);
                min-height: 100vh;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 3px solid #d32f2f;
            }
            .logo {
                color: #d32f2f;
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #666;
                font-size: 16px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: #333;
            }
            input, select {
                width: 100%;
                padding: 12px;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-size: 16px;
                box-sizing: border-box;
            }
            input:focus, select:focus {
                border-color: #d32f2f;
                outline: none;
                box-shadow: 0 0 5px rgba(211, 47, 47, 0.3);
            }
            .submit-btn {
                background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%);
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 8px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                margin-top: 20px;
                transition: transform 0.2s;
            }
            .submit-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(211, 47, 47, 0.4);
            }
            .required {
                color: red;
            }
            .info-box {
                background: #fff3e0;
                border: 1px solid #ff9800;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🔥 ADANI TOTAL GAS</div>
                <div class="subtitle">PNG Service Application Portal</div>
            </div>
            
            <div class="info-box">
                <strong>📋 Required Documents:</strong> Aadhaar Card, Address Proof, Previous Gas Bill (if any)
            </div>
            
            <form action="/demo-govt/adani-gas/submit" method="POST" id="applicationForm">
                <div class="form-group">
                    <label for="city">City <span class="required">*</span></label>
                    <select name="city" id="city" required>
                        <option value="">Select City</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Vadodara">Vadodara</option>
                        <option value="Surat">Surat</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="consumerNumber">Consumer Number</label>
                    <input type="text" name="consumerNumber" id="consumerNumber" 
                           placeholder="Enter Consumer Number (if existing customer)">
                </div>
                
                <div class="form-group">
                    <label for="bpNumber">BP Number</label>
                    <input type="text" name="bpNumber" id="bpNumber" 
                           placeholder="Enter BP Number (if available)">
                </div>
                
                <div class="form-group">
                    <label for="applicantName">Applicant Name <span class="required">*</span></label>
                    <input type="text" name="applicantName" id="applicantName" 
                           placeholder="Enter Full Name as per Aadhaar" required>
                </div>
                
                <div class="form-group">
                    <label for="mobile">Mobile Number <span class="required">*</span></label>
                    <input type="tel" name="mobile" id="mobile" 
                           placeholder="Enter 10-digit Mobile Number" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" name="email" id="email" 
                           placeholder="Enter Email Address">
                </div>
                
                <div class="form-group">
                    <label for="applicationType">Application Type <span class="required">*</span></label>
                    <select name="applicationType" id="applicationType" required>
                        <option value="">Select Application Type</option>
                        <option value="name_change">Name Change</option>
                        <option value="address_change">Address Change</option>
                        <option value="new_connection">New PNG Connection</option>
                        <option value="cylinder_booking">Cylinder Booking</option>
                        <option value="safety_certificate">Safety Certificate</option>
                    </select>
                </div>
                
                <button type="submit" class="submit-btn">
                    🚀 Submit Application
                </button>
            </form>
        </div>
    </body>
    </html>
    """

@router.post("/adani-gas/submit")
def submit_adani_gas_application(
    city: str = Form(...),
    consumerNumber: str = Form(None),
    bpNumber: str = Form(None),
    applicantName: str = Form(...),
    mobile: str = Form(...),
    email: str = Form(None),
    applicationType: str = Form(...),
    db: Session = Depends(get_db)
):
    """Process demo Adani Gas application submission"""
    
    # Generate confirmation number
    confirmation_number = generate_confirmation_number("AG")
    
    # Save to demo database
    demo_app = DemoAdaniGasApplication(
        confirmation_number=confirmation_number,
        consumer_number=consumerNumber,
        bp_number=bpNumber,
        applicant_name=applicantName,
        mobile=mobile,
        email=email,
        application_type=applicationType,
        processing_notes=f"Application received for {applicationType} in {city}"
    )
    
    db.add(demo_app)
    db.commit()
    db.refresh(demo_app)
    
    # Return success page
    return HTMLResponse(f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Application Submitted - Adani Total Gas</title>
        <style>
            body {{ 
                font-family: Arial, sans-serif; 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px;
                background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%);
                min-height: 100vh;
            }}
            .container {{
                background: white;
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                text-align: center;
            }}
            .success-icon {{
                font-size: 64px;
                color: #28a745;
                margin-bottom: 20px;
            }}
            .confirmation {{
                background: #d4edda;
                border: 1px solid #c3e6cb;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
            }}
            .conf-number {{
                font-size: 24px;
                font-weight: bold;
                color: #155724;
                margin: 10px 0;
            }}
            .details {{
                text-align: left;
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }}
            .btn {{
                background: #d32f2f;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 6px;
                text-decoration: none;
                display: inline-block;
                margin: 10px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="success-icon">✅</div>
            <h1>Application Submitted Successfully!</h1>
            
            <div class="confirmation">
                <p><strong>Your Confirmation Number:</strong></p>
                <div class="conf-number">{confirmation_number}</div>
                <p><small>Please save this number for future reference</small></p>
            </div>
            
            <div class="details">
                <h3>📋 Application Details:</h3>
                <p><strong>Consumer Number:</strong> {consumerNumber or 'N/A'}</p>
                <p><strong>BP Number:</strong> {bpNumber or 'N/A'}</p>
                <p><strong>Applicant:</strong> {applicantName}</p>
                <p><strong>Mobile:</strong> {mobile}</p>
                <p><strong>Type:</strong> {applicationType}</p>
                <p><strong>City:</strong> {city}</p>
                <p><strong>Status:</strong> <span style="color: #28a745;">Submitted</span></p>
            </div>
            
            <p>📧 A confirmation SMS/Email will be sent to your registered mobile/email.</p>
            <p>⏱️ Processing Time: 5-7 working days</p>
            
            <a href="/demo-govt/adani-gas" class="btn">Submit Another Application</a>
        </div>
    </body>
    </html>
    """)

# ==================== AMC WATER DEMO SITE ====================

@router.get("/amc-water", response_class=HTMLResponse)
def demo_amc_water_form():
    """Demo AMC Water website form"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>AMC Water - Service Application</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px;
                background: linear-gradient(135deg, #0277bd 0%, #03a9f4 100%);
                min-height: 100vh;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 3px solid #0277bd;
            }
            .logo {
                color: #0277bd;
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #666;
                font-size: 16px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: #333;
            }
            input, select {
                width: 100%;
                padding: 12px;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-size: 16px;
                box-sizing: border-box;
            }
            input:focus, select:focus {
                border-color: #0277bd;
                outline: none;
                box-shadow: 0 0 5px rgba(2, 119, 189, 0.3);
            }
            .submit-btn {
                background: linear-gradient(135deg, #0277bd 0%, #03a9f4 100%);
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 8px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                margin-top: 20px;
                transition: transform 0.2s;
            }
            .submit-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(2, 119, 189, 0.4);
            }
            .required {
                color: red;
            }
            .info-box {
                background: #e3f2fd;
                border: 1px solid #2196f3;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">💧 AMC WATER SUPPLY</div>
                <div class="subtitle">Ahmedabad Municipal Corporation</div>
            </div>
            
            <div class="info-box">
                <strong>📋 Required Documents:</strong> Aadhaar Card, Address Proof, Property Documents
            </div>
            
            <form action="/demo-govt/amc-water/submit" method="POST" id="applicationForm">
                <div class="form-group">
                    <label for="zone">Zone/Ward <span class="required">*</span></label>
                    <select name="zone" id="zone" required>
                        <option value="">Select Zone</option>
                        <option value="East Zone">East Zone</option>
                        <option value="West Zone">West Zone</option>
                        <option value="North Zone">North Zone</option>
                        <option value="South Zone">South Zone</option>
                        <option value="Central Zone">Central Zone</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="connectionId">Connection ID</label>
                    <input type="text" name="connectionId" id="connectionId" 
                           placeholder="Enter Connection ID (if existing customer)">
                </div>
                
                <div class="form-group">
                    <label for="applicantName">Applicant Name <span class="required">*</span></label>
                    <input type="text" name="applicantName" id="applicantName" 
                           placeholder="Enter Full Name as per Aadhaar" required>
                </div>
                
                <div class="form-group">
                    <label for="mobile">Mobile Number <span class="required">*</span></label>
                    <input type="tel" name="mobile" id="mobile" 
                           placeholder="Enter 10-digit Mobile Number" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" name="email" id="email" 
                           placeholder="Enter Email Address">
                </div>
                
                <div class="form-group">
                    <label for="applicationType">Application Type <span class="required">*</span></label>
                    <select name="applicationType" id="applicationType" required>
                        <option value="">Select Application Type</option>
                        <option value="name_change">Name Change</option>
                        <option value="new_connection">New Water Connection</option>
                        <option value="meter_reading">Meter Reading Complaint</option>
                        <option value="bill_payment">Bill Payment Issue</option>
                        <option value="complaint">Water Supply Complaint</option>
                    </select>
                </div>
                
                <button type="submit" class="submit-btn">
                    🚀 Submit Application
                </button>
            </form>
        </div>
    </body>
    </html>
    """

@router.post("/amc-water/submit")
def submit_amc_water_application(
    zone: str = Form(...),
    connectionId: str = Form(None),
    applicantName: str = Form(...),
    mobile: str = Form(...),
    email: str = Form(None),
    applicationType: str = Form(...),
    db: Session = Depends(get_db)
):
    """Process demo AMC Water application submission"""
    
    # Generate confirmation number
    confirmation_number = generate_confirmation_number("AMC")
    
    # Save to demo database
    demo_app = DemoAmcWaterApplication(
        confirmation_number=confirmation_number,
        connection_id=connectionId,
        zone=zone,
        applicant_name=applicantName,
        mobile=mobile,
        email=email,
        application_type=applicationType,
        processing_notes=f"Application received for {applicationType} in {zone}"
    )
    
    db.add(demo_app)
    db.commit()
    db.refresh(demo_app)
    
    # Return success page
    return HTMLResponse(f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Application Submitted - AMC Water</title>
        <style>
            body {{ 
                font-family: Arial, sans-serif; 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px;
                background: linear-gradient(135deg, #0277bd 0%, #03a9f4 100%);
                min-height: 100vh;
            }}
            .container {{
                background: white;
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                text-align: center;
            }}
            .success-icon {{
                font-size: 64px;
                color: #28a745;
                margin-bottom: 20px;
            }}
            .confirmation {{
                background: #d4edda;
                border: 1px solid #c3e6cb;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
            }}
            .conf-number {{
                font-size: 24px;
                font-weight: bold;
                color: #155724;
                margin: 10px 0;
            }}
            .details {{
                text-align: left;
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }}
            .btn {{
                background: #0277bd;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 6px;
                text-decoration: none;
                display: inline-block;
                margin: 10px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="success-icon">✅</div>
            <h1>Application Submitted Successfully!</h1>
            
            <div class="confirmation">
                <p><strong>Your Confirmation Number:</strong></p>
                <div class="conf-number">{confirmation_number}</div>
                <p><small>Please save this number for future reference</small></p>
            </div>
            
            <div class="details">
                <h3>📋 Application Details:</h3>
                <p><strong>Connection ID:</strong> {connectionId or 'N/A'}</p>
                <p><strong>Zone:</strong> {zone}</p>
                <p><strong>Applicant:</strong> {applicantName}</p>
                <p><strong>Mobile:</strong> {mobile}</p>
                <p><strong>Type:</strong> {applicationType}</p>
                <p><strong>Status:</strong> <span style="color: #28a745;">Submitted</span></p>
            </div>
            
            <p>📧 A confirmation SMS/Email will be sent to your registered mobile/email.</p>
            <p>⏱️ Processing Time: 3-7 working days</p>
            
            <a href="/demo-govt/amc-water" class="btn">Submit Another Application</a>
        </div>
    </body>
    </html>
    """)

# ==================== ANYROR GUJARAT DEMO SITE ====================

@router.get("/anyror-gujarat", response_class=HTMLResponse)
def demo_anyror_gujarat_form():
    """Demo AnyRoR Gujarat website form"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>AnyRoR Gujarat - Property Services</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px;
                background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
                min-height: 100vh;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 3px solid #2e7d32;
            }
            .logo {
                color: #2e7d32;
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #666;
                font-size: 16px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: #333;
            }
            input, select {
                width: 100%;
                padding: 12px;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-size: 16px;
                box-sizing: border-box;
            }
            input:focus, select:focus {
                border-color: #2e7d32;
                outline: none;
                box-shadow: 0 0 5px rgba(46, 125, 50, 0.3);
            }
            .submit-btn {
                background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 8px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                margin-top: 20px;
                transition: transform 0.2s;
            }
            .submit-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(46, 125, 50, 0.4);
            }
            .required {
                color: red;
            }
            .info-box {
                background: #f1f8e9;
                border: 1px solid #8bc34a;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🏠 AnyRoR GUJARAT</div>
                <div class="subtitle">Revenue Department - Property Services</div>
            </div>
            
            <div class="info-box">
                <strong>📋 Required Documents:</strong> Property Papers, Survey Documents, Aadhaar Card, Address Proof
            </div>
            
            <form action="/demo-govt/anyror-gujarat/submit" method="POST" id="applicationForm">
                <div class="form-group">
                    <label for="district">District <span class="required">*</span></label>
                    <select name="district" id="district" required>
                        <option value="">Select District</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Gandhinagar">Gandhinagar</option>
                        <option value="Surat">Surat</option>
                        <option value="Vadodara">Vadodara</option>
                        <option value="Rajkot">Rajkot</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="surveyNumber">Survey Number <span class="required">*</span></label>
                    <input type="text" name="surveyNumber" id="surveyNumber" 
                           placeholder="Enter Survey Number" required>
                </div>
                
                <div class="form-group">
                    <label for="propertyId">Property ID</label>
                    <input type="text" name="propertyId" id="propertyId" 
                           placeholder="Enter Property ID (if available)">
                </div>
                
                <div class="form-group">
                    <label for="applicantName">Applicant Name <span class="required">*</span></label>
                    <input type="text" name="applicantName" id="applicantName" 
                           placeholder="Enter Full Name as per Property Papers" required>
                </div>
                
                <div class="form-group">
                    <label for="mobile">Mobile Number <span class="required">*</span></label>
                    <input type="tel" name="mobile" id="mobile" 
                           placeholder="Enter 10-digit Mobile Number" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" name="email" id="email" 
                           placeholder="Enter Email Address">
                </div>
                
                <div class="form-group">
                    <label for="applicationType">Application Type <span class="required">*</span></label>
                    <select name="applicationType" id="applicationType" required>
                        <option value="">Select Application Type</option>
                        <option value="name_transfer">Name Transfer</option>
                        <option value="ownership_transfer">Ownership Transfer</option>
                        <option value="mutation">Property Mutation</option>
                        <option value="survey_settlement">Survey Settlement</option>
                        <option value="tax_payment">Property Tax Payment</option>
                    </select>
                </div>
                
                <button type="submit" class="submit-btn">
                    🚀 Submit Application
                </button>
            </form>
        </div>
    </body>
    </html>
    """

@router.post("/anyror-gujarat/submit")
def submit_anyror_gujarat_application(
    district: str = Form(...),
    surveyNumber: str = Form(...),
    propertyId: str = Form(None),
    applicantName: str = Form(...),
    mobile: str = Form(...),
    email: str = Form(None),
    applicationType: str = Form(...),
    db: Session = Depends(get_db)
):
    """Process demo AnyRoR Gujarat application submission"""
    
    # Generate confirmation number
    confirmation_number = generate_confirmation_number("ROR")
    
    # Save to demo database
    demo_app = DemoAnyrorApplication(
        confirmation_number=confirmation_number,
        survey_number=surveyNumber,
        property_id=propertyId,
        district=district,
        applicant_name=applicantName,
        mobile=mobile,
        email=email,
        application_type=applicationType,
        processing_notes=f"Application received for {applicationType} in {district}"
    )
    
    db.add(demo_app)
    db.commit()
    db.refresh(demo_app)
    
    # Return success page
    return HTMLResponse(f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Application Submitted - AnyRoR Gujarat</title>
        <style>
            body {{ 
                font-family: Arial, sans-serif; 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px;
                background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
                min-height: 100vh;
            }}
            .container {{
                background: white;
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                text-align: center;
            }}
            .success-icon {{
                font-size: 64px;
                color: #28a745;
                margin-bottom: 20px;
            }}
            .confirmation {{
                background: #d4edda;
                border: 1px solid #c3e6cb;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
            }}
            .conf-number {{
                font-size: 24px;
                font-weight: bold;
                color: #155724;
                margin: 10px 0;
            }}
            .details {{
                text-align: left;
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }}
            .btn {{
                background: #2e7d32;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 6px;
                text-decoration: none;
                display: inline-block;
                margin: 10px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="success-icon">✅</div>
            <h1>Application Submitted Successfully!</h1>
            
            <div class="confirmation">
                <p><strong>Your Confirmation Number:</strong></p>
                <div class="conf-number">{confirmation_number}</div>
                <p><small>Please save this number for future reference</small></p>
            </div>
            
            <div class="details">
                <h3>📋 Application Details:</h3>
                <p><strong>Survey Number:</strong> {surveyNumber}</p>
                <p><strong>Property ID:</strong> {propertyId or 'N/A'}</p>
                <p><strong>District:</strong> {district}</p>
                <p><strong>Applicant:</strong> {applicantName}</p>
                <p><strong>Mobile:</strong> {mobile}</p>
                <p><strong>Type:</strong> {applicationType}</p>
                <p><strong>Status:</strong> <span style="color: #28a745;">Submitted</span></p>
            </div>
            
            <p>📧 A confirmation SMS/Email will be sent to your registered mobile/email.</p>
            <p>⏱️ Processing Time: 15-30 working days</p>
            
            <a href="/demo-govt/anyror-gujarat" class="btn">Submit Another Application</a>
        </div>
    </body>
    </html>
    """)

# ==================== STATUS TRACKING FOR ALL DEMO SITES ====================

@router.get("/adani-gas/status/{confirmation_number}", response_class=HTMLResponse)
def check_adani_gas_status(confirmation_number: str):
    """Check demo Adani Gas application status"""
    
    # Simulate processing stages
    statuses = ["Submitted", "Under Review", "Document Verification", "Approved", "Completed"]
    current_status = random.choice(statuses)
    
    return HTMLResponse(f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Application Status - Adani Total Gas</title>
        <style>
            body {{ 
                font-family: Arial, sans-serif; 
                max-width: 700px; 
                margin: 0 auto; 
                padding: 20px;
                background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%);
                min-height: 100vh;
            }}
            .container {{
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }}
            .status-badge {{
                background: #28a745;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                display: inline-block;
            }}
            .timeline {{
                margin: 30px 0;
            }}
            .timeline-item {{
                padding: 15px;
                border-left: 3px solid #ddd;
                margin-left: 20px;
                position: relative;
            }}
            .timeline-item.active {{
                border-left-color: #28a745;
                background: #f8fff9;
            }}
            .timeline-dot {{
                width: 12px;
                height: 12px;
                background: #ddd;
                border-radius: 50%;
                position: absolute;
                left: -7px;
                top: 20px;
            }}
            .timeline-item.active .timeline-dot {{
                background: #28a745;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔍 Application Status - Adani Total Gas</h1>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Confirmation Number:</strong> {confirmation_number}</p>
                <p><strong>Service:</strong> Gas Connection Service</p>
                <p><strong>Current Status:</strong> <span class="status-badge">{current_status}</span></p>
            </div>
            
            <div class="timeline">
                <h3>📈 Processing Timeline:</h3>
                
                <div class="timeline-item active">
                    <div class="timeline-dot"></div>
                    <strong>Application Submitted</strong>
                    <p>Your application has been received successfully.</p>
                </div>
                
                <div class="timeline-item {'active' if current_status in ['Under Review', 'Document Verification', 'Approved', 'Completed'] else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Under Review</strong>
                    <p>Application is being reviewed by our team.</p>
                </div>
                
                <div class="timeline-item {'active' if current_status in ['Document Verification', 'Approved', 'Completed'] else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Document Verification</strong>
                    <p>Verifying submitted documents and details.</p>
                </div>
                
                <div class="timeline-item {'active' if current_status in ['Approved', 'Completed'] else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Approved</strong>
                    <p>Application approved. Processing final steps.</p>
                </div>
                
                <div class="timeline-item {'active' if current_status == 'Completed' else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Completed</strong>
                    <p>Process completed successfully.</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="/demo-govt/adani-gas" style="background: #d32f2f; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">
                    ← Back to Application Form
           

# ==================== STATUS TRACKING ENDPOINTS ====================

@router.get("/adani-gas/status/{confirmation_number}", response_class=HTMLResponse)
def check_adani_gas_status(confirmation_number: str, db: Session = Depends(get_db)):
    """Check demo Adani Gas application status"""
    
    app = db.query(DemoAdaniGasApplication).filter(
        DemoAdaniGasApplication.confirmation_number == confirmation_number
    ).first()
    
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Simulate processing stages
    statuses = ["Submitted", "Under Review", "Document Verification", "Approved", "Completed"]
    current_status = random.choice(statuses)
    
    return HTMLResponse(f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Application Status - Adani Total Gas</title>
        <style>
            body {{ 
                font-family: Arial, sans-serif; 
                max-width: 700px; 
                margin: 0 auto; 
                padding: 20px;
                background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%);
                min-height: 100vh;
            }}
            .container {{
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }}
            .status-badge {{
                background: #28a745;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                display: inline-block;
            }}
            .timeline {{
                margin: 30px 0;
            }}
            .timeline-item {{
                padding: 15px;
                border-left: 3px solid #ddd;
                margin-left: 20px;
                position: relative;
            }}
            .timeline-item.active {{
                border-left-color: #28a745;
                background: #f8fff9;
            }}
            .timeline-dot {{
                width: 12px;
                height: 12px;
                background: #ddd;
                border-radius: 50%;
                position: absolute;
                left: -7px;
                top: 20px;
            }}
            .timeline-item.active .timeline-dot {{
                background: #28a745;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔍 Application Status - Adani Total Gas</h1>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Confirmation Number:</strong> {confirmation_number}</p>
                <p><strong>Applicant:</strong> {app.applicant_name}</p>
                <p><strong>Consumer Number:</strong> {app.consumer_number or 'N/A'}</p>
                <p><strong>Application Type:</strong> {app.application_type}</p>
                <p><strong>Submitted:</strong> {app.submitted_at.strftime('%d %b %Y, %I:%M %p')}</p>
                <p><strong>Current Status:</strong> <span class="status-badge">{current_status}</span></p>
            </div>
            
            <div class="timeline">
                <h3>📈 Processing Timeline:</h3>
                
                <div class="timeline-item active">
                    <div class="timeline-dot"></div>
                    <strong>Application Submitted</strong>
                    <p>Your application has been received successfully.</p>
                    <small>{app.submitted_at.strftime('%d %b %Y, %I:%M %p')}</small>
                </div>
                
                <div class="timeline-item {'active' if current_status in ['Under Review', 'Document Verification', 'Approved', 'Completed'] else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Under Review</strong>
                    <p>Application is being reviewed by our team.</p>
                </div>
                
                <div class="timeline-item {'active' if current_status in ['Document Verification', 'Approved', 'Completed'] else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Document Verification</strong>
                    <p>Verifying submitted documents and details.</p>
                </div>
                
                <div class="timeline-item {'active' if current_status in ['Approved', 'Completed'] else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Approved</strong>
                    <p>Application approved. Processing final steps.</p>
                </div>
                
                <div class="timeline-item {'active' if current_status == 'Completed' else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Completed</strong>
                    <p>Process completed successfully.</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="/demo-govt/adani-gas" style="background: #d32f2f; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">
                    ← Back to Application Form
                </a>
            </div>
        </div>
    </body>
    </html>
    """)

@router.get("/amc-water/status/{confirmation_number}", response_class=HTMLResponse)
def check_amc_water_status(confirmation_number: str, db: Session = Depends(get_db)):
    """Check demo AMC Water application status"""
    
    app = db.query(DemoAmcWaterApplication).filter(
        DemoAmcWaterApplication.confirmation_number == confirmation_number
    ).first()
    
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Simulate processing stages
    statuses = ["Submitted", "Under Review", "Site Inspection", "Approved", "Completed"]
    current_status = random.choice(statuses)
    
    return HTMLResponse(f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Application Status - AMC Water</title>
        <style>
            body {{ 
                font-family: Arial, sans-serif; 
                max-width: 700px; 
                margin: 0 auto; 
                padding: 20px;
                background: linear-gradient(135deg, #0277bd 0%, #03a9f4 100%);
                min-height: 100vh;
            }}
            .container {{
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }}
            .status-badge {{
                background: #28a745;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                display: inline-block;
            }}
            .timeline {{
                margin: 30px 0;
            }}
            .timeline-item {{
                padding: 15px;
                border-left: 3px solid #ddd;
                margin-left: 20px;
                position: relative;
            }}
            .timeline-item.active {{
                border-left-color: #28a745;
                background: #f8fff9;
            }}
            .timeline-dot {{
                width: 12px;
                height: 12px;
                background: #ddd;
                border-radius: 50%;
                position: absolute;
                left: -7px;
                top: 20px;
            }}
            .timeline-item.active .timeline-dot {{
                background: #28a745;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔍 Application Status - AMC Water</h1>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Confirmation Number:</strong> {confirmation_number}</p>
                <p><strong>Applicant:</strong> {app.applicant_name}</p>
                <p><strong>Connection ID:</strong> {app.connection_id or 'N/A'}</p>
                <p><strong>Zone:</strong> {app.zone}</p>
                <p><strong>Application Type:</strong> {app.application_type}</p>
                <p><strong>Submitted:</strong> {app.submitted_at.strftime('%d %b %Y, %I:%M %p')}</p>
                <p><strong>Current Status:</strong> <span class="status-badge">{current_status}</span></p>
            </div>
            
            <div class="timeline">
                <h3>📈 Processing Timeline:</h3>
                
                <div class="timeline-item active">
                    <div class="timeline-dot"></div>
                    <strong>Application Submitted</strong>
                    <p>Your application has been received successfully.</p>
                    <small>{app.submitted_at.strftime('%d %b %Y, %I:%M %p')}</small>
                </div>
                
                <div class="timeline-item {'active' if current_status in ['Under Review', 'Site Inspection', 'Approved', 'Completed'] else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Under Review</strong>
                    <p>Application is being reviewed by water department.</p>
                </div>
                
                <div class="timeline-item {'active' if current_status in ['Site Inspection', 'Approved', 'Completed'] else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Site Inspection</strong>
                    <p>Field officer conducting site inspection.</p>
                </div>
                
                <div class="timeline-item {'active' if current_status in ['Approved', 'Completed'] else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Approved</strong>
                    <p>Application approved. Processing connection.</p>
                </div>
                
                <div class="timeline-item {'active' if current_status == 'Completed' else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Completed</strong>
                    <p>Water connection activated successfully.</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="/demo-govt/amc-water" style="background: #0277bd; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">
                    ← Back to Application Form
                </a>
            </div>
        </div>
    </body>
    </html>
    """)

@router.get("/anyror-gujarat/status/{confirmation_number}", response_class=HTMLResponse)
def check_anyror_gujarat_status(confirmation_number: str, db: Session = Depends(get_db)):
    """Check demo AnyRoR Gujarat application status"""
    
    app = db.query(DemoAnyrorApplication).filter(
        DemoAnyrorApplication.confirmation_number == confirmation_number
    ).first()
    
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Simulate processing stages
    statuses = ["Submitted", "Document Verification", "Survey Verification", "Approved", "Completed"]
    current_status = random.choice(statuses)
    
    return HTMLResponse(f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Application Status - AnyRoR Gujarat</title>
        <style>
            body {{ 
                font-family: Arial, sans-serif; 
                max-width: 700px; 
                margin: 0 auto; 
                padding: 20px;
                background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
                min-height: 100vh;
            }}
            .container {{
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }}
            .status-badge {{
                background: #28a745;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                display: inline-block;
            }}
            .timeline {{
                margin: 30px 0;
            }}
            .timeline-item {{
                padding: 15px;
                border-left: 3px solid #ddd;
                margin-left: 20px;
                position: relative;
            }}
            .timeline-item.active {{
                border-left-color: #28a745;
                background: #f8fff9;
            }}
            .timeline-dot {{
                width: 12px;
                height: 12px;
                background: #ddd;
                border-radius: 50%;
                position: absolute;
                left: -7px;
                top: 20px;
            }}
            .timeline-item.active .timeline-dot {{
                background: #28a745;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔍 Application Status - AnyRoR Gujarat</h1>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Confirmation Number:</strong> {confirmation_number}</p>
                <p><strong>Applicant:</strong> {app.applicant_name}</p>
                <p><strong>Survey Number:</strong> {app.survey_number}</p>
                <p><strong>Property ID:</strong> {app.property_id or 'N/A'}</p>
                <p><strong>District:</strong> {app.district}</p>
                <p><strong>Application Type:</strong> {app.application_type}</p>
                <p><strong>Submitted:</strong> {app.submitted_at.strftime('%d %b %Y, %I:%M %p')}</p>
                <p><strong>Current Status:</strong> <span class="status-badge">{current_status}</span></p>
            </div>
            
            <div class="timeline">
                <h3>📈 Processing Timeline:</h3>
                
                <div class="timeline-item active">
                    <div class="timeline-dot"></div>
                    <strong>Application Submitted</strong>
                    <p>Your application has been received successfully.</p>
                    <small>{app.submitted_at.strftime('%d %b %Y, %I:%M %p')}</small>
                </div>
                
                <div class="timeline-item {'active' if current_status in ['Document Verification', 'Survey Verification', 'Approved', 'Completed'] else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Document Verification</strong>
                    <p>Revenue department verifying submitted documents.</p>
                </div>
                
                <div class="timeline-item {'active' if current_status in ['Survey Verification', 'Approved', 'Completed'] else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Survey Verification</strong>
                    <p>Survey officer verifying property details.</p>
                </div>
                
                <div class="timeline-item {'active' if current_status in ['Approved', 'Completed'] else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Approved</strong>
                    <p>Application approved by revenue officer.</p>
                </div>
                
                <div class="timeline-item {'active' if current_status == 'Completed' else ''}">
                    <div class="timeline-dot"></div>
                    <strong>Completed</strong>
                    <p>Property records updated successfully.</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="/demo-govt/anyror-gujarat" style="background: #2e7d32; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">
                    ← Back to Application Form
                </a>
            </div>
        </div>
    </body>
    </html>
    """)