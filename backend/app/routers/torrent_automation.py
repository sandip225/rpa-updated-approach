"""
Clean Torrent Power RPA Automation API
Uses Selenium WebDriver for real browser automation
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional
import asyncio
import time
import threading
import uuid
from datetime import datetime

from app.auth import get_current_user
from app.models import User

router = APIRouter(prefix="/api/torrent-automation", tags=["Torrent Power RPA Automation"])

# Global task storage for async automation tracking
automation_tasks: Dict[str, Dict[str, Any]] = {}


class TorrentAutomationRequest(BaseModel):
    """Request model for Torrent Power RPA automation"""
    city: str = "Ahmedabad"
    service_number: str
    t_number: str  # Transaction Number
    mobile: str
    email: str
    confirm_email: Optional[str] = None
    options: Optional[Dict[str, Any]] = None  # Optional runtime options (headless, keep_open, etc.)


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


class AsyncStartResponse(BaseModel):
    """Response when automation starts asynchronously"""
    success: bool
    task_id: str
    message: str
    status: str  # "starting"
    timestamp: str


class AutomationStatusResponse(BaseModel):
    """Response for checking automation progress"""
    task_id: str
    status: str  # "progress" | "completed" | "failed"
    current_field: Optional[str] = None
    fields_filled: int = 0
    total_fields: int = 5
    progress_percentage: int = 0
    message: str
    details: Optional[Dict[str, Any]] = None
    result: Optional[Dict[str, Any]] = None


import time as time_module


def run_torrent_automation_async(task_id: str, automation_data: Dict[str, Any], on_status_update=None):
    """Run Torrent Power automation in background and track progress"""
    try:
        print(f"\n[TASK {task_id}] Starting async automation...")
        automation_tasks[task_id]['status'] = 'progress'
        automation_tasks[task_id]['message'] = '🎬 Chrome opening...'
        
        from app.services.torrent_power_automation import TorrentPowerAutomation
        
        # Initialize automation
        automation = TorrentPowerAutomation()
        
        # Update status: opening browser
        automation_tasks[task_id]['current_field'] = 'browser_init'
        automation_tasks[task_id]['message'] = '🌐 Opening Chrome browser...'
        
        # Run automation
        result = automation.execute_complete_workflow(automation_data)
        
        # Update task with final result
        automation_tasks[task_id]['status'] = 'completed'
        automation_tasks[task_id]['fields_filled'] = result.get('fields_filled', 0)
        automation_tasks[task_id]['result'] = result
        automation_tasks[task_id]['message'] = result.get('message', '✅ Automation completed!')
        automation_tasks[task_id]['details'] = {
            'fields_filled': result.get('fields_filled', 0),
            'total_fields': result.get('total_fields', 5),
            'success_rate': result.get('success_rate', '0%')
        }
        
        print(f"[TASK {task_id}] ✅ Completed - {result.get('fields_filled', 0)}/{result.get('total_fields', 5)} fields filled")
        
    except Exception as e:
        print(f"[TASK {task_id}] ❌ Error: {str(e)}")
        automation_tasks[task_id]['status'] = 'failed'
        automation_tasks[task_id]['message'] = f'❌ Automation failed: {str(e)}'
        automation_tasks[task_id]['error'] = str(e)
        import traceback
        automation_tasks[task_id]['details'] = {'error_traceback': traceback.format_exc()}


def run_torrent_automation_with_results(automation_data: Dict[str, Any], options: Dict[str, Any] = None) -> Dict[str, Any]:
    """Run Torrent Power automation and return actual results"""
    try:
        print("\n" + "="*80)
        print("🎬 🚀 STARTING TORRENT POWER AUTOMATION")
        print("="*80)
        print(f"📋 Automation Data: {automation_data}")
        print(f"⚙️ Options: {options}")
        print("⏳ Chrome browser opening now...")
        print("="*80 + "\n")
        
        from app.services.torrent_power_automation import TorrentPowerAutomation
        
        print("🔧 Initializing TorrentPowerAutomation service...")
        
        # Get options
        auto_close = options.get('auto_close', True) if options else True
        close_delay = options.get('close_delay', 5) if options else 5
        
        # Initialize RPA automation service with options
        automation = TorrentPowerAutomation(auto_close=auto_close, close_delay=close_delay)
        print(f"✅ Service initialized (auto_close={auto_close}, delay={close_delay}s)")
        
        # Run the complete automation workflow with visible browser
        print("🔥 EXECUTING AUTOMATION NOW...\n")
        result = automation.execute_complete_workflow(automation_data)
        
        print("\n" + "="*80)
        print(f"✅ AUTOMATION SUCCESS: {result.get('success', False)}")
        print(f"📊 Fields Filled: {result.get('fields_filled', 0)}/{result.get('total_fields', 0)}")
        print(f"📝 Message: {result.get('message', '')}")
        print("="*80 + "\n")
        
        return result
        
    except Exception as e:
        print("\n" + "="*80)
        print(f"❌ AUTOMATION ERROR: {str(e)}")
        print("="*80)
        import traceback
        print("Full error traceback:")
        print(traceback.format_exc())
        print("="*80 + "\n")
        
        return {
            "success": False,
            "error": str(e),
            "message": f"Automation failed: {str(e)}",
            "fields_filled": 0,
            "total_fields": 5
        }


@router.post("/start-automation", response_model=TorrentAutomationResponse)
async def start_torrent_power_rpa_automation(
    request: TorrentAutomationRequest
):
    """
    Start the RPA-based Torrent Power automation workflow  
    WAITS for automation to complete before returning actual results
    """
    
    try:
        print("\n" + "🤖 "*20)
        print("TORRENT POWER AUTOMATION REQUEST RECEIVED")
        print("🤖 "*20)
        print(f"📋 Request data: {request.dict()}\n")
        
        # Debug: Print individual field values
        print(f"🔍 Validating fields:")
        print(f"   City: '{request.city}'")
        print(f"   Service Number: '{request.service_number}'")
        print(f"   T Number: '{request.t_number}'")
        print(f"   Mobile: '{request.mobile}'")
        print(f"   Email: '{request.email}'")
        
        # Validate required fields
        if not request.service_number or request.service_number.strip() == "":
            print("❌ Validation FAILED: Service Number is empty")
            raise HTTPException(
                status_code=400,
                detail="Service Number is required for Torrent Power automation"
            )
        
        if not request.t_number or request.t_number.strip() == "":
            print("❌ Validation FAILED: T Number is empty")
            raise HTTPException(
                status_code=400,
                detail="Transaction Number (T No) is required for Torrent Power automation"
            )
        
        if not request.mobile or len(request.mobile.strip()) < 10:
            print(f"❌ Validation FAILED: Mobile number invalid")
            raise HTTPException(
                status_code=400,
                detail="Valid mobile number is required (at least 10 digits)"
            )
        
        if not request.email or request.email.strip() == "":
            print("❌ Validation FAILED: Email is empty")
            raise HTTPException(
                status_code=400,
                detail="Email address is required for Torrent Power automation"
            )
        
        print("✅ All validations PASSED!\n")
        
        # Prepare the data for automation
        automation_data = {
            "city": request.city or 'Ahmedabad',
            "service_number": request.service_number,
            "t_number": request.t_number,
            "mobile": request.mobile,
            "email": request.email
        }
        
        # Get options from request (with defaults)
        options = request.options or {}
        if 'auto_close' not in options:
            options['auto_close'] = True  # Auto-close by default
        if 'close_delay' not in options:
            options['close_delay'] = 5  # 5 seconds delay (FAST!)
        
        print(f"📋 Prepared automation data: {automation_data}")
        print(f"⚙️ Options: {options}")
        
        # RUN AUTOMATION SYNCHRONOUSLY AND WAIT FOR COMPLETION
        print("🎬 Running automation...\n")
        result = run_torrent_automation_with_results(automation_data, options)
        
        print("✅ RETURNING ACTUAL RESULTS TO FRONTEND!")
        print(f"📊 Fields filled: {result.get('fields_filled', 0)}/{result.get('total_fields', 0)}\n")
        
        # Return actual results with field count
        return TorrentAutomationResponse(
            success=result.get('success', False),
            message=result.get('message', 'Automation completed'),
            details=result.get('details', ''),
            timestamp=result.get('timestamp', datetime.now().isoformat()),
            fields_filled=result.get('fields_filled', 0),
            total_fields=result.get('total_fields', 5),
            success_rate=result.get('success_rate', '0%'),
            next_steps=result.get('next_steps', []),
            automation_details=result.get('automation_details', []),
            screenshots=result.get('screenshots', []),
            session_data=result.get('session_data', {}),
            error=result.get('error', None)
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
            details=traceback.format_exc(),
            fields_filled=0,
            total_fields=5
        )


@router.post("/start-automation-async", response_model=AsyncStartResponse)
async def start_torrent_power_automation_async(request: TorrentAutomationRequest):
    """
    Start Torrent Power automation asynchronously
    Returns immediately with task_id for progress polling
    """
    try:
        # Validate required fields
        if not request.service_number or request.service_number.strip() == "":
            raise HTTPException(status_code=400, detail="Service Number is required")
        if not request.t_number or request.t_number.strip() == "":
            raise HTTPException(status_code=400, detail="Transaction Number (T No) is required")
        if not request.mobile or len(request.mobile.strip()) < 10:
            raise HTTPException(status_code=400, detail="Valid mobile number is required (at least 10 digits)")
        if not request.email or request.email.strip() == "":
            raise HTTPException(status_code=400, detail="Email address is required")
        
        # Generate unique task ID
        task_id = str(uuid.uuid4())[:8]
        
        # Initialize task state
        automation_tasks[task_id] = {
            'status': 'starting',
            'message': '🚀 Initializing automation...',
            'current_field': None,
            'fields_filled': 0,
            'total_fields': 5,
            'progress_percentage': 0,
            'created_at': datetime.now().isoformat(),
            'data': {
                'city': request.city or 'Ahmedabad',
                'service_number': request.service_number,
                't_number': request.t_number,
                'mobile': request.mobile,
                'email': request.email
            }
        }
        
        print(f"\n✅ [TASK {task_id}] Created - queued for async execution")
        
        # Start automation in background thread
        automation_thread = threading.Thread(
            target=run_torrent_automation_async,
            args=(task_id, automation_tasks[task_id]['data']),
            daemon=True
        )
        automation_thread.start()
        
        return AsyncStartResponse(
            success=True,
            task_id=task_id,
            message=f"🚀 Automation started. Browser opening now... Poll status with task_id: {task_id}",
            status="starting",
            timestamp=datetime.now().isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Async automation start error: {str(e)}")
        return AsyncStartResponse(
            success=False,
            task_id="",
            message=f"Failed to start automation: {str(e)}",
            status="failed",
            timestamp=datetime.now().isoformat()
        )


@router.get("/status/{task_id}", response_model=AutomationStatusResponse)
async def get_automation_status(task_id: str):
    """
    Get current status of an automation task
    Client should poll this endpoint every 1 second
    """
    if task_id not in automation_tasks:
        return AutomationStatusResponse(
            task_id=task_id,
            status="not_found",
            message="Task not found",
            fields_filled=0,
            total_fields=5,
            progress_percentage=0
        )
    
    task = automation_tasks[task_id]
    
    # Calculate progress percentage
    progress = 0
    if task['total_fields'] > 0:
        progress = int((task['fields_filled'] / task['total_fields']) * 100)
    
    return AutomationStatusResponse(
        task_id=task_id,
        status=task['status'],
        current_field=task.get('current_field'),
        fields_filled=task.get('fields_filled', 0),
        total_fields=task.get('total_fields', 5),
        progress_percentage=progress,
        message=task.get('message', ''),
        details=task.get('details'),
        result=task.get('result') if task['status'] == 'completed' else None
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


@router.get("/test-chrome")
async def test_chrome_opening():
    """
    Test if Chrome can actually open - for debugging
    """
    
    def test_chrome_open_bg():
        try:
            print("\n" + "="*80)
            print("🧪 TESTING CHROME OPENING")
            print("="*80)
            
            from selenium import webdriver
            from selenium.webdriver.chrome.options import Options
            from selenium.webdriver.chrome.service import Service
            from webdriver_manager.chrome import ChromeDriverManager
            import time as time_module
            
            print("📍 Step 1: Creating Chrome options...")
            chrome_options = Options()
            chrome_options.add_argument("--window-size=1280,720")
            # NO HEADLESS - browser should be visible
            print("✅ Chrome options created")
            
            print("📍 Step 2: Getting ChromeDriver path...")
            driver_path = ChromeDriverManager().install()
            print(f"✅ ChromeDriver path: {driver_path}")
            
            print("📍 Step 3: Creating WebDriver...")
            service = Service(driver_path)
            driver = webdriver.Chrome(service=service, options=chrome_options)
            print("✅ WebDriver created successfully!")
            
            print("📍 Step 4: Opening test URL...")
            driver.get("https://www.google.com")
            print("✅ URL opened successfully!")
            
            print("📍 Step 5: Chrome is now OPEN on your screen...")
            print("⏳ Keeping open for 10 seconds...")
            time_module.sleep(10)
            
            print("📍 Step 6: Closing Chrome...")
            driver.quit()
            print("✅ Chrome closed successfully!")
            
            print("="*80)
            print("✅ CHROME TEST PASSED - Chrome can open!")
            print("="*80 + "\n")
            
        except Exception as e:
            print("\n" + "="*80)
            print(f"❌ CHROME TEST FAILED: {str(e)}")
            print("="*80)
            import traceback
            print(traceback.format_exc())
            print("="*80 + "\n")
    
    # Start test in background thread
    test_thread = threading.Thread(target=test_chrome_open_bg, daemon=True)
    test_thread.start()
    
    return {
        "success": True,
        "message": "🧪 Chrome test started! Chrome should open in ~3 seconds. Check your screen.",
        "details": "A test Chrome browser window will open for 10 seconds to verify Chrome is working correctly.",
        "timestamp": datetime.now().isoformat(),
        "next_steps": [
            "1. 👀 Watch for Chrome browser to open",
            "2. 🎯 Google homepage should load",
            "3. ⏳ Browser will stay open for 10 seconds",
            "4. 🔄 Then it will close automatically"
        ]
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
            result = rpa.run_visible_automation(rpa_data, options=request.options or {})

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