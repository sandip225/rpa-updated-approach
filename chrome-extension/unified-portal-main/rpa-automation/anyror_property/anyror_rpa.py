"""
AnyROR Property RPA Service
Automates name transfer form filling on AnyROR portal
https://anyror.gujarat.gov.in/
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

class AnyRORPropertyRPA(BaseRPA):
    def __init__(self, headless=False):
        super().__init__(headless=headless)
        self.portal_url = "https://anyror.gujarat.gov.in/"
        
    def fill_name_transfer_form(self, form_data):
        """
        Fill AnyROR name transfer form (Form 6)
        
        Args:
            form_data: {
                'survey_number': '123/1/A',
                'old_owner': 'John Doe',
                'new_owner': 'Jane Doe',
                'mobile': '9876543210',
                'email': 'jane@example.com',
                'district': 'Ahmedabad',
                'taluka': 'Ahmedabad City'
            }
        """
        try:
            self.setup_driver()
            logger.info("=" * 60)
            logger.info("ANYROR PROPERTY - NAME TRANSFER FORM AUTOMATION")
            logger.info("=" * 60)
            
            # Navigate to portal
            logger.info(f"Navigating to {self.portal_url}")
            self.driver.get(self.portal_url)
            time.sleep(3)
            
            # Look for Form 6 or name transfer
            logger.info("Looking for name transfer option...")
            try:
                links = self.driver.find_elements(By.TAG_NAME, "a")
                for link in links:
                    text = link.text.lower()
                    if "form 6" in text or "transfer" in text or "mutation" in text or "name" in text:
                        logger.info(f"Found link: {link.text}")
                        link.click()
                        time.sleep(2)
                        break
            except Exception as e:
                logger.warning(f"Could not find form link: {e}")
            
            # Fill form fields
            logger.info("Filling form fields...")
            
            # Survey number
            self._fill_field("survey_number", form_data.get('survey_number', ''), "Survey Number")
            
            # Old owner
            self._fill_field("old_owner", form_data.get('old_owner', ''), "Old Owner Name")
            
            # New owner
            self._fill_field("new_owner", form_data.get('new_owner', ''), "New Owner Name")
            
            # Mobile
            self._fill_field("mobile", form_data.get('mobile', ''), "Mobile")
            
            # Email
            self._fill_field("email", form_data.get('email', ''), "Email")
            
            # District
            self._fill_field("district", form_data.get('district', ''), "District")
            
            # Taluka
            self._fill_field("taluka", form_data.get('taluka', ''), "Taluka")
            
            time.sleep(1)
            
            # Disable submit button
            logger.info("Disabling submit button...")
            self.disable_submit_button()
            
            # Take screenshot
            screenshot_path = "/tmp/anyror_property_form.png"
            self.take_screenshot(screenshot_path)
            
            logger.info("=" * 60)
            logger.info("✓ Form filled successfully!")
            logger.info("✓ Submit button disabled")
            logger.info("=" * 60)
            
            return {
                "status": "success",
                "message": "Form filled successfully. Submit button disabled.",
                "screenshot": screenshot_path,
                "portal": "AnyROR",
                "service": "Name Transfer (Form 6)"
            }
            
        except Exception as e:
            logger.error(f"Error: {e}")
            return {
                "status": "error",
                "message": str(e),
                "portal": "AnyROR"
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
    rpa = AnyRORPropertyRPA(headless=False)
    
    form_data = {
        'survey_number': '123/1/A',
        'old_owner': 'Rajesh Kumar',
        'new_owner': 'Rajesh Kumar Singh',
        'mobile': '9876543210',
        'email': 'rajesh@example.com',
        'district': 'Ahmedabad',
        'taluka': 'Ahmedabad City'
    }
    
    result = rpa.fill_name_transfer_form(form_data)
    print("\nResult:")
    print(result)
