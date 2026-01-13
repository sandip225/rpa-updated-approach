"""
Torrent Power RPA Service
Automates name change form filling on Torrent Power portal
https://connect.torrentpower.com/
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

class TorrentPowerRPA(BaseRPA):
    def __init__(self, headless=False):
        super().__init__(headless=headless)
        self.portal_url = "https://connect.torrentpower.com/"
        
    def fill_name_change_form(self, form_data):
        """
        Fill Torrent Power name change form
        
        Args:
            form_data: {
                'service_number': '123456789',
                'old_name': 'John Doe',
                'new_name': 'Jane Doe',
                'mobile': '9876543210',
                'email': 'jane@example.com'
            }
        """
        try:
            self.setup_driver()
            logger.info("=" * 60)
            logger.info("TORRENT POWER - NAME CHANGE FORM AUTOMATION")
            logger.info("=" * 60)
            
            # Navigate to portal
            logger.info(f"Navigating to {self.portal_url}")
            self.driver.get(self.portal_url)
            time.sleep(3)
            
            # Try to find name change form
            logger.info("Looking for name change form...")
            try:
                # Look for service request or name change link
                links = self.driver.find_elements(By.TAG_NAME, "a")
                for link in links:
                    text = link.text.lower()
                    if "name" in text or "service" in text or "request" in text:
                        logger.info(f"Found link: {link.text}")
                        link.click()
                        time.sleep(2)
                        break
            except Exception as e:
                logger.warning(f"Could not find service link: {e}")
            
            # Fill form fields
            logger.info("Filling form fields...")
            
            # Service number
            self._fill_field("service_number", form_data.get('service_number', ''), "Service Number")
            
            # Old name
            self._fill_field("old_name", form_data.get('old_name', ''), "Old Name")
            
            # New name
            self._fill_field("new_name", form_data.get('new_name', ''), "New Name")
            
            # Mobile
            self._fill_field("mobile", form_data.get('mobile', ''), "Mobile")
            
            # Email
            self._fill_field("email", form_data.get('email', ''), "Email")
            
            time.sleep(1)
            
            # Disable submit button
            logger.info("Disabling submit button...")
            self.disable_submit_button()
            
            # Take screenshot
            screenshot_path = "/tmp/torrent_power_form.png"
            self.take_screenshot(screenshot_path)
            
            logger.info("=" * 60)
            logger.info("✓ Form filled successfully!")
            logger.info("✓ Submit button disabled")
            logger.info("=" * 60)
            
            return {
                "status": "success",
                "message": "Form filled successfully. Submit button disabled.",
                "screenshot": screenshot_path,
                "portal": "Torrent Power",
                "service": "Name Change"
            }
            
        except Exception as e:
            logger.error(f"Error: {e}")
            return {
                "status": "error",
                "message": str(e),
                "portal": "Torrent Power"
            }
        finally:
            self.close_driver()
    
    def _fill_field(self, field_name, value, display_name):
        """Helper to fill form field"""
        if not value:
            return
        
        try:
            # Try by name attribute
            field = self.driver.find_element(By.NAME, field_name)
            field.clear()
            field.send_keys(value)
            logger.info(f"✓ Filled {display_name}: {value}")
        except:
            try:
                # Try by id attribute
                field = self.driver.find_element(By.ID, field_name)
                field.clear()
                field.send_keys(value)
                logger.info(f"✓ Filled {display_name}: {value}")
            except:
                logger.warning(f"✗ Could not fill {display_name}")

# Test
if __name__ == "__main__":
    rpa = TorrentPowerRPA(headless=False)  # Set to False to see browser
    
    form_data = {
        'service_number': 'TP123456789',
        'old_name': 'Rajesh Kumar',
        'new_name': 'Rajesh Kumar Singh',
        'mobile': '9876543210',
        'email': 'rajesh@example.com'
    }
    
    result = rpa.fill_name_change_form(form_data)
    print("\nResult:")
    print(result)
