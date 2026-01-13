"""
DGVCL RPA Integration - Auto-fill portal without extension
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import subprocess
import json
import os
from pathlib import Path

router = APIRouter(prefix="/api/rpa", tags=["RPA Automation"])

class DGVCLAutoFillRequest(BaseModel):
    mobile: str
    consumer_number: Optional[str] = None
    applicant_name: Optional[str] = None
    email: Optional[str] = None
    discom: str = "DGVCL"

class RPAResponse(BaseModel):
    success: bool
    message: str
    session_id: Optional[str] = None
    portal_url: Optional[str] = None
    screenshots: Optional[list] = None

# Store active RPA sessions
active_sessions = {}

@router.post("/dgvcl/auto-fill", response_model=RPAResponse)
async def trigger_dgvcl_autofill(
    request: DGVCLAutoFillRequest,
    background_tasks: BackgroundTasks
):
    """
    Trigger RPA bot to auto-fill DGVCL portal
    Bot will open browser and fill form automatically
    """
    try:
        # Get RPA script path - check multiple locations
        rpa_script_paths = [
            Path("/app/rpa-automation/dgvcl_name_change_final.py"),  # Docker absolute path
            Path(__file__).parent.parent / "rpa-automation" / "dgvcl_name_change_final.py",  # Relative to app
            Path(__file__).parent.parent.parent / "rpa-automation" / "dgvcl_name_change_final.py",  # Root
        ]
        
        rpa_script = None
        for path in rpa_script_paths:
            if path.exists():
                rpa_script = path
                break
        
        if not rpa_script:
            raise HTTPException(
                status_code=500,
                detail=f"RPA script not found. Checked: {[str(p) for p in rpa_script_paths]}"
            )
        
        # Prepare data for RPA bot
        rpa_data = {
            "mobile": request.mobile,
            "consumer_number": request.consumer_number,
            "applicant_name": request.applicant_name,
            "email": request.email,
            "discom": request.discom
        }
        
        # Save data to temp file for RPA bot to read
        temp_file = Path("/tmp/dgvcl_rpa_data.json")
        with open(temp_file, "w") as f:
            json.dump(rpa_data, f)
        
        # Run RPA bot in background (async)
        background_tasks.add_task(run_rpa_bot, str(rpa_script), str(temp_file))
        
        # Return immediate response
        return RPAResponse(
            success=True,
            message="RPA bot started! Processing in background. Check logs for screenshots.",
            portal_url="https://portal.guvnl.in/login.php",
            screenshots=[]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to start RPA bot: {str(e)}"
        )

def run_rpa_bot(script_path: str, data_file: str):
    """Run RPA bot in background and return screenshots"""
    try:
        # Run Python script
        result = subprocess.run(
            ["python3", script_path, data_file],
            capture_output=True,
            text=True,
            timeout=60  # 1 minute timeout (faster for login only)
        )
        
        if result.returncode == 0:
            print(f"✅ RPA bot completed successfully")
            print(result.stdout)
            
            # Read result file
            result_file = Path("/tmp/dgvcl_rpa_result.json")
            if result_file.exists():
                with open(result_file, 'r') as f:
                    rpa_result = json.load(f)
                print(f"📸 Screenshots: {rpa_result.get('screenshots', [])}")
                return rpa_result
        else:
            print(f"❌ RPA bot failed: {result.stderr}")
            return {"success": False, "error": result.stderr}
            
    except subprocess.TimeoutExpired:
        print("⏰ RPA bot timeout after 1 minute")
        return {"success": False, "error": "Timeout"}
    except Exception as e:
        print(f"❌ RPA bot error: {str(e)}")
        return {"success": False, "error": str(e)}

@router.get("/dgvcl/status/{session_id}")
async def get_rpa_status(session_id: str):
    """Get RPA bot status"""
    if session_id in active_sessions:
        return active_sessions[session_id]
    else:
        return {
            "status": "not_found",
            "message": "Session not found"
        }
