"""
Torrent Power RPA Service
Automates name change form filling on Torrent Power portal
"""
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
import logging

logger = logging.getLogger(__name__)

class TorrentPowerRPA:
    def __init__(self):
        self.driver = None
        self.wait = None
        
    def setup_driver(self):
        """Initialize Chrome driver with headless mode"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        self.driver = webdriver.Chrome(options=chrome_options)
        self.wait = WebDriverWait(self.driver, 10)
        
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
            
            # Navigate to Torrent Power portal
            logger.info("Navigating to Torrent Power portal...")
            self.driver.get("https://connect.torrentpower.com/")
            time.sleep(3)
            
            # Look for name change service request link
            logger.info("Looking for name change option...")
            
            # Try to find and click service request
            try:
                service_request = self.wait.until(
                    EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'Service Request')]"))
                )
                service_request.click()
                time.sleep(2)
            except:
                logger.warning("Service Request link not found, trying alternative...")
            
            # Fill service number
            try:
                service_field = self.wait.until(
                    EC.presence_of_element_located((By.NAME, "serviceNumber"))
                )
                service_field.clear()
                service_field.send_keys(form_data['service_number'])
                logger.info(f"Filled service number: {form_data['service_number']}")
            except Exception as e:
                logger.warning(f"Could not fill service number: {e}")
            
            # Fill old name
            try:
                old_name_field = self.driver.find_element(By.NAME, "oldName")
                old_name_field.clear()
                old_name_field.send_keys(form_data['old_name'])
                logger.info(f"Filled old name: {form_data['old_name']}")
            except Exception as e:
                logger.warning(f"Could not fill old name: {e}")
            
            # Fill new name
            try:
                new_name_field = self.driver.find_element(By.NAME, "newName")
                new_name_field.clear()
                new_name_field.send_keys(form_data['new_name'])
                logger.info(f"Filled new name: {form_data['new_name']}")
            except Exception as e:
                logger.warning(f"Could not fill new name: {e}")
            
            # Fill mobile
            try:
                mobile_field = self.driver.find_element(By.NAME, "mobile")
                mobile_field.clear()
                mobile_field.send_keys(form_data['mobile'])
                logger.info(f"Filled mobile: {form_data['mobile']}")
            except Exception as e:
                logger.warning(f"Could not fill mobile: {e}")
            
            # Fill email
            try:
                email_field = self.driver.find_element(By.NAME, "email")
                email_field.clear()
                email_field.send_keys(form_data['email'])
                logger.info(f"Filled email: {form_data['email']}")
            except Exception as e:
                logger.warning(f"Could not fill email: {e}")
            
            # Disable submit button
            logger.info("Disabling submit button...")
            try:
                submit_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Submit')]")
                self.driver.execute_script("arguments[0].disabled = true;", submit_button)
                self.driver.execute_script("arguments[0].style.opacity = '0.5';", submit_button)
                logger.info("Submit button disabled successfully")
            except Exception as e:
                logger.warning(f"Could not disable submit button: {e}")
            
            # Take screenshot
            screenshot_path = "/tmp/torrent_power_form.png"
            self.driver.save_screenshot(screenshot_path)
            logger.info(f"Screenshot saved: {screenshot_path}")
            
            return {
                "status": "success",
                "message": "Form filled successfully. Submit button disabled.",
                "screenshot": screenshot_path
            }
            
        except Exception as e:
            logger.error(f"Error filling form: {e}")
            return {
                "status": "error",
                "message": str(e)
            }
        finally:
            if self.driver:
                self.driver.quit()

# Test function
def test_torrent_power():
    rpa = TorrentPowerRPA()
    form_data = {
        'service_number': '123456789',
        'old_name': 'Rajesh Kumar',
        'new_name': 'Rajesh Kumar Singh',
        'mobile': '9876543210',
        'email': 'rajesh@example.com'
    }
    result = rpa.fill_name_change_form(form_data)wer()
rent_po test_tor  
 __main__":me__ == ")

if __nalt(resu
    print