"""
Mock RPA Service - Simulates auto-fill without opening Chrome windows
This provides the same user experience without separate browser windows
"""

import time
import logging
import random
from typing import Dict, Any
from datetime import datetime
from app.database import get_db
from app.models import (
    DemoTorrentApplication, 
    DemoAdaniGasApplication, 
    DemoAmcWaterApplication, 
    DemoAnyrorApplication
)

logger = logging.getLogger(__name__)

class MockRPAService:
    """Mock RPA Service that simulates auto-fill without opening Chrome windows"""
    
    def __init__(self):
        logger.info("Mock RPA Service initialized - No Chrome windows will open")
    
    def submit_torrent_power_application(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate Torrent Power application submission"""
        try:
            logger.info(f"Mock RPA: Starting Torrent Power submission for service: {data.get('service_number')}")
            
            # Simulate processing time (like real RPA would take)
            time.sleep(3)
            
            # Generate confirmation number
            confirmation_number = f"TP{datetime.now().year}{random.randint(100000, 999999)}"
            
            # Save to demo database (same as real RPA would do)
            try:
                db = next(get_db())
                demo_app = DemoTorrentApplication(
                    confirmation_number=confirmation_number,
                    service_number=data.get('service_number'),
                    t_no=data.get('t_no'),
                    applicant_name=data.get('applicant_name'),
                    mobile=data.get('mobile'),
                    email=data.get('email'),
                    application_type=data.get('application_type'),
                    processing_notes=f"Mock RPA: Application received for {data.get('application_type')} in {data.get('city')}"
                )
                
                db.add(demo_app)
                db.commit()
                db.refresh(demo_app)
                db.close()
                
                logger.info(f"Mock RPA: Saved to demo database with confirmation: {confirmation_number}")
            except Exception as db_error:
                logger.warning(f"Mock RPA: Could not save to demo database: {db_error}")
            
            logger.info(f"Mock RPA: Torrent Power application submitted successfully. Confirmation: {confirmation_number}")
            
            return {
                "success": True,
                "confirmation_number": confirmation_number,
                "message": "Application submitted successfully via Mock RPA",
                "screenshot_path": None,
                "submitted_data": data
            }
            
        except Exception as e:
            logger.error(f"Mock RPA: Torrent Power submission failed: {str(e)}")
            
            return {
                "success": False,
                "error": str(e),
                "message": "Mock RPA submission failed",
                "submitted_data": data
            }
    
    def submit_adani_gas_application(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate Adani Gas application submission"""
        try:
            logger.info(f"Mock RPA: Starting Adani Gas submission for consumer: {data.get('consumer_number')}")
            
            # Simulate processing time
            time.sleep(3)
            
            # Generate confirmation number
            confirmation_number = f"AG{datetime.now().year}{random.randint(100000, 999999)}"
            
            # Save to demo database
            try:
                db = next(get_db())
                demo_app = DemoAdaniGasApplication(
                    confirmation_number=confirmation_number,
                    consumer_number=data.get('consumer_number'),
                    bp_number=data.get('bp_number'),
                    applicant_name=data.get('applicant_name'),
                    mobile=data.get('mobile'),
                    email=data.get('email'),
                    application_type=data.get('application_type'),
                    processing_notes=f"Mock RPA: Application received for {data.get('application_type')} in {data.get('city')}"
                )
                
                db.add(demo_app)
                db.commit()
                db.refresh(demo_app)
                db.close()
                
                logger.info(f"Mock RPA: Saved to demo database with confirmation: {confirmation_number}")
            except Exception as db_error:
                logger.warning(f"Mock RPA: Could not save to demo database: {db_error}")
            
            logger.info(f"Mock RPA: Adani Gas application submitted successfully. Confirmation: {confirmation_number}")
            
            return {
                "success": True,
                "confirmation_number": confirmation_number,
                "message": "Adani Gas application submitted successfully via Mock RPA",
                "screenshot_path": None,
                "submitted_data": data
            }
            
        except Exception as e:
            logger.error(f"Mock RPA: Adani Gas submission failed: {str(e)}")
            
            return {
                "success": False,
                "error": str(e),
                "message": "Mock RPA submission failed",
                "submitted_data": data
            }
    
    def submit_amc_water_application(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate AMC Water application submission"""
        try:
            logger.info(f"Mock RPA: Starting AMC Water submission for connection: {data.get('connection_id')}")
            
            # Simulate processing time
            time.sleep(3)
            
            # Generate confirmation number
            confirmation_number = f"AMC{datetime.now().year}{random.randint(100000, 999999)}"
            
            # Save to demo database
            try:
                db = next(get_db())
                demo_app = DemoAmcWaterApplication(
                    confirmation_number=confirmation_number,
                    connection_id=data.get('connection_id'),
                    zone=data.get('zone', 'Central Zone'),
                    applicant_name=data.get('applicant_name'),
                    mobile=data.get('mobile'),
                    email=data.get('email'),
                    application_type=data.get('application_type'),
                    processing_notes=f"Mock RPA: Application received for {data.get('application_type')} in {data.get('city')}"
                )
                
                db.add(demo_app)
                db.commit()
                db.refresh(demo_app)
                db.close()
                
                logger.info(f"Mock RPA: Saved to demo database with confirmation: {confirmation_number}")
            except Exception as db_error:
                logger.warning(f"Mock RPA: Could not save to demo database: {db_error}")
            
            logger.info(f"Mock RPA: AMC Water application submitted successfully. Confirmation: {confirmation_number}")
            
            return {
                "success": True,
                "confirmation_number": confirmation_number,
                "message": "AMC Water application submitted successfully via Mock RPA",
                "screenshot_path": None,
                "submitted_data": data
            }
            
        except Exception as e:
            logger.error(f"Mock RPA: AMC Water submission failed: {str(e)}")
            
            return {
                "success": False,
                "error": str(e),
                "message": "Mock RPA submission failed",
                "submitted_data": data
            }
    
    def submit_anyror_gujarat_application(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate AnyRoR Gujarat application submission"""
        try:
            logger.info(f"Mock RPA: Starting AnyRoR Gujarat submission for survey: {data.get('survey_number')}")
            
            # Simulate processing time
            time.sleep(3)
            
            # Generate confirmation number
            confirmation_number = f"ROR{datetime.now().year}{random.randint(100000, 999999)}"
            
            # Save to demo database
            try:
                db = next(get_db())
                demo_app = DemoAnyrorApplication(
                    confirmation_number=confirmation_number,
                    survey_number=data.get('survey_number'),
                    property_id=data.get('subdivision_number') or data.get('property_id'),
                    district=data.get('city'),
                    applicant_name=data.get('applicant_name'),
                    mobile=data.get('mobile'),
                    email=data.get('email'),
                    application_type=data.get('application_type'),
                    processing_notes=f"Mock RPA: Application received for {data.get('application_type')} in {data.get('city')}"
                )
                
                db.add(demo_app)
                db.commit()
                db.refresh(demo_app)
                db.close()
                
                logger.info(f"Mock RPA: Saved to demo database with confirmation: {confirmation_number}")
            except Exception as db_error:
                logger.warning(f"Mock RPA: Could not save to demo database: {db_error}")
            
            logger.info(f"Mock RPA: AnyRoR Gujarat application submitted successfully. Confirmation: {confirmation_number}")
            
            return {
                "success": True,
                "confirmation_number": confirmation_number,
                "message": "AnyRoR Gujarat application submitted successfully via Mock RPA",
                "screenshot_path": None,
                "submitted_data": data
            }
            
        except Exception as e:
            logger.error(f"Mock RPA: AnyRoR Gujarat submission failed: {str(e)}")
            
            return {
                "success": False,
                "error": str(e),
                "message": "Mock RPA submission failed",
                "submitted_data": data
            }

# Global Mock RPA service instance
mock_rpa_service = MockRPAService()