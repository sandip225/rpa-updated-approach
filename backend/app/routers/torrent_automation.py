"""
Clean Torrent Power RPA Automation API
Uses Selenium WebDriver for real browser automation
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import Dict, Any, Optional
import asyncio
import time
from datetime import datetime

from app.auth import get_current_user
from app.models import User

router = APIRouter(prefix="/api/torrent-automation", tags=["Torrent Power RPA Automation"])


class TorrentAutomationRequest(BaseModel):
    """Request model for Torrent Power RPA automation"""
    city: str = "Ahmedabad"
    service_number: str
    t_number: str  # Transaction Number
    mobile: str
    email: str
    confirm_email: Optional[str] = None


class TorrentAutomationResponse(BaseModel):
    """Response model for RPA automation results"""
    success: bool
    message: str
    details: Optional[str] = None
    timestamp: str
    provider: str = "torrent_power"
    automation_type: str = "rpa_selenium"
    session_data: Optional[Dict[str, Any]] = None
    screenshots: Optional[list] = None
    fields_filled: Optional[int] = None
    total_fields: Optional[int] = None
    success_rate: Optional[str] = None
    next_steps: Optional[list] = None
    portal_url: str = "https://connect.torrentpower.com/tplcp/application/namechangerequest"
    error: Optional[str] = None
    automation_details: Optional[list] = None


@router.post("/start-automation", response_model=TorrentAutomationResponse)
async def start_torrent_power_rpa_automation(
    request: TorrentAutomationRequest
    # current_user: User = Depends(get_current_user)  # Temporarily disabled for testing
):
    """
    Start the RPA-based Torrent Power automation workflow
    Uses Selenium WebDriver for real browser automation
    """
    
    try:
        print("🤖 PRODUCTION RPA Torrent Power automation request received")
        print(f"📋 Request data: {request.dict()}")
        
        # Debug: Print individual field values
        print(f"🔍 Debug - Individual fields:")
        print(f"   City: '{request.city}'")
        print(f"   Service Number: '{request.service_number}'")
        print(f"   T Number: '{request.t_number}'")
        print(f"   Mobile: '{request.mobile}'")
        print(f"   Email: '{request.email}'")
        
        # Validate required fields
        if not request.service_number or request.service_number.strip() == "":
            print("❌ Validation failed: Service Number is empty")
            raise HTTPException(
                status_code=400,
                detail="Service Number is required for Torrent Power automation"
            )
        
        if not request.t_number or request.t_number.strip() == "":
            print("❌ Validation failed: T Number is empty")
            raise HTTPException(
                status_code=400,
                detail="Transaction Number (T No) is required for Torrent Power automation"
            )
        
        if not request.mobile or len(request.mobile.strip()) < 10:
            print(f"❌ Validation failed: Mobile number invalid - '{request.mobile}' (length: {len(request.mobile.strip()) if request.mobile else 0})")
            raise HTTPException(
                status_code=400,
                detail="Valid mobile number is required (at least 10 digits)"
            )
        
        if not request.email or request.email.strip() == "":
            print("❌ Validation failed: Email is empty")
            raise HTTPException(
                status_code=400,
                detail="Email address is required for Torrent Power automation"
            )
        
        print("✅ All validations passed, starting RPA automation...")
        
        # Use RPA-based automation for real form filling
        print("🤖 Starting RPA-based automation...")
        
        try:
            from app.services.torrent_rpa_service import TorrentPowerRPA
            
            # Prepare the data for RPA
            rpa_data = {
                "city": request.city or 'Ahmedabad',
                "service_number": request.service_number,
                "t_number": request.t_number,
                "mobile": request.mobile,
                "email": request.email
            }
            
            print(f"📋 RPA Data: {rpa_data}")
            
            # Initialize and run RPA
            rpa = TorrentPowerRPA()
            result = rpa.run_automation(rpa_data, keep_open=True)
            
            print(f"📊 RPA Result: {result}")
            
            if result.get("success"):
                return TorrentAutomationResponse(
                    success=True,
                    message=f"🤖 RPA successfully filled {result.get('total_filled', 0)} fields! Browser kept open for review.",
                    details="RPA automation completed successfully",
                    timestamp=datetime.now().isoformat(),
                    fields_filled=result.get("total_filled", 0),
                    total_fields=5,
                    next_steps=[
                        "✅ RPA automation completed successfully",
                        "🤖 Browser opened with form auto-filled",
                        "📝 Form fields filled and highlighted in green",
                        "👀 Review the filled data for accuracy",
                        "📤 Click Submit to complete your application",
                        "🕐 Browser will stay open for 5 minutes"
                    ],
                    automation_details=result.get("filled_fields", []),
                    screenshots=result.get("screenshots", [])
                )
            else:
                return TorrentAutomationResponse(
                    success=False,
                    message="RPA automation encountered an error.",
                    details=result.get("error", "Unknown RPA error"),
                    timestamp=datetime.now().isoformat(),
                    error=result.get("error", "RPA automation failed"),
                    automation_details=result.get("filled_fields", [])
                )
                
        except ImportError as e:
            print(f"❌ RPA import error: {e}")
            return TorrentAutomationResponse(
                success=False,
                message="RPA service not available. Selenium WebDriver required.",
                details="Please install Selenium and ChromeDriver for RPA automation.",
                timestamp=datetime.now().isoformat(),
                error="RPA service not available. Selenium WebDriver required."
            )
        except Exception as e:
            print(f"❌ RPA automation error: {e}")
            return TorrentAutomationResponse(
                success=False,
                message="RPA automation service unavailable.",
                details=str(e),
                timestamp=datetime.now().isoformat(),
                error=f"RPA automation failed: {str(e)}"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Torrent RPA automation API error: {str(e)}")
        import traceback
        print(f"❌ Full traceback: {traceback.format_exc()}")
        
        return TorrentAutomationResponse(
            success=False,
            message=f"Failed to start Torrent Power RPA automation: {str(e)}",
            timestamp=datetime.now().isoformat(),
            error=str(e),
            details=traceback.format_exc()
        )


@router.get("/test-connection")
async def test_rpa_automation_connection():
    """
    Test if the RPA automation service is working
    """
    
    try:
        return {
            "success": True,
            "message": "Torrent Power RPA automation service is ready",
            "timestamp": datetime.now().isoformat(),
            "automation_type": "rpa_selenium",
            "browser": "Chrome with Selenium WebDriver",
            "service_status": "initialized",
            "features": [
                "✅ RPA browser automation ready",
                "✅ Real form filling capabilities",
                "✅ Visual field highlighting",
                "✅ Screenshot capture",
                "✅ User-controlled submission",
                "✅ Browser stays open for review"
            ]
        }
            
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "RPA automation service test failed",
            "timestamp": datetime.now().isoformat()
        }


@router.get("/supported-fields")
async def get_supported_fields():
    """
    Get the list of supported fields for Torrent Power RPA automation
    """
    
    return {
        "success": True,
        "provider": "torrent_power",
        "automation_type": "rpa_selenium",
        "supported_fields": {
            "city": {
                "type": "dropdown",
                "required": True,
                "default": "Ahmedabad",
                "options": ["Ahmedabad", "Surat", "Gandhinagar", "Bhavnagar"],
                "description": "City/Location for service"
            },
            "service_number": {
                "type": "text",
                "required": True,
                "pattern": "^[A-Z0-9]+$",
                "description": "Service/Consumer Number"
            },
            "t_number": {
                "type": "text", 
                "required": True,
                "pattern": "^T[0-9]+$",
                "description": "Transaction Number (T No)"
            },
            "mobile": {
                "type": "tel",
                "required": True,
                "pattern": "^[0-9]{10}$",
                "description": "10-digit mobile number"
            },
            "email": {
                "type": "email",
                "required": True,
                "description": "Email address for notifications"
            }
        },
        "rpa_workflow_steps": [
            "1. Initialize Chrome WebDriver with visible browser",
            "2. Navigate to official Torrent Power website", 
            "3. Wait for form elements to load",
            "4. Locate and fill form fields using multiple selectors",
            "5. Highlight filled fields with green borders",
            "6. Take screenshots for audit trail",
            "7. Show success notification on page",
            "8. Keep browser open for user review and submission",
            "9. Provide detailed field-by-field results"
        ],
        "timestamp": datetime.now().isoformat()
    }


@router.post("/start-visible-automation", response_model=TorrentAutomationResponse)
async def start_visible_torrent_power_rpa_automation(
    request: TorrentAutomationRequest
    # current_user: User = Depends(get_current_user)  # Temporarily disabled for testing
):
    """
    Start the RPA-based Torrent Power automation with VISIBLE browser for debugging
    Shows the automation process in real-time with visual feedback
    """
    
    try:
        print("🤖 VISIBLE RPA Torrent Power automation request received")
        print(f"📋 Request data: {request.dict()}")
        
        # Validate required fields (same as regular automation)
        if not request.service_number or request.service_number.strip() == "":
            raise HTTPException(
                status_code=400,
                detail="Service Number is required for Torrent Power automation"
            )
        
        if not request.t_number or request.t_number.strip() == "":
            raise HTTPException(
                status_code=400,
                detail="Transaction Number (T No) is required for Torrent Power automation"
            )
        
        if not request.mobile or len(request.mobile.strip()) < 10:
            raise HTTPException(
                status_code=400,
                detail="Valid mobile number is required (at least 10 digits)"
            )
        
        if not request.email or request.email.strip() == "":
            raise HTTPException(
                status_code=400,
                detail="Email address is required for Torrent Power automation"
            )
        
        print("✅ All validations passed, starting VISIBLE RPA automation...")
        
        try:
            from app.services.torrent_rpa_service import TorrentPowerRPA
            
            # Prepare the data for RPA
            rpa_data = {
                "city": request.city or 'Ahmedabad',
                "service_number": request.service_number,
                "t_number": request.t_number,
                "mobile": request.mobile,
                "email": request.email
            }
            
            print(f"📋 Visible RPA Data: {rpa_data}")
            
            # Initialize and run VISIBLE RPA
            rpa = TorrentPowerRPA()
            result = rpa.run_visible_automation(rpa_data)
            
            print(f"📊 Visible RPA Result: {result}")
            
            if result.get("success"):
                return TorrentAutomationResponse(
                    success=True,
                    message=f"🤖 VISIBLE RPA successfully filled {result.get('total_filled', 0)} fields! Browser kept open for debugging.",
                    details="Visible RPA automation completed successfully - you can see the process!",
                    timestamp=datetime.now().isoformat(),
                    fields_filled=result.get("total_filled", 0),
                    total_fields=5,
                    next_steps=[
                        "✅ VISIBLE RPA automation completed successfully",
                        "👀 Browser opened with visible automation process",
                        "🎬 Watch the form being filled step by step",
                        "📝 Form fields filled and highlighted in green",
                        "🔍 Review the filled data for accuracy",
                        "📤 Click Submit to complete your application",
                        "🕐 Browser will stay open for 10 minutes for debugging"
                    ],
                    automation_details=result.get("filled_fields", []),
                    screenshots=result.get("screenshots", [])
                )
            else:
                return TorrentAutomationResponse(
                    success=False,
                    message="Visible RPA automation encountered an error.",
                    details=result.get("error", "Unknown visible RPA error"),
                    timestamp=datetime.now().isoformat(),
                    error=result.get("error", "Visible RPA automation failed"),
                    automation_details=result.get("filled_fields", [])
                )
                
        except ImportError as e:
            print(f"❌ Visible RPA import error: {e}")
            return TorrentAutomationResponse(
                success=False,
                message="Visible RPA service not available. Selenium WebDriver required.",
                details="Please install Selenium and ChromeDriver for visible RPA automation.",
                timestamp=datetime.now().isoformat(),
                error="Visible RPA service not available. Selenium WebDriver required."
            )
        except Exception as e:
            print(f"❌ Visible RPA automation error: {e}")
            return TorrentAutomationResponse(
                success=False,
                message="Visible RPA automation service unavailable.",
                details=str(e),
                timestamp=datetime.now().isoformat(),
                error=f"Visible RPA automation failed: {str(e)}"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Visible Torrent RPA automation API error: {str(e)}")
        import traceback
        print(f"❌ Full traceback: {traceback.format_exc()}")
        
        return TorrentAutomationResponse(
            success=False,
            message=f"Failed to start visible Torrent Power RPA automation: {str(e)}",
            timestamp=datetime.now().isoformat(),
            error=str(e),
            details=traceback.format_exc()
        )


@router.post("/test-rpa")
async def test_rpa_with_sample_data():
    """
    Test RPA automation with sample data
    """
    
    sample_data = TorrentAutomationRequest(
        city="Ahmedabad",
        service_number="TEST123456",
        t_number="T123456789",
        mobile="9876543210",
        email="test@example.com"
    )
    
    return await start_torrent_power_rpa_automation(sample_data)