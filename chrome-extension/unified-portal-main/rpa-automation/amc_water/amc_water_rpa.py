"""
AMC Water RPA Service
Automates name change form filling on AMC portal
https://ahmedabadcity.gov.in/
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from common.base_rpa import BaseRPA
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AMCWaterRPA(BaseRPA):
    def __init__(self, headless=False):
        super().__init__(headless=headless)
        self.portal_url = "https://ahmedabadcity.gov.in/"
        
    def fill_name_change_form(self, form_data):
        """
        Fill AMC Water name change form
        
        Args:
            form_data: {
                'connection_id': 'AMC123456',
                'old_name': 'John Doe',
                'new_name': 'Jane Doe',
                'mobile': '9876543210',
                'email': 'jane@example.com',
                'ward': 'Ward 1'
            }
        """
        try:
            self.setup_driver()
            logger.info("=" * 60)
            logger.info("AMC WATER - NAME CHANGE FORM AUTOMATION")
            logger.info("=" * 60)
            
            # Navigate to portal
            logger.info(f"Navigating to {self.portal_url}")
            self.driver.get(self.portal_url)
            time.sleep(3)
            
            # Look for water services or name change
            logger.info("Looking for water services...")
            try:
                links = self.driver.find_elements(By.TAG_NAME, "a")
                for link in links:
                    text = link.text.lower()
                    if "water" in text or "service" in text or "name" in text:
                        logger.info(f"Found link: {link.text}")
                        link.click()
                        time.sleep(2)
                        break
            except Exception as e:
                logger.warning(f"Could not find water services link: {e}")
            
            # Fill form fields
            logger.info("Filling form fields...")
            
            # Connection ID
            self._fill_field("connection_id", form_data.get('connection_id', ''), "Connection ID")
            
            # Old name
            self._fill_field("old_name", form_data.get('old_name', ''), "Old Name")
            
            # New name
            self._fill_field("new_name", form_data.get('new_name', ''), "New Name")
            
            # Mobile
            self._fill_field("mobile", form_data.get('mobile', ''), "Mobile")
            
            # Email
            self._fill_field("email", form_data.get('email', ''), "Email")
            
            # Ward
            self._fill_field("ward", form_data.get('ward', ''), "Ward")
            
            time.sleep(1)
            
            # Disable submit button
            logger.info("Disabling submit button...")
            self.disable_submit_button()
            
            # Take screenshot
            screenshot_path = "/tmp/amc_water_form.png"
            self.take_screenshot(screenshot_path)
            
            logger.info("=" * 60)
            logger.info("✓ Form filled successfully!")
            logger.info("✓ Submit button disabled")
            logger.info("=" * 60)
            
            return {
                "status": "success",
                "message": "Form filled successfully. Submit button disabled.",
                "screenshot": screenshot_path,
                "portal": "AMC Water",
                "service": "Name Change"
            }
            
        except Exception as e:
            logger.error(f"Error: {e}")
            return {
                "status": "error",
                "message": str(e),
                "portal": "AMC Water"
            }
        finally:
            self.close_driver()
    
    def _fill_field(self, field_name, value, display_name):
        """Helper to fill form field"""
        if not value:
            return
        
        try:
            field = self.driver.find_element(By.NAME, field_name)
            field.clear()
            field.send_keys(value)
            logger.info(f"✓ Filled {display_name}: {value}")
        except:
            try:
                field = self.driver.find_element(By.ID, field_name)
                field.clear()
                field.send_keys(value)
                logger.info(f"✓ Filled {display_name}: {value}")
            except:
                logger.warning(f"✗ Could not fill {display_name}")

if __name__ == "__main__":
    rpa = AMCWaterRPA(headless=False)
    
    form_data = {
        'connection_id': 'AMC123456',
        'old_name': 'Rajesh Kumar',
        'new_name': 'Rajesh Kumar Singh',
        'mobile': '9876543210',
        'email': 'rajesh@example.com',
        'ward': 'Ward 1'
    }
    
    result = rpa.fill_name_change_form(form_data)
    print("\nResult:")
    print(result)
