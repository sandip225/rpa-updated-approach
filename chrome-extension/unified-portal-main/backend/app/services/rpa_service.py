import time
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from typing import Dict, Any, Optional
import random
import os
from datetime import datetime

logger = logging.getLogger(__name__)

class RPAService:
    """RPA Service for automating government website form submissions"""
    
    def __init__(self):
        self.driver = None
        self.wait = None
        # Create screenshots directory
        os.makedirs("screenshots", exist_ok=True)
    
    def setup_driver(self, headless: bool = False, embedded_mode: bool = True) -> webdriver.Chrome:
        """Setup Chrome WebDriver with options for embedded viewing"""
        chrome_options = Options()
        
        if embedded_mode:
            # For embedded mode, we'll use headless and capture screenshots
            chrome_options.add_argument('--headless')
        elif headless:
            chrome_options.add_argument('--headless')
        
        # Enhanced Chrome options for Windows stability
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--disable-web-security')
        chrome_options.add_argument('--disable-features=VizDisplayCompositor')
        chrome_options.add_argument('--window-size=1200,800')
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_argument('--disable-plugins')
        
        try:
            # Install ChromeDriver automatically
            service = Service(ChromeDriverManager().install())
            
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            self.wait = WebDriverWait(self.driver, 20)
            
            return self.driver
        except Exception as e:
            logger.error(f"Failed to setup Chrome driver: {e}")
            raise e
    
    def close_driver(self):
        """Close the WebDriver"""
        if self.driver:
            self.driver.quit()
            self.driver = None
            self.wait = None
    
    def submit_torrent_power_application(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Submit application to demo Torrent Power website
        
        Args:
            data: Dictionary containing form data
            
        Returns:
            Dictionary with submission result
        """
        try:
            logger.info(f"Starting Torrent Power RPA submission for service: {data.get('service_number')}")
            
            # SAFETY CHECK: Only allow demo URLs
            demo_url = "http://localhost:8000/demo-govt/torrent-power"
            
            # BLOCK real Torrent Power URLs
            blocked_urls = [
                "https://connect.torrentpower.com",
                "https://www.torrentpower.com",
                "torrentpower.com"
            ]
            
            logger.info(f"🛡️ SAFETY MODE: Using demo URL only - {demo_url}")
            
            # Setup driver in visible mode so user can see the auto-fill process
            self.setup_driver(headless=False)  # Visible mode to show RPA in action
            
            # Navigate to demo form ONLY (our safe demo site)
            logger.info(f"Navigating to DEMO site: {demo_url}")
            self.driver.get(demo_url)
            
            # Wait for page to load
            self.wait.until(EC.presence_of_element_located((By.ID, "applicationForm")))
            
            # Fill City dropdown
            if data.get('city'):
                city_select = Select(self.wait.until(EC.element_to_be_clickable((By.ID, "city"))))
                city_select.select_by_visible_text(data['city'])
                logger.info(f"Selected city: {data['city']}")
                time.sleep(1)
            
            # Fill Service Number (map from service_number)
            if data.get('service_number'):
                service_field = self.wait.until(EC.element_to_be_clickable((By.ID, "serviceNumber")))
                service_field.clear()
                service_field.send_keys(data['service_number'])
                logger.info(f"Filled service number: {data['service_number']}")
                time.sleep(0.5)
            
            # Fill T No (map from t_no)
            if data.get('t_no'):
                t_no_field = self.wait.until(EC.element_to_be_clickable((By.ID, "tNo")))
                t_no_field.clear()
                t_no_field.send_keys(data['t_no'])
                logger.info(f"Filled T No: {data['t_no']}")
                time.sleep(0.5)
            
            # Fill Applicant Name
            if data.get('applicant_name'):
                name_field = self.wait.until(EC.element_to_be_clickable((By.ID, "applicantName")))
                name_field.clear()
                name_field.send_keys(data['applicant_name'])
                logger.info(f"Filled applicant name: {data['applicant_name']}")
                time.sleep(0.5)
            
            # Fill Mobile
            if data.get('mobile'):
                mobile_field = self.wait.until(EC.element_to_be_clickable((By.ID, "mobile")))
                mobile_field.clear()
                mobile_field.send_keys(data['mobile'])
                logger.info(f"Filled mobile: {data['mobile']}")
                time.sleep(0.5)
            
            # Fill Email (optional)
            if data.get('email'):
                email_field = self.wait.until(EC.element_to_be_clickable((By.ID, "email")))
                email_field.clear()
                email_field.send_keys(data['email'])
                logger.info(f"Filled email: {data['email']}")
                time.sleep(0.5)
            
            # Select Application Type
            if data.get('application_type'):
                app_type_select = Select(self.wait.until(EC.element_to_be_clickable((By.ID, "applicationType"))))
                app_type_select.select_by_value(data['application_type'])
                logger.info(f"Selected application type: {data['application_type']}")
                time.sleep(1)
            
            # Submit form
            submit_btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".submit-btn")))
            logger.info("Clicking submit button...")
            submit_btn.click()
            
            # Wait for success page and extract confirmation number
            self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".conf-number")))
            
            confirmation_element = self.driver.find_element(By.CSS_SELECTOR, ".conf-number")
            confirmation_number = confirmation_element.text.strip()
            
            logger.info(f"Application submitted successfully. Confirmation: {confirmation_number}")
            
            # Take screenshot for proof
            screenshot_path = f"screenshots/torrent_{confirmation_number}.png"
            try:
                self.driver.save_screenshot(screenshot_path)
                logger.info(f"Screenshot saved: {screenshot_path}")
            except Exception as e:
                logger.warning(f"Could not save screenshot: {e}")
                screenshot_path = None
            
            # IMPORTANT: Close driver immediately to prevent any redirects
            self.close_driver()
            
            return {
                "success": True,
                "confirmation_number": confirmation_number,
                "message": "Application submitted successfully via RPA",
                "screenshot_path": screenshot_path,
                "submitted_data": data
            }
            
        except Exception as e:
            logger.error(f"RPA submission failed: {str(e)}")
            
            # Take error screenshot
            try:
                if self.driver:
                    error_screenshot = f"screenshots/error_{int(time.time())}.png"
                    self.driver.save_screenshot(error_screenshot)
                    logger.info(f"Error screenshot saved: {error_screenshot}")
            except:
                pass
            
            return {
                "success": False,
                "error": str(e),
                "message": "RPA submission failed",
                "submitted_data": data
            }
            
        finally:
            # Always close driver to prevent any browser windows staying open
            self.close_driver()
    
    def submit_adani_gas_application(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Submit application to demo Adani Gas website with real Chrome automation"""
        try:
            logger.info(f"Starting Adani Gas RPA submission for consumer: {data.get('consumer_number')}")
            
            # SAFETY CHECK: Only allow demo URLs
            demo_url = "http://localhost:8000/demo-govt/adani-gas"
            
            logger.info(f"🛡️ SAFETY MODE: Using demo URL only - {demo_url}")
            
            # Setup driver in visible mode so user can see the auto-fill process
            self.setup_driver(headless=False)  # Visible mode to show RPA in action
            
            # Navigate to demo form ONLY (our safe demo site)
            logger.info(f"Navigating to DEMO site: {demo_url}")
            self.driver.get(demo_url)
            
            # Wait for page to load
            self.wait.until(EC.presence_of_element_located((By.ID, "applicationForm")))
            
            # Fill City dropdown
            if data.get('city'):
                city_select = Select(self.wait.until(EC.element_to_be_clickable((By.ID, "city"))))
                city_select.select_by_visible_text(data['city'])
                logger.info(f"Selected city: {data['city']}")
                time.sleep(1)
            
            # Fill Consumer Number (map from consumer_number)
            if data.get('consumer_number'):
                consumer_field = self.wait.until(EC.element_to_be_clickable((By.ID, "consumerNumber")))
                consumer_field.clear()
                consumer_field.send_keys(data['consumer_number'])
                logger.info(f"Filled consumer number: {data['consumer_number']}")
                time.sleep(0.5)
            
            # Fill BP Number (map from bp_number)
            if data.get('bp_number'):
                bp_field = self.wait.until(EC.element_to_be_clickable((By.ID, "bpNumber")))
                bp_field.clear()
                bp_field.send_keys(data['bp_number'])
                logger.info(f"Filled BP number: {data['bp_number']}")
                time.sleep(0.5)
            
            # Fill Applicant Name
            if data.get('applicant_name'):
                name_field = self.wait.until(EC.element_to_be_clickable((By.ID, "applicantName")))
                name_field.clear()
                name_field.send_keys(data['applicant_name'])
                logger.info(f"Filled applicant name: {data['applicant_name']}")
                time.sleep(0.5)
            
            # Fill Mobile
            if data.get('mobile'):
                mobile_field = self.wait.until(EC.element_to_be_clickable((By.ID, "mobile")))
                mobile_field.clear()
                mobile_field.send_keys(data['mobile'])
                logger.info(f"Filled mobile: {data['mobile']}")
                time.sleep(0.5)
            
            # Fill Email (optional)
            if data.get('email'):
                email_field = self.wait.until(EC.element_to_be_clickable((By.ID, "email")))
                email_field.clear()
                email_field.send_keys(data['email'])
                logger.info(f"Filled email: {data['email']}")
                time.sleep(0.5)
            
            # Select Application Type
            if data.get('application_type'):
                app_type_select = Select(self.wait.until(EC.element_to_be_clickable((By.ID, "applicationType"))))
                app_type_select.select_by_value(data['application_type'])
                logger.info(f"Selected application type: {data['application_type']}")
                time.sleep(1)
            
            # Submit form
            submit_btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".submit-btn")))
            logger.info("Clicking submit button...")
            submit_btn.click()
            
            # Wait for success page and extract confirmation number
            self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".conf-number")))
            
            confirmation_element = self.driver.find_element(By.CSS_SELECTOR, ".conf-number")
            confirmation_number = confirmation_element.text.strip()
            
            logger.info(f"Adani Gas application submitted successfully. Confirmation: {confirmation_number}")
            
            # Take screenshot for proof
            screenshot_path = f"screenshots/adani_gas_{confirmation_number}.png"
            try:
                self.driver.save_screenshot(screenshot_path)
                logger.info(f"Screenshot saved: {screenshot_path}")
            except Exception as e:
                logger.warning(f"Could not save screenshot: {e}")
                screenshot_path = None
            
            # Close driver after successful submission
            self.close_driver()
            
            return {
                "success": True,
                "confirmation_number": confirmation_number,
                "message": "Adani Gas application submitted successfully via RPA",
                "screenshot_path": screenshot_path,
                "submitted_data": data
            }
            
        except Exception as e:
            logger.error(f"Adani Gas RPA submission failed: {str(e)}")
            
            # Take error screenshot
            try:
                if self.driver:
                    error_screenshot = f"screenshots/error_{int(time.time())}.png"
                    self.driver.save_screenshot(error_screenshot)
                    logger.info(f"Error screenshot saved: {error_screenshot}")
            except:
                pass
            
            return {
                "success": False,
                "error": str(e),
                "message": "Adani Gas RPA submission failed",
                "submitted_data": data
            }
            
        finally:
            # Always close driver
            self.close_driver()
    
    def submit_amc_water_application(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Submit application to demo AMC Water website with real Chrome automation"""
        try:
            logger.info(f"Starting AMC Water RPA submission for connection: {data.get('connection_id')}")
            
            # SAFETY CHECK: Only allow demo URLs
            demo_url = "http://localhost:8000/demo-govt/amc-water"
            
            logger.info(f"🛡️ SAFETY MODE: Using demo URL only - {demo_url}")
            
            # Setup driver in visible mode so user can see the auto-fill process
            self.setup_driver(headless=False)  # Visible mode to show RPA in action
            
            # Navigate to demo form ONLY (our safe demo site)
            logger.info(f"Navigating to DEMO site: {demo_url}")
            self.driver.get(demo_url)
            
            # Wait for page to load
            self.wait.until(EC.presence_of_element_located((By.ID, "applicationForm")))
            
            # Fill Zone dropdown (map from zone field)
            zone_value = data.get('zone', 'Central Zone')
            if zone_value:
                zone_select = Select(self.wait.until(EC.element_to_be_clickable((By.ID, "zone"))))
                zone_select.select_by_visible_text(zone_value)
                logger.info(f"Selected zone: {zone_value}")
                time.sleep(1)
            
            # Fill Connection ID (map from connection_id)
            if data.get('connection_id'):
                connection_field = self.wait.until(EC.element_to_be_clickable((By.ID, "connectionId")))
                connection_field.clear()
                connection_field.send_keys(data['connection_id'])
                logger.info(f"Filled connection ID: {data['connection_id']}")
                time.sleep(0.5)
            
            # Fill Applicant Name
            if data.get('applicant_name'):
                name_field = self.wait.until(EC.element_to_be_clickable((By.ID, "applicantName")))
                name_field.clear()
                name_field.send_keys(data['applicant_name'])
                logger.info(f"Filled applicant name: {data['applicant_name']}")
                time.sleep(0.5)
            
            # Fill Mobile
            if data.get('mobile'):
                mobile_field = self.wait.until(EC.element_to_be_clickable((By.ID, "mobile")))
                mobile_field.clear()
                mobile_field.send_keys(data['mobile'])
                logger.info(f"Filled mobile: {data['mobile']}")
                time.sleep(0.5)
            
            # Fill Email (optional)
            if data.get('email'):
                email_field = self.wait.until(EC.element_to_be_clickable((By.ID, "email")))
                email_field.clear()
                email_field.send_keys(data['email'])
                logger.info(f"Filled email: {data['email']}")
                time.sleep(0.5)
            
            # Select Application Type
            if data.get('application_type'):
                app_type_select = Select(self.wait.until(EC.element_to_be_clickable((By.ID, "applicationType"))))
                app_type_select.select_by_value(data['application_type'])
                logger.info(f"Selected application type: {data['application_type']}")
                time.sleep(1)
            
            # Submit form
            submit_btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".submit-btn")))
            logger.info("Clicking submit button...")
            submit_btn.click()
            
            # Wait for success page and extract confirmation number
            self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".conf-number")))
            
            confirmation_element = self.driver.find_element(By.CSS_SELECTOR, ".conf-number")
            confirmation_number = confirmation_element.text.strip()
            
            logger.info(f"AMC Water application submitted successfully. Confirmation: {confirmation_number}")
            
            # Take screenshot for proof
            screenshot_path = f"screenshots/amc_water_{confirmation_number}.png"
            try:
                self.driver.save_screenshot(screenshot_path)
                logger.info(f"Screenshot saved: {screenshot_path}")
            except Exception as e:
                logger.warning(f"Could not save screenshot: {e}")
                screenshot_path = None
            
            # Close driver after successful submission
            self.close_driver()
            
            return {
                "success": True,
                "confirmation_number": confirmation_number,
                "message": "AMC Water application submitted successfully via RPA",
                "screenshot_path": screenshot_path,
                "submitted_data": data
            }
            
        except Exception as e:
            logger.error(f"AMC Water RPA submission failed: {str(e)}")
            
            # Take error screenshot
            try:
                if self.driver:
                    error_screenshot = f"screenshots/error_{int(time.time())}.png"
                    self.driver.save_screenshot(error_screenshot)
                    logger.info(f"Error screenshot saved: {error_screenshot}")
            except:
                pass
            
            return {
                "success": False,
                "error": str(e),
                "message": "AMC Water RPA submission failed",
                "submitted_data": data
            }
            
        finally:
            # Always close driver
            self.close_driver()
    
    def submit_anyror_gujarat_application(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Submit application to demo AnyRoR Gujarat website with real Chrome automation"""
        try:
            logger.info(f"Starting AnyRoR Gujarat RPA submission for survey: {data.get('survey_number')}")
            
            # SAFETY CHECK: Only allow demo URLs
            demo_url = "http://localhost:8000/demo-govt/anyror-gujarat"
            
            logger.info(f"🛡️ SAFETY MODE: Using demo URL only - {demo_url}")
            
            # Setup driver in visible mode so user can see the auto-fill process
            self.setup_driver(headless=False)  # Visible mode to show RPA in action
            
            # Navigate to demo form ONLY (our safe demo site)
            logger.info(f"Navigating to DEMO site: {demo_url}")
            self.driver.get(demo_url)
            
            # Wait for page to load
            self.wait.until(EC.presence_of_element_located((By.ID, "applicationForm")))
            
            # Fill District dropdown (map from city field)
            if data.get('city'):
                district_select = Select(self.wait.until(EC.element_to_be_clickable((By.ID, "district"))))
                district_select.select_by_visible_text(data['city'])  # Using city as district
                logger.info(f"Selected district: {data['city']}")
                time.sleep(1)
            
            # Fill Survey Number (map from survey_number)
            if data.get('survey_number'):
                survey_field = self.wait.until(EC.element_to_be_clickable((By.ID, "surveyNumber")))
                survey_field.clear()
                survey_field.send_keys(data['survey_number'])
                logger.info(f"Filled survey number: {data['survey_number']}")
                time.sleep(0.5)
            
            # Fill Property ID (map from subdivision_number or property_id)
            property_id_value = data.get('subdivision_number') or data.get('property_id', '')
            if property_id_value:
                property_field = self.wait.until(EC.element_to_be_clickable((By.ID, "propertyId")))
                property_field.clear()
                property_field.send_keys(property_id_value)
                logger.info(f"Filled property ID: {property_id_value}")
                time.sleep(0.5)
            
            # Fill Applicant Name
            if data.get('applicant_name'):
                name_field = self.wait.until(EC.element_to_be_clickable((By.ID, "applicantName")))
                name_field.clear()
                name_field.send_keys(data['applicant_name'])
                logger.info(f"Filled applicant name: {data['applicant_name']}")
                time.sleep(0.5)
            
            # Fill Mobile
            if data.get('mobile'):
                mobile_field = self.wait.until(EC.element_to_be_clickable((By.ID, "mobile")))
                mobile_field.clear()
                mobile_field.send_keys(data['mobile'])
                logger.info(f"Filled mobile: {data['mobile']}")
                time.sleep(0.5)
            
            # Fill Email (optional)
            if data.get('email'):
                email_field = self.wait.until(EC.element_to_be_clickable((By.ID, "email")))
                email_field.clear()
                email_field.send_keys(data['email'])
                logger.info(f"Filled email: {data['email']}")
                time.sleep(0.5)
            
            # Select Application Type
            if data.get('application_type'):
                app_type_select = Select(self.wait.until(EC.element_to_be_clickable((By.ID, "applicationType"))))
                app_type_select.select_by_value(data['application_type'])
                logger.info(f"Selected application type: {data['application_type']}")
                time.sleep(1)
            
            # Submit form
            submit_btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".submit-btn")))
            logger.info("Clicking submit button...")
            submit_btn.click()
            
            # Wait for success page and extract confirmation number
            self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".conf-number")))
            
            confirmation_element = self.driver.find_element(By.CSS_SELECTOR, ".conf-number")
            confirmation_number = confirmation_element.text.strip()
            
            logger.info(f"AnyRoR Gujarat application submitted successfully. Confirmation: {confirmation_number}")
            
            # Take screenshot for proof
            screenshot_path = f"screenshots/anyror_{confirmation_number}.png"
            try:
                self.driver.save_screenshot(screenshot_path)
                logger.info(f"Screenshot saved: {screenshot_path}")
            except Exception as e:
                logger.warning(f"Could not save screenshot: {e}")
                screenshot_path = None
            
            # Close driver after successful submission
            self.close_driver()
            
            return {
                "success": True,
                "confirmation_number": confirmation_number,
                "message": "AnyRoR Gujarat application submitted successfully via RPA",
                "screenshot_path": screenshot_path,
                "submitted_data": data
            }
            
        except Exception as e:
            logger.error(f"AnyRoR Gujarat RPA submission failed: {str(e)}")
            
            # Take error screenshot
            try:
                if self.driver:
                    error_screenshot = f"screenshots/error_{int(time.time())}.png"
                    self.driver.save_screenshot(error_screenshot)
                    logger.info(f"Error screenshot saved: {error_screenshot}")
            except:
                pass
            
            return {
                "success": False,
                "error": str(e),
                "message": "AnyRoR Gujarat RPA submission failed",
                "submitted_data": data
            }
            
        finally:
            # Always close driver
            self.close_driver()

# Global RPA service instance
rpa_service = RPAService()